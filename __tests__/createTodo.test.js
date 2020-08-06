const { testCase, setupTestDB } = require("./utils/setupTestDB");
const { todoIsInDB } = require("./utils/todoIsInDB");
const request = require("supertest");
const { app } = require("../src/server");

const { accessToken } = testCase.authors[0];
const addedTodo = {
  title: "wash dishes",
  body: "It is very important before guests arrive!",
};

beforeAll(async () => {
  await setupTestDB();
});

describe("POST /api/todos", () => {
  it("responds 403 Forbidden, if invalid access token provided", (done) => {
    request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer fake.jwt.token`)
      .send(addedTodo)
      .expect(403)
      .end(done);
  });
  it("responds with 400 Bad Request, when title is missing", (done) => {
    request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "", body: addedTodo.body })
      .expect(400)
      .end(done);
  });
  it("responds with 400 Bad Request, when body is missing", (done) => {
    request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: addedTodo.title })
      .expect(400)
      .end(done);
  });
  it("responds with 201 Created, and sends back the created item", (done) => {
    request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(addedTodo)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({ ...addedTodo, todoID: 3 });
      })
      .end(done);
  });
  it("successfully inserted into the DB", async (done) => {
    expect(await todoIsInDB({ ...addedTodo, todoID: 3, authorID: 1 })).toEqual(
      true
    );
    done();
  });
});
