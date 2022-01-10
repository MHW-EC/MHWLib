const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Career {

  static getSchema() {
    return mongoose.model('Carrera', new Schema(
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

  static getAll() {
    return Career.getSchema().find();
  }
};

module.exports = {
  getAll: Career.getAll
};