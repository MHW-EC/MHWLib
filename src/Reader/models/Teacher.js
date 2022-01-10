const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Teacher {

  static getSchema() {
    return mongoose.model('Profesor', new Schema({
      _id: {
          type: String
      },
      nombre: {
          type: String
      },
      registros: {
          type: Array,
          default: [{anio: String, codigo: String, nombreMateria: String, termino: String, promedio: Number}]
      },
      stats: { 
          type:Array
      }
  },{
      collection: 'profesor'
  }));
  }

  static getAll() {
    return Teacher.getSchema().find();
  }

  static getBySubject(queryParams) {
    const {
      teacherName
    } = queryParams;

    return new Promise((resolve, reject) => {
      Teacher.getSchema()
        .aggregate(Teacher.getByTeacherSubjectQuery(queryParams))
        .exec((error, data) => {
          if (error) {
            reject(error)
          } else if (data.length >= 1){
            resolve(data[0])
          } else {
            resolve({
              "nombre": teacherName,
              "registros": [{ 'promedio': 0 }]
            })
          }
        })
    })
  }

  static getByTeacherSubjectQuery(queryParams) {
    const {
      teacherName,
      subjectName,
      subjectCode,
    } = queryParams;

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