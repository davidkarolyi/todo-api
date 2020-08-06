const express = require("express");
const { body, param } = require("express-validator");
const { validateAuthor } = require("../../middlewares/validateAuthor");
const {
  createTodo,
  getTodosByAuthorID,
  deleteTodo,
  updateTodo,
  todoExistsUnderAuthor,
} = require("../../db/operations");
const { validateRequest } = require("../../middlewares/validateRequest");

const todosRouter = express.Router();

todosRouter.get("/", validateAuthor, async (req, res, next) => {
  try {
    const todos = await getTodosByAuthorID(req.authorID);
    res.json({ todos });
  } catch (error) {
    next(error);
  }
});


module.exports = {
  todosRouter,
};
