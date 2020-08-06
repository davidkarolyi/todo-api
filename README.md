# todo-api

Simple REST API for serving a ToDo application, by authenticating authors with JWT and providing the basic CRUD interface to manipulate ToDos.

# Running the Application

> **Dependencies**:
>
> - `docker`
> - `docker-compose` (only need to install separately on linux)
> - `node` (tests only)
> - `npm` (tests only)

To start up the application run `docker-compose up` in the project root.
This will start two separate containers, a `postgresql` database instance, and the express web server, which will listening on `localhost:3000`.

For running tests:

- execute `npm install` to install dependencies on the local environment.
- execute `npm run test:db` this will start up a test database in a docker container.
- in a new terminal run `npm test`.

# API Interface

| Method |         Path         |                                Request Body                                |                      Response Body                       | Protected |
| :----: | :------------------: | :------------------------------------------------------------------------: | :------------------------------------------------------: | :-------: |
|  GET   |    `/api/authors`    |                                     ❌                                     | `{ firstName: string, lastName: string, email: string }` |    ✅     |
|  POST  |    `/api/authors`    | `{ firstName: string, lastName: string, email: string, password: string }` |                `{ accessToken: string }`                 |    ❌     |
|  POST  | `/api/authors/auth`  |                   `{ email: string, password: string }`                    |                `{ accessToken: string }`                 |    ❌     |
|  PUT   |    `/api/authors`    |                 `{ firstName: string, lastName: string }`                  |                            ❌                            |    ✅     |
| DELETE |    `/api/authors`    |                                     ❌                                     |                            ❌                            |    ✅     |
|  GET   |     `/api/todos`     |                                     ❌                                     |      `{ todoID: int, title: string, body: string }`      |    ✅     |
|  POST  |     `/api/todos`     |                     `{ title: string, body: string }`                      |      `{ todoID: int, title: string, body: string }`      |    ✅     |
|  PUT   | `/api/todos/:todoID` |                     `{ title: string, body: string }`                      |                            ❌                            |    ✅     |
| DELETE | `/api/todos/:todoID` |                                     ❌                                     |                            ❌                            |    ✅     |

# Tip for the Reviewer

Tried to rebase commit messages into digastable chunks. Feel free to review the code commit by commit, there are no conflicting changes in the commit tree.
