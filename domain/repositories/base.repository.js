const mongoose = require('mongoose');

class BaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error('Missing model parameter.');
    }
    this.model = model
  }

  async getAll() {
    return this.model.find({}).exec();
  }

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return await this.model.findById(id).exec();
  }
}

module.exports = BaseRepository;