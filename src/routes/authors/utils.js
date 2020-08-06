const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, TOKEN_EXPIRATION } = process.env;

async function hashPassword(password) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

async function passwordMatchesHash(password, passwordHash) {
  return await bcrypt.compare(password, passwordHash);
}

function generateJWT(authorID) {
  return jwt.sign({ authorID }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
}

module.exports = {
  hashPassword,
  passwordMatchesHash,
  generateJWT,
};
