const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Teacher {

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
      Teacher.getSchema().find((error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    })
  }

  static getBySubject(parameters) {
    const { teacherName } = parameters; 

    return new Promise((resolve, reject) => {
      Teacher.getSchema().profesor
        .aggregate(getFindBySubjectQuery(parameters))
        .exec((error, data) => {
          if (error) {
            reject(error)
          } else if (data.length >= 1){
            resolve(data[0])
          } else {
            resolve({
              "nombre": req.params.profesor,
              "registros": [{ 'promedio': 0 }]
            })
          }
        })
    })
  }

  static getFindBySubjectQuery(parameters) {
    const {
      teacherName,
      subjectName,
      subjectCode,
    } = parameters;
    return [
      {
        $match: {
          $and: [
            { "nombre": teacherName },
            {
              $or: [
                { "registros.nombreMateria": subjectName },
                { "registros.codigo": subjectCode }
              ]
            }
          ]
        }
      },
      {
        $project: {
          registros: {
            $filter: {
              input: '$registros',
              as: 'registros',
              cond: {
                $or: [
                  { $eq: ['$$registros.codigo', subjectCode] },
                  { $eq: ['$$registros.nombreMateria', subjectName] }
                ]
              },

            }
          },
          _id: 0,
          nombre: 1,
          stats: 1
        }
      }
    ]
  }
};
module.exports = {
  getAll: Teacher.getAll,
  getBySubject: Teacher.getBySubject
};