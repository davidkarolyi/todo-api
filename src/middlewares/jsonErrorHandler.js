async function jsonErrorHandler(error, req, res, next) {
  res.status(error.statusCode || 500).send({ error: error.message });
}

module.exports = {
  jsonErrorHandler,
};
