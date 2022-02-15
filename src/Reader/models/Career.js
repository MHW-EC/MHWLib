const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Career {

  static getSchema() {
    return mongoose.models.Carrera ||
      mongoose.model('Carrera', new Schema(
        {
          _id: {
            type: Object,
          },
          nombre: {
            type: String,
          },
          facultad: {
            type: String,
          },
          materias: {
            type: Array,
          },
        },
        {
          collection: 'carrera',
        }
      ));
  }

  static getAll(_, projectedFields) {
    const toProject = projectedFields.join(" ");
    return Career.getSchema().find({}, toProject);
  }

};

module.exports = {
  getAll: Career.getAll
};