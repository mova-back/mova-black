const { getBearerTokenFromRequest } = require('../utils/security/http');
const { isValidToken } = require('../utils/security/jwt');
const { Unauthorized } = require('../error');

const authByRole = (listRole) => (req, resp, next) => {
  const token = getBearerTokenFromRequest(req);

  const currentUser = isValidToken(token);

  if (listRole.filter((role) => role === currentUser.userRole)) {
    req.userId = currentUser.userId;
    next();
  } else {
    throw new Unauthorized('JWT is not valid / Role access denied ');
  }
};

module.exports = {
  authByRole
};
