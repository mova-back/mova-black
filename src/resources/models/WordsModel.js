const { WordSchema } = require('../schemas/WordSchema');
const { assert, AppError } = require('../../root');
const { errorCodes } = require('../../error/errorCodes');

class WordsModel {
  static errorEmptyResponse() {
    return new AppError({ ...errorCodes.NOT_FOUND, layer: 'Schema' });
  }

  static async create(entity = {}) {
    assert.object(entity, { required: true });

    if (!entity.createdByUserId) {
      throw new AppError({
        ...errorCodes.UNPROCESSABLE_ENTITY,
        message: "Please provide in action class 'userId' field",
        layer: 'Schema',
      });
    }

    return WordSchema.create(entity);
  }

  static async getList({ page, limit, orderBy } = {}) {
    assert.integer(page, { required: true });
    assert.integer(limit, { required: true });

    const result = await WordSchema.find()
      .sort()
      .skip(page * limit)
      .limit(limit);
    const total = await WordSchema.find().count((el) => el);

    return { result, total };
  }

  static async findAndDeleteFields(entity = {}) {
    assert.object(entity, { required: true });

    WordSchema.find({}, entity);
  }

  static async getMyWordsList(field, { page, limit } = {}) {
    assert.array(field, { required: true });
    assert.integer(page, { required: true });
    assert.integer(limit, { required: true });

    const result = await WordSchema.find({
      _id: { $in: field },
    })
      .skip(page * limit)
      .limit(limit);

    const total = await WordSchema.find({
      _id: { $in: field },
    }).count((el) => el);

    return { result, total };
  }

  static async getById(id) {
    assert.mongoAutoId(id, { required: true });

    const data = await WordSchema.findById(id);
    if (!data) throw this.errorEmptyResponse();
    return data;
  }

  static async findByIdAndUpdate(id, entity = {}) {
    assert.mongoAutoId(id, { required: true });
    assert.object(entity, { required: true });

    return WordSchema.findByIdAndUpdate(id, entity, { new: true });
  }

  static async remove(id) {
    assert.mongoAutoId(id, { required: true });

    return WordSchema.findByIdAndDelete(id);
  }
}

module.exports = {
  WordsModel,
};
