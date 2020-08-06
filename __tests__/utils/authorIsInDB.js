const { executeQuery } = require("../../src/db/executeQuery");

async function authorIsInDB({ firstName, lastName, email, authorID }) {
  const {
    rows,
  } = await executeQuery(`SELECT * FROM authors WHERE author_id = $1`, [
    authorID,
  ]);
  if (!rows.length) return false;
  const row = rows[0];
  if (
    firstName === row.first_name &&
    lastName === row.last_name &&
    email === row.email
  )
    return true;
  return false;
}

module.exports = {
  authorIsInDB,
};
