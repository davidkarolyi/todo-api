const { testCase, setupTestDB } = require("./utils/setupTestDB");
const request = require("supertest");
const { app } = require("../src/server");

const { firstName, lastName, email, accessToken } = testCase.authors[0];

beforeAll(async () => {
  await setupTestDB();
});

describe("GET /api/authors", () => {
  it("responds 401 Unauthorized, when token not provided", (done) => {
    request(app).get("/api/authors").expect(401).end(done);
  });
  it("responds 403 Forbidden, when fake token is provided", (done) => {
    request(app)
      .get("/api/authors")
      .set("Authorization", "Bearer fake.jwt.token")
      .expect(403)
      .end(done);
  });
  it("responds 200 OK, when author is authenticated", (done) => {
    request(app)
      .get("/api/authors")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
      .end(done);
  });
  it("responds with correct author data, when author is authenticated", (done) => {
    request(app)
      .get("/api/authors")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect((res) => {
        expect(res.body).toEqual({ firstName, lastName, email });
      })
      .end(done);
  });
});
