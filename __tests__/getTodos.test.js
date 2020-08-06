const { testCase, setupTestDB } = require("./utils/setupTestDB");
const request = require("supertest");
const { app } = require("../src/server");

const { accessToken } = testCase.authors[0];
const todos = testCase.todos.map((todo) => {
  return { todoID: todo.todoID, title: todo.title, body: todo.body };
});

beforeAll(async () => {
  await setupTestDB();
});

describe("GET /api/todos", () => {
  it("responds 403 Forbidden, with fake access token", (done) => {
    request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer fake.jwt.token`)
      .expect(403)
      .end(done);
  });
  it("responds with 200 OK, with valid access token", (done) => {
    request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
      .end(done);
  });
  it("responds with correct todo list, with valid access token", (done) => {
    request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect((res) => {
        expect(res.body.todos).toEqual(todos);
      })
      .end(done);
  });
});
