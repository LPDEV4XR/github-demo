# Github API Demo

### Installation steps

```bash
$ git clone https://github.com/LPDEV4XR/github-demo.git
$ docker compose up -d
```

The app will be mounted on [http://localhost:3308/](http://localhost:3308/)

### The routes are:

## Endpoint 1
### [http://localhost:3308/users/:user](http://localhost:3308/users/:user)
- This endpoint will get the information and register on a local database (Postgres), only the records obtained here will be used on the other routes.

## Endpoint 2
### [http://localhost:3308/repos/:user](http://localhost:3308/repos/:user)
- This endpoint obtains all repos from a given user and returns them.

## Endpoint 3
### [http://localhost:3308/search?id=&description=&language=&name=&username=](http://localhost:3308/search?)
- *id*: The id of the repo (on database).
- *description*: The description of repo. (Default value is "No description.")
- *language*: The main language of the repo. (Default value is "No main language.")
- *name*: The name of the repo.
- *username*: The name of the repo creator.  
- This endpoint search through any of the given parameters and will returned the union (all repos that agree with any of the query parameters). To be clear, you only use the query parameters that you need.