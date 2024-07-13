const jwt = require('jsonwebtoken');
// jwt
const isAuth = (req, res, next) => {
  let { accessToken } = req.query;
  if (accessToken) {
    accessToken = `Bearer ${accessToken}`;
  }
  const authHeader = req.headers.authorization || accessToken;
  if (!authHeader) {
    return res.status(401).json({ message: 'bad token' });
  }
  const tokenSplit = authHeader.split(' ');
  if (tokenSplit.length !== 2) {
    return res.status(401).json({ message: 'bad token' });
  }
  const bearer = tokenSplit[0];
  if (bearer !== 'Bearer') {
    return res.status(401).json({ message: 'bad bearer' });
  }
  const token = tokenSplit[1];
  return jwt.verify(token, `${process.env.PRIVATE_KEY}`, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: '401 Unauthorized' });
    }
    req.user = user;
    return next();
  });
};
// role verification
const isAuthorized = (roles_) => (req, res, next) => {
  if (!roles_ || (roles_ && roles_.length === 0)) {
    return res.status(403).json({ message: 'bad roles' });
  }
  if (!req.user.role) {
    return res.status(403).json({ message: 'bad role' });
  }
  if (!roles_.includes(req.user.role)) {
    // user's role is not authorized
    return res.status(403).json({ message: '403 Forbidden access denied' });
  }
  return next();
};
const validateResetToken = (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required.' });
  }

  jwt.verify(token, process.env.JWT_RESET_SECRET, (err, decoded) => {
    if (err) {
      console.error('Error validating reset token:', err);
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    // Store decoded token data in request for further use
    req.user = decoded;

    // Proceed to reset password
    next();
  });
};

module.exports = {
  isAuthorized, isAuth, validateResetToken,
};
