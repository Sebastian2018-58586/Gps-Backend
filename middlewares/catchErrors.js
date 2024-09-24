const { response } = require("express");
const { validationResult } = require("express-validator");

const catchErrors = (req, res = response,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      ok: false,
      msg: errors.mapped(),
    });
  }
  next();
};

module.exports = {
  catchErrors
};
