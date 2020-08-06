const { validationResult } = require("express-validator");

function validateRequest(...validationMiddlewares) {
  return [...validationMiddlewares, sendValidationErrors];
}

async function sendValidationErrors(req, res, next) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty())
    res.status(400).json({
      error: validationErrors
        .array()
        .map((err) => `invalid or missing value of "${err.param}"`)[0],
    });
  else next();
}

module.exports = {
  validateRequest,
};
