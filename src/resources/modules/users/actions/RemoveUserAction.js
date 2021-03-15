const { RequestRule, BaseAction } = require('../../../../root');
const { UserModel } = require('../../../models/UserModel');
const { UserSchema } = require('../../../schemas/UserSchema');

const { updateUserPolicy } = require('../../../../policy/updateUserPolicy');

class RemoveUserAction extends BaseAction {
  static get accessTag() {
    return 'users:remove';
  }

  static get validationRules() {
    return {
      params: {
        id: new RequestRule(UserSchema.schema.obj.id, { required: true }),
      },
    };
  }

  static async run(req) {
    const { currentUser } = req;
    const { id } = req.params;

    const model = await UserModel.getById(id);
    await updateUserPolicy(model, currentUser);
    await UserModel.findByIdAndDelete(id);

    return this.result({ message: `${id} was removed` });
  }
}

module.exports = { RemoveUserAction };
