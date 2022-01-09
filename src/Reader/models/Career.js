const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Career {

  static getSchema() {
    return new Schema(
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
    );
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      Career.getSchema().find((error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    })
  }
};
module.exports = {
  getAll: Career.getAll
};