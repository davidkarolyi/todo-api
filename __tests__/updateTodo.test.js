const { testCase, setupTestDB } = require("./utils/setupTestDB");
const { todoIsInDB } = require("./utils/todoIsInDB");
const request = require("supertest");
const { app } = require("../src/server");

const { accessToken } = testCase.authors[0];
const { todoID } = testCase.todos[0];

const updatedTodo = {
  title: "wash dishes",
  body: "It is very important before guests arrive!",
};

beforeAll(async () => {
  await setupTestDB();
});

describe("PUT /api/todos/:todoID", () => {
  it("responds 403 Forbidden, if invalid access token provided", (done) => {
    request(app)
      .put(`/api/todos/${todoID}`)
      .set("Authorization", `Bearer fake.jwt.token`)
      .send(updatedTodo)
      .expect(403)
      .end(done);
  });
  it("responds with 400 Bad Request, when title is missing", (done) => {
    request(app)
      .put(`/api/todos/${todoID}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "", body: updatedTodo.body })
      .expect(400)
      .end(done);
  });
  it("responds with 400 Bad Request, when body is missing", (done) => {
    request(app)
      .put(`/api/todos/${todoID}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: updatedTodo.title })
      .expect(400)
      .end(done);
  });
  it("responds 404 Not Found, if todo doesn't exist with todoID", (done) => {
    request(app)
      .put("/api/todos/10")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedTodo)
      .expect(404)
      .end(done);
  });
  it("responds with 200 OK", (done) => {
    request(app)
      .put(`/api/todos/${todoID}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedTodo)
      .expect(200)
      .end(done);
  });
  it("successfully updated in the DB", async (done) => {
    expect(
      await todoIsInDB({ ...updatedTodo, todoID: 1, authorID: 1 })
    ).toEqual(true);
    done();
  });
});
