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

authorsRouter.post(
  "/auth",
  validateRequest(
    body("email").isEmail().isLength({ min: 1, max: 40 }),
    body("password").isLength({ min: 8, max: 40 })
  ),
  async (req, res, next) => {
    try {
      const author = await getAuthorByEmail(req.body.email);
      if (
        author &&
        (await passwordMatchesHash(req.body.password, author.passwordHash))
      ) {
        res.json({ accessToken: generateJWT(author.authorID) });
      } else res.status(403).json({ error: "wrong email or password" });
    } catch (error) {
      next(error);
    }
  }
);

authorsRouter.post(
  "/",
  validateRequest(
    body("email").isEmail().isLength({ min: 1, max: 40 }),
    body("password").isLength({ min: 8, max: 40 }),
    body("firstName").isString().isLength({ min: 1, max: 40 }),
    body("lastName").isString().isLength({ min: 1, max: 40 })
  ),
  async (req, res, next) => {
    try {
      if (await authorExistsWithEmail(req.body.email)) {
        res
          .status(409)
          .json({ error: "an author is already exists with this email" });
        return;
      }
      const passwordHash = await hashPassword(req.body.password);
      await createAuthor({ ...req.body, passwordHash });
      const { authorID } = await getAuthorByEmail(req.body.email);
      res.status(201).json({ accessToken: generateJWT(authorID) });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = {
  authorsRouter,
};
