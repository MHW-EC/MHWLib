const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class PracticalClass {

  static getSchema() {
    return new Schema(
      {
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
      },
      {
        collection: 'carrera',
      }
    );
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      PracticalClass.getSchema().find((error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    })
  }

  static getById(queryParams) {
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
  getById: PracticalClass.getById
};