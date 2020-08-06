const { Client } = require("pg");

const config = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
};

async function executeQuery(queryText, params) {
  let errorDuringExecution = null;
  let result = null;
  const client = new Client(config);
  await client.connect();
  try {
    result = await client.query(queryText, params);
  } catch (error) {
    errorDuringExecution = error;
  } finally {
    await client.end();
    if (errorDuringExecution) throw errorDuringExecution;
  }
  return result;
}

async function executeTransaction(querieObjects) {
  let errorDuringTransaction = null;
  const client = new Client(config);
  await client.connect();
  try {
    await client.query("BEGIN");
    for (queryObject of querieObjects) {
      await client.query(queryObject.queryText, queryObject.params);
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    errorDuringTransaction = error;
  } finally {
    await client.end();
    if (errorDuringTransaction) throw errorDuringTransaction;
  }
}

module.exports = {
  executeQuery,
  executeTransaction,
};
