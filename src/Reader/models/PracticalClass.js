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

  static getAll(_, projectedFields) {
    const toProject = projectedFields.join(" ");
    return PracticalClass.getSchema().find({}, toProject);
  }

  static getByTheoryId(queryParams, projectedFields) {
    const {
      id
    } = queryParams;
    const toProject = projectedFields.join(" ");
    return PracticalClass.getSchema().find(
      {
        'teorico_id': id
      },
      toProject
    );
  }
  
};

module.exports = {
  getAll: PracticalClass.getAll,
  getByTheoryId: PracticalClass.getByTheoryId
};