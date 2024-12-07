const jwt = require("jsonwebtoken");

const generateJWT = (uid, name) => {
  const payload = { uid, name };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: process.env.TOKEN_EXPIRATION,
      },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      }
    );
  });
};

module.exports = {
  generateJWT
};
