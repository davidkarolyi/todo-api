const { testCase, setupTestDB } = require("./utils/setupTestDB");
const { todoIsInDB } = require("./utils/todoIsInDB");
const request = require("supertest");
const { app } = require("../src/server");

const { accessToken } = testCase.authors[0];
const deletedTodo = testCase.todos[0];
const remainingTodo = testCase.todos[1];

beforeAll(async () => {
  await setupTestDB();
});

describe("DELETE /api/todos/:todoID", () => {
  it("responds 403 Forbidden, if invalid access token provided", (done) => {
    request(app)
      .delete(`/api/todos/${deletedTodo.todoID}`)
      .set("Authorization", `Bearer fake.jwt.token`)
      .expect(403)
      .end(done);
  });
  it("responds 404 Not Found, if todo doesn't exist with todoID", (done) => {
    request(app)
      .delete("/api/todos/10")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(404)
      .end(done);
  });
  it("responds with 200 OK", (done) => {
    request(app)
      .delete(`/api/todos/${deletedTodo.todoID}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
      .end(done);
  });
  it("successfully deleted todo from the DB", async (done) => {
    expect(await todoIsInDB(deletedTodo)).toEqual(false);
    done();
  });
  it("other todo remain intact in the DB", async (done) => {
    expect(await todoIsInDB(remainingTodo)).toEqual(true);
    done();
  });
});
