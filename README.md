# Schedule Builder

## Description

This is a web application that allows users to create a working shift for their employees. Users can add number of workers, numebr of days and most importantly, the some shift constraints. The application will automatically generate a schedule for them based on the given data and constraints. Users can also save their schedule, load it later, and recalcualte it.

The shift scheduling problem is modeled by the qudratic unconstrained binary optimization (QUBO) problem. The QUBO problem is then solved by the digital annealing unit. The solution is then post-processed to generate the final schedule.

## Execute

### Setup Virtual Environment

```bash
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

1. Redis. Please make sure you have redis image installed.
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

