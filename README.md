# Shift Schedule Builder

https://arxiv.org/abs/2302.09459

## Introduction

The Shift Schedule Builder is a web application designed to simplify the task of shift arrangement for users. Its primary aim is to provide a user-friendly interface that allows users to input their shift requirements and configurations easily, such as the number of workers and the number of days.
![](https://github.com/yuchun1214/shift-schedule-builder/blob/main/docs/images/shift-configuration.gif)


In addition to basic shift parameters, users are able to add some shift requirements. The application will automatically generate a schedule for them based on the given data and constraints. For example, users are able to set the expected number of workers per shift to 8. Then the algorithm would take this constraint into account when you press the `Run` button.


The application shows the weighted quality score in real-time based on your current shift and requirements. If the shift is modified and the requirement is fulfilled party, the quality score would increase to some extent, and vice versa. For example, when the user adds a requirement, the expected number of workers per shift, and set the parameter to 8 and the weight to 5. The shift is modified and adds some days off to satisfy the requirements. The quality score increases.

![](https://github.com/yuchun1214/shift-schedule-builder/blob/main/docs/images/shift-score.gif)

The utility bar offers multiple functions. They could be used to calculate, reload, reset, customize leave, and most importantly, save. The functions of the utility bar could be extended. If you have any new ideas, please write them precisely on the repo's issues page of the repo, and I'll take them into account in the next version.

## User Interface

The application is built using a combination of the [Next.js](https://https://nextjs.org/) framework and the [Django](https://www.djangoproject.com/) framework. Next.js extends the capabilities of the [React.js](https://react.dev/) framework and enables the creation of interactive user interfaces. It handles the rendering of the user interface and provides basic CRUD (Create, Read, Update, Delete) functions for [MongoDB](https://www.mongodb.com/).

However, the JavaScript language alone is unable to effectively model the shift scheduling problem as a Quadratic Unconstrained Binary Optimization problem (QUBO). To address this, Python is utilized to handle the computational aspect. For this purpose, the Django framework is employed. Django receives the shift configuration, compiles it, sends the problem to Fujitsu's server, retrieves the solution, decodes it, and finally stores the shift information in the database.

To facilitate communication between the user interface and the computational processes, a web socket is used as the communication protocol. This enables the user interface to update the status of the submitted task and retrieve the solution as it is ready. The web socket enhances the user experience since the computation task is a long-running task and it would probably block or make the HTTP request stall.

## Algorithm

The shift scheduling problem is modeled by the quadratic unconstrained binary optimization (QUBO) problem. 0 represents a day off and 1 represents a working day. Once the user adds shift requirements, they implicitly formulate their QUBO problem. The QUBO problem is solved by the [digital annealer](https://www.fujitsu.com/global/services/business-services/digital-annealer/). The solution is then post-processed to generate the final schedule. 

In the current version [v0.2](https://github.com/yuchun1214/shift-schedule-builder/tree/v0.2), the application offers limited shift requirements for users to choose from. The available shift requirements are listed and explained in detail below. The source code of the mathematic constraints is written in this file [constraints.py](https://github.com/yuchun1214/shift-schedule-builder/blob/main/computation_backend/dau_gateway/constraints.py)

### The Expected Number of Working Days

This requirement could be added to define the number of working days in the shift range. Workers in the shift are expected to have equal working days. The mathematical formulation for $N$ workers and $D$ days shift is as follow:

$$H = \sum_{i}^{N} \left( \sum_{j}^{D}x_{ij} - \alpha \right)^2,
$$

where $\alpha$ is the expected number of working days, and $H$ is the hamiltonian.

### The Expected Number of Workers per Shift

The following constraint defines the expected number of workers in each shift. This constraint is common and used to balance the workforce and the workload each day. The constraint is modeled by summing up the variables on each shift and minus the expected number of workers and, finally, double themselves and make them quadratic. The mathematical formulation is as follows:(The situation is the same as the one used above)

$$H = \sum_{j}^{D}\left( \sum_{i}^{N} - \beta\right)^2,
$$

where $\beta$ is the expected number of workers each shift.

### Successive Shift Pair

This constraint is placed to make each worker has at least two consecutive shift. Here's the situation we don't want. The concept is shown below in regular expression form

`((0|1)*0 | 0*)1(0* | 0(0|1)*)`

To be simple, the mathematical formulation separates the boundary situations, `(0|1)*01` and `10(0|1)*`, and the general situation, `(0|1)*010(0|1)*`.

### Consecutive 2 days Leave

This is a soft constraint for days off preference. When this constraint is employed, the algorithm would try to arrange the days off together.

The mathematical formulation is as follows:
$$H = \sum_{i}^N\sum_{j}^{D-1}\left(1-x_{i,j} * x_{i,j+1}\right)$$.

### No Consecutive 2 Days Leave

This constraint is an opposite version of the above constraint. The mathematical formulation is as follows:
$$H = \sum_{i}^N\sum_{j}^{D-1}\left[(1-x_{i,j}) * (1 - x_{i,j+1})\right]$$.

### Shift Preference

Workers are able to set up their shift preferences. They can designate which day they want to take a day off or which day they want to work. The algorithm would try to fulfill each worker's requirement.

The mathematical formulation is as follows:
$$H = \sum_{i}^N\sum_{j}^Dx_{ij}-q_{ij}$$

*Days off preference is now avaliable in v0.2, and working days preference will be avaliable in v0.3.*


### The Maximum Consecutive Shifts

The constraint setup a limit on the maximum number of consecutive shifts. 

This constraint could be modeled by using the supplementary variables. However, this would result in increasing the problem scale. This technique would probably double or triple the number of original variables. Moreover, the solver, Fujitsu's digital annealer, doesn't know the meaning of each variable after compiling the solution into the accepted data; thus, after the annealing process, it would be possible to find a better solution.

The digital annealer computation service offers users to post the inequality. Please refer to this [link](https://portal.aispf.global.fujitsu.com/apidoc/da/en/index.html) for more detail. 

The inequalities would be an array and append the following inequality.

$$\sum_{j}^{j+\gamma + 1}x_{ij} \leq \gamma, \   \forall i\in[1, N],\  j\in [1, D-\gamma - 1]$$

where $\gamma$ is the maximum consecutive shifts

### Minimum N-days leave within 7 days

The constraint is for employees' days off welfare. The employees working in graveyard shifts need to have days off in a range.

*This constraint is now avaliable in v0.2, but it would be overhauled in the future.*

## Execute

### Preliminary Setup

Please make sure you have **[Python](https://www.python.org/)**, and **[Node.js](https://nodejs.org/en)** install on your computer. 

If you use **MacOS**, I recommend you install packages by using the [HomeBrew](https://brew.sh/) package manager.

Here's the recommended version of Python and Node.js
* Python 3.11.4
* Node.js: v20.4.0

### Setup keys and the database connection config

#### Computation Backend

```bash=
$ cd computation_backend
$ touch .env
```
Put the following content into your `.env` file

```bash=
DMA_API_KEY="<your digital annealing management API key>"
DMA_URL="https://dau.emath.tw"
DAU_API_KEY="<your Fujitsu digital annealing unit computation service API key>"
DAU_URL="https://api.aispf.global.fujitsu.com"

# Use MongoDB altas Database
# MONGODB_URI="mongodb+srv://<username>:<password>@shift-helper.twhfqvg.mongodb.net/?retryWrites=true&w=majority"

# Use MongoDB on your localhost
MONGODB_URI="mongodb://<username>:<password>@localhost:27017/?w=majority"
```

#### Frontend

```bash=
$ cd sched-helper
$ touch .env.local
```

Put the following content into your `.env.local` file

```bash=
MONGODB_URI=mongodb://<username>:<password>@localhost:27017/?w=majority
```

**Please makesure the URIs in `.env.local` and `.env` are the same**

### Setup Environment


#### Python

```bash=
$ python3 -m venv venv
$ source venv/bin/activate
```

#### Node.js

I recommend you install [nvm](https://github.com/nvm-sh/nvm) to manage your Node version.

```bash=
$ nvm install 20.0.4
$ nvm use 20.0.4
```

### Install Dependencies

**python dependencies**
```bash=
$ python3 -m pip install -r requirements.txt
```

**JavaScript dependencies**
```bash=
$ cd sched-helper
$ npm install
```

## Run

There are four servers you have to execute.

1. Redis. Please make sure you have the Redis image installed.
```bash=
$ docker run -p 6379:6379 -d redis:0
```

2. Celery
```bash=
$ cd computation_backend
$ celery -A computation_backend worker -l INFO
```

3. Next.js server
```bash=
$ cd sched-helper
$ npm run dev
```
4. Django server
```bash=
$ cd computation_backend
$ python3 manage.py runserver
```

Visit http://localhost:3000/dashboard to see the web application.

