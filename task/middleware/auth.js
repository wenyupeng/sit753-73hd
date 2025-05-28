const jwt = require('jsonwebtoken');
const { logger } = require('../lib/logger');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');

 logger.info(`Authorization middleware triggered, path: ${req.baseUrl}`);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET  || 'sit753-7.3HD');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};