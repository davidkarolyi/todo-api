const { testCase, setupTestDB } = require("./utils/setupTestDB");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { app } = require("../src/server");

const { email, password } = testCase.authors[0];

beforeAll(async () => {
  await setupTestDB();
});

describe("POST /api/authors/auth", () => {
  it("responds 400 Bad Request, when email is invalid", (done) => {
    request(app)
      .post("/api/authors/auth")
      .send({ email: "somebad@email", password })
      .expect(400)
      .end(done);
  });
  it("responds 400 Bad Request, when password isn't provided", (done) => {
    request(app)
      .post("/api/authors/auth")
      .send({ email })
      .expect(400)
      .end(done);
  });
  it("responds 403 Forbidden, when author not exists", (done) => {
    request(app)
      .post("/api/authors/auth")
      .send({ email: "alicesmith@gmail.com", password: "12345678" })
      .expect(403)
      .end(done);
  });
  it("responds 200 OK, when correct credentials provided", (done) => {
    request(app)
      .post("/api/authors/auth")
      .send({ email, password })
      .expect(200)
      .end(done);
  });
  it("responds with an access token, when correct credentials provided", (done) => {
    request(app)
      .post("/api/authors/auth")
      .send({ email, password })
      .expect((res) => {
        expect(res.body.accessToken).not.toEqual(undefined);
      })
      .end(done);
  });
  it("responds with a valid access token, when correct credentials provided", (done) => {
    request(app)
      .post("/api/authors/auth")
      .send({ email, password })
      .expect((res) => {
        const { accessToken } = res.body;
        expect(jwt.verify(accessToken, process.env.JWT_SECRET)).toBeTruthy();
      })
      .end(done);
  });
  it("responds with 403 Forbidden, if credentials are wrong", (done) => {
    request(app)
      .post("/api/authors/auth")
      .send({ email, password: "wrongPassword" })
      .expect(403)
      .end(done);
  });
});
