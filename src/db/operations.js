const { executeQuery, executeTransaction } = require("./executeQuery");

async function tableExists(tableName) {
  const {
    rows,
  } = await executeQuery(
    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name=$1);`,
    [tableName.toLowerCase()]
  );
  return rows[0].exists;
}
async function authorExistsWithEmail(email) {
  const author = await getAuthorByEmail(email);
  return !!author;
}

async function getAuthorByID(authorID) {
  const {
    rows,
  } = await executeQuery(`SELECT * FROM authors WHERE author_id = $1;`, [
    authorID,
  ]);
  if (rows.length) {
    const { first_name, last_name, email, author_id, password_hash } = rows[0];
    return {
      firstName: first_name,
      lastName: last_name,
      email: email,
      authorID: author_id,
      passwordHash: password_hash,
    };
  }
  return null;
}

async function getAuthorByEmail(email) {
  const { rows } = await executeQuery(
    `SELECT * FROM authors WHERE email = $1;`,
    [email]
  );
  if (rows.length) {
    const { first_name, last_name, email, author_id, password_hash } = rows[0];
    return {
      firstName: first_name,
      lastName: last_name,
      email: email,
      authorID: author_id,
      passwordHash: password_hash,
    };
  }
  return null;
}

async function createAuthor({ email, passwordHash, firstName, lastName }) {
  await executeQuery(
    `INSERT INTO 
    authors(email, password_hash, first_name, last_name) 
    VALUES($1, $2, $3, $4);`,
    [email, passwordHash, firstName, lastName]
  );
}

async function updateAuthor({ firstName, lastName, authorID }) {
  await executeQuery(
    `UPDATE authors SET first_name=$1, last_name=$2 WHERE author_id=$3;`,
    [firstName, lastName, authorID]
  );
}

async function deleteAuthor(authorID) {
  await executeTransaction([
    {
      queryText: `DELETE FROM todos WHERE author_id = $1;`,
      params: [authorID],
    },
    {
      queryText: `DELETE FROM authors WHERE author_id = $1;`,
      params: [authorID],
    },
  ]);
}

async function todoExistsUnderAuthor({ todoID, authorID }) {
  const { rows } = await executeQuery(
    `SELECT todo_id FROM todos 
    WHERE todo_id = $1 AND author_id = $2`,
    [todoID, authorID]
  );
  return !!rows.length;
}

async function getTodosByAuthorID(authorID) {
  const { rows } = await executeQuery(
    `SELECT title, body, todo_id 
    FROM todos 
    WHERE author_id = $1;`,
    [authorID]
  );
  return rows.map((todo) => ({
    todoID: todo.todo_id,
    body: todo.body,
    title: todo.title,
  }));
}

async function updateTodo({ todoID, authorID, title, body }) {
  await executeQuery(
    `UPDATE todos 
    SET title=$1, body=$2 
    WHERE todo_id=$3 AND author_id=$4;`,
    [title, body, todoID, authorID]
  );
}

async function createTodo({ authorID, title, body }) {
  const { rows } = await executeQuery(
    `INSERT INTO 
    todos(author_id, title, body) 
    VALUES($1, $2, $3)
    RETURNING todo_id, title, body;`,
    [authorID, title, body]
  );
  return {
    todoID: rows[0].todo_id,
    title: rows[0].title,
    body: rows[0].body,
  };
}

async function deleteTodo({ todoID, authorID }) {
  await executeQuery(
    `DELETE FROM todos 
    WHERE todo_id = $1 AND author_id = $2;`,
    [todoID, authorID]
  );
}

module.exports = {
  tableExists,
  getAuthorByID,
  getAuthorByEmail,
  authorExistsWithEmail,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getTodosByAuthorID,
  todoExistsUnderAuthor,
  updateTodo,
  createTodo,
  deleteTodo,
};
