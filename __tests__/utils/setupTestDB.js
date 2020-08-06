require("dotenv").config();
const jwt = require("jsonwebtoken");
const { applySchemaIfNotExists } = require("../../src/db/schema");
const { executeQuery } = require("../../src/db/executeQuery");

const testCase = {
  authors: [
    {
      email: "johndoe@gmail.com",
      firstName: "John",
      lastName: "Doe",
      password: "12345678",
      passwordHash:
        "$2b$10$V.3yBLDype5OmX3AjYtbLOx73iJUW1MRAPoaduVYoYXuEFE7NvPji",
      authorID: 1,
      accessToken: jwt.sign({ authorID: 1 }, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      }),
    },
  ],
  todos: [
    {
      title: "Clean my room",
      body: "It's really messy",
      todoID: 1,
      authorID: 1,
    },
    {
      title: "Meet with Alice",
      body: "We are so great friends",
      todoID: 2,
      authorID: 1,
    },
  ],
};

async function setupTestDB(params) {
  await resetDB();
  await addAuthorsToDB();
  await addTodosToDB();
}

async function resetDB(params) {
  await tryToDeleteTables();
  await applySchemaIfNotExists();
}

async function tryToDeleteTables(params) {
  try {
    await executeQuery(`DROP TABLE todos`);
  } catch (err) {}
  try {
    await executeQuery(`DROP TABLE authors`);
  } catch (err) {}
}

async function addAuthorsToDB() {
  for (let author of testCase.authors) {
    await executeQuery(
      `INSERT INTO 
    authors(email, password_hash, first_name, last_name) 
    VALUES($1, $2, $3, $4);`,
      [author.email, author.passwordHash, author.firstName, author.lastName]
    );
  }
}

async function addTodosToDB() {
  for (let todo of testCase.todos) {
    await executeQuery(
      `INSERT INTO 
      todos(author_id, title, body) 
      VALUES($1, $2, $3);`,
      [todo.authorID, todo.title, todo.body]
    );
  }
}

module.exports = {
  testCase,
  setupTestDB,
};
