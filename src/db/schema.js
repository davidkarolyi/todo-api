const { executeQuery } = require("./executeQuery");
const { tableExists } = require("./operations");

const AUTHORS = "authors";
const TODOS = "todos";

async function applySchemaIfNotExists() {
  if (!(await tableExists(AUTHORS))) await createAuthorsTable();
  if (!(await tableExists(TODOS))) await createTodosTable();
}

async function createAuthorsTable() {
  await executeQuery(`
  	CREATE TABLE ${AUTHORS} (
      author_id SERIAL PRIMARY KEY,
      email VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(80) NOT NULL,
    	first_name VARCHAR(50) NOT NULL,
    	last_name VARCHAR(50) NOT NULL
    )
  `);
}

async function createTodosTable() {
  await executeQuery(`
    CREATE TABLE ${TODOS} (
			todo_id SERIAL PRIMARY KEY,
			author_id INTEGER REFERENCES ${AUTHORS}(author_id),
      title VARCHAR(50) NOT NULL,
      body VARCHAR(250)
    )
  `);
}

module.exports = {
  applySchemaIfNotExists,
};
