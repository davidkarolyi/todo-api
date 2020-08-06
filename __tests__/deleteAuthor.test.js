const { testCase, setupTestDB } = require("./utils/setupTestDB");
const { authorIsInDB } = require("./utils/authorIsInDB");
const { todoIsInDB } = require("./utils/todoIsInDB");
const request = require("supertest");
const { app } = require("../src/server");

const {
  accessToken,
  firstName,
  lastName,
  email,
  authorID,
} = testCase.authors[0];

beforeAll(async () => {
  await setupTestDB();
});

describe("DELETE /api/authors", () => {
  it("respons 403 Forbidden, when wrong token provided", (done) => {
    request(app)
      .delete("/api/authors")
      .set("Authorization", "Bearer fake.jwt.token")
      .expect(403)
      .end(done);
  });
  it("responds 200 OK, when author is authenticated", (done) => {
    request(app)
      .delete("/api/authors")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200)
      .end(done);
  });
  it("succesfully deleted the author", async (done) => {
    expect(
      await authorIsInDB({ firstName, lastName, email, authorID })
    ).toEqual(false);
    done();
  });
  it("succesfully deleted all todos of the author", async (done) => {
    for (let todo of testCase.todos) {
      expect(await todoIsInDB({ ...todo, authorID })).toEqual(false);
    }
    done();
  });
});
