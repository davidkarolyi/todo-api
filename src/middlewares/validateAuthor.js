const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

function validateAuthor(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token)
    res.status(401).json({ error: "missing token from authorization header" });
  else {
    const author = getTokenPayload(token);
    if (!author)
      res.status(403).json({ error: "invalid authentication token" });
    else {
      req.authorID = author.authorID;
      next();
    }
  }
}

function getTokenFromHeader(req) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return null;
  const [bearerPrefix, token] = authHeader.split(" ");
  return token;
}

function getTokenPayload(token) {
  let author = null;
  jwt.verify(token, JWT_SECRET, (error, payload) => {
    if (!error) author = payload;
  });
  return author;
}

module.exports = {
  validateAuthor,
};
