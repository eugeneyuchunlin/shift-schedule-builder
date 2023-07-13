# Schedule Builder

## Description

This web application allows users to create a working shift for their employees. Users can add the number of workers, the number of days, and most importantly, some shift constraints. The application will automatically generate a schedule for them based on the given data and constraints. Users can also save their shifts, load them later, and recalculate them.

The shift scheduling problem is modeled by the quadratic unconstrained binary optimization (QUBO) problem. The QUBO problem is then solved by the digital annealing unit. The solution is then post-processed to generate the final schedule.

## Execute

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
# MONGODB_URL="mongodb+srv://<username>:<password>@shift-helper.twhfqvg.mongodb.net/?retryWrites=true&w=majority"

# Use MongoDB on your localhost
MONGODB_URL="mongodb://<username>:<password>@localhost:27017/?w=majority"
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

### Setup Virtual Environment

```bash=
$ python3 -m venv venv
$ source venv/bin/activate
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

