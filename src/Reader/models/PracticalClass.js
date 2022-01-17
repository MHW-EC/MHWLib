const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class PracticalClass {

  static getSchema() {
    return mongoose.models.Practico ||
      mongoose.model('Practico', new Schema({
        _id: {
          type: String
        },
        codigo: {
          type: String
        },
        eventos: {
          type: Object
        },
        nombre: {
          type: String
        },
        paralelo: {
          type: String
        },
        profesor: {
          type: String
        },
        teorico_id: {
          type: String
        }
      }, {
        collection: 'practico'
      }));
  }

  static getAll() {
    return PracticalClass.getSchema().find();
  }

  static getByTheoryId(queryParams) {
    const {
      id
    } = queryParams;
    return PracticalClass.getSchema().find(
      {
        'teorico_id': id
      }
    );
  }
};

module.exports = {
  getAll: PracticalClass.getAll,
  getByTheoryId: PracticalClass.getByTheoryId
};