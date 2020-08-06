const { testCase, setupTestDB } = require("./utils/setupTestDB");
const { authorIsInDB } = require("./utils/authorIsInDB");
const request = require("supertest");
const { app } = require("../src/server");

const { accessToken, email, authorID } = testCase.authors[0];
const firstName = "Alice";
const lastName = "Smith";

beforeAll(async () => {
  await setupTestDB();
});

describe("PUT /api/authors/", () => {
  it("responds 400 Bad Request, when firstName is invalid", (done) => {
    request(app)
      .put("/api/authors")
      .send({ lastName, firstName: "" })
      .expect(400)
      .end(done);
  });
  it("responds 400 Bad Request, when lastName is invalid", (done) => {
    request(app)
      .put("/api/authors")
      .send({ lastName: "", firstName })
      .expect(400)
      .end(done);
  });
  it("responds 403 Forbidden, when wrong token provided", (done) => {
    request(app)
      .put("/api/authors")
      .set("Authorization", "Bearer fake.jwt.token")
      .send({ firstName, lastName })
      .expect(403)
      .end(done);
  });
  it("responds 200 OK, when authenticated and correct params provided", (done) => {
    request(app)
      .put("/api/authors/")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ firstName, lastName })
      .expect(200)
      .end(done);
  });
  it("successfully updated in the DB", async (done) => {
    expect(
      await authorIsInDB({ authorID, firstName, lastName, email })
    ).toEqual(true);
    done();
  });
});
