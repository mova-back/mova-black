const { AppError } = require('../root/abstract/AppError');
const { Assert: assert } = require('../root/abstract/Assert');
const { errorCodes } = require('../error/errorCodes');
const permissions = require('../permissions');

/**
 * @description check permissions to action by access tag
 * @case uses in each action class
 */
module.exports = (accessTag, currentUser) => {
  assert.string(accessTag, { notEmpty: true });
  assert.object(currentUser, { required: true });

  const accessTagBaseName = accessTag.split(':')[0];
  const accessTagAll = `${accessTagBaseName}:all`;

  console.log('currentUser.role', currentUser.role);

  return new Promise((resolve, reject) => {
    // if current user role have access tag >> pass
    if (permissions[currentUser.role][accessTagAll]) return resolve();
    if (permissions[currentUser.role][accessTag]) return resolve();
    // else reject
    return reject(new AppError({ ...errorCodes.FORBIDDEN, message: "Access denied, don't have permissions." }));
  });
};
