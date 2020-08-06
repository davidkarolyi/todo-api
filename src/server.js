const express = require("express");
const { authorsRouter } = require("./routes/authors");
const { todosRouter } = require("./routes/todos");
const { applySchemaIfNotExists } = require("./db/schema");
const { jsonErrorHandler } = require("./middlewares/jsonErrorHandler");

const app = express();

app.use(express.json());
app.use("/api/authors", authorsRouter);
app.use("/api/todos", todosRouter);
app.use(jsonErrorHandler);

async function startServer() {
  await applySchemaIfNotExists();
  app.listen(3000, () => {
    console.log("todo-api listening on localhost:3000");
  });
}

module.exports = {
  app,
  startServer,
};
