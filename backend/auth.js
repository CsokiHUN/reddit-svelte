const jwt = require('jsonwebtoken');
const tokenSecret = process.env.TOKEN_SECRET || 'unknowntokensecret';

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  jwt.verify(token, tokenSecret, async (err, user) => {
    if (err) return res.sendStatus(403);

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
