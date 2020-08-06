const express = require("express");
const { body } = require("express-validator");
const { validateAuthor } = require("../../middlewares/validateAuthor");
const {
  createAuthor,
  getAuthorByID,
  getAuthorByEmail,
  authorExistsWithEmail,
  updateAuthor,
  deleteAuthor,
} = require("../../db/operations");
const { validateRequest } = require("../../middlewares/validateRequest");
const { hashPassword, passwordMatchesHash, generateJWT } = require("./utils");

const authorsRouter = express.Router();

authorsRouter.get("/", validateAuthor, async (req, res, next) => {
  try {
    const author = await getAuthorByID(req.authorID);
    if (author) {
      const { firstName, lastName, email } = author;
      res.json({ firstName, lastName, email });
    } else {
      res
        .status(404)
        .json({ error: `author doesn't exists with ID: ${req.authorID}` });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = {
  authorsRouter,
};
