const { executeQuery } = require("../../src/db/executeQuery");

async function todoIsInDB({ todoID, authorID, title, body }) {
  const { rows } = await executeQuery(
    `SELECT * FROM todos 
    WHERE author_id = $1 AND todo_id = $2`,
    [authorID, todoID]
  );
  if (!rows.length) return false;
  const row = rows[0];
  if (title === row.title && body === row.body) return true;
  return false;
}

module.exports = {
  todoIsInDB,
};
