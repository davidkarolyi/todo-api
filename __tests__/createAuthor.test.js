const { testCase, setupTestDB } = require("./utils/setupTestDB");
const { authorIsInDB } = require("./utils/authorIsInDB");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { app } = require("../src/server");

const { firstName, lastName, email, password } = testCase.authors[0];

beforeAll(async () => {
  await setupTestDB();
});

describe("POST /api/authors", () => {
  it("responds 400 Bad Request, when the request body is empty", (done) => {
    request(app).post("/api/authors").send({}).expect(400).end(done);
  });
  it("responds 400 Bad Request, when firstName is empty", (done) => {
    request(app)
      .post("/api/authors")
      .send({ firstName: "", lastName, email, password })
      .expect(400)
      .end(done);
  });
  it("responds 400 Bad Request, when lastName is empty", (done) => {
    request(app)
      .post("/api/authors")
      .send({ firstName, lastName: "", email, password })
      .expect(400)
      .end(done);
  });
  it("responds 400 Bad Request, when email is invalid", (done) => {
    request(app)
      .post("/api/authors")
      .send({ firstName, lastName, email: "somebad@email", password })
      .expect(400)
      .end(done);
  });
  it("responds 400 Bad Request, when password is less than 8 characters", (done) => {
    request(app)
      .post("/api/authors")
      .send({ firstName, lastName, email, password: "1234567" })
      .expect(400)
      .end(done);
  });
  it("responds 409 Conflict, if try to create a user with exisitng email", (done) => {
    request(app)
      .post("/api/authors")
      .send({ firstName, lastName, email, password })
      .expect(409)
      .end(done);
  });
  it("responds without an accessToken, if try to create a user with exisitng email", (done) => {
    request(app)
      .post("/api/authors")
      .send({ firstName, lastName, email, password })
      .expect((res) => {
        expect(res.body.accessToken).toEqual(undefined);
      })
      .end(done);
  });
  it("responds 201 Created and valid access token, when new author can be created", (done) => {
    request(app)
      .post("/api/authors")
      .send({
        firstName: "Alice",
        lastName: "Smith",
        email: "alicesmith@gmail.com",
        password: "12345678",
      })
      .expect(201)
      .expect((res) => {
        const { accessToken } = res.body;
        expect(jwt.verify(accessToken, process.env.JWT_SECRET)).toBeTruthy();
      })
      .end(done);
  });
  it("author is created in the database", async (done) => {
    expect(
      await authorIsInDB({
        firstName: "Alice",
        lastName: "Smith",
        email: "alicesmith@gmail.com",
        authorID: 2,
      })
    ).toEqual(true);
    done();
  });
});
