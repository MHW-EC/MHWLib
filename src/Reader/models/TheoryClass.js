const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class TheoryClass {

  static getSchema() {
    return mongoose.model('Teorico', new Schema({
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
      paralelos_practico: {
        type: Array
      },
      profesor: {
        type: String
      }
    }, {
      collection: 'teorico'
    }));
  }

  static getAll() {
    return TheoryClass.getSchema().find();
  }

  static getByClassCode(queryParams) {
    const {
      classCode
    } = queryParams;
    return TheoryClass.getSchema().find(
      {
        codigo: classCode
      }
    );
  }

  static getStatsByCode(queryParams) {
    const {
      classCode
    } = queryParams;
    return TheoryClass.getSchema()
      .aggregate(TheoryClass.getStatsQuery(classCode))
      .exec();
  }

  static getStatsQuery(classCode) {
    return [
      {
        $match: { codigo: classCode }
      },
      {
        $lookup:
        {
          from: "profesor2",
          localField: 'profesor',
          foreignField: 'nombre',
          as: "profesorJoined"
        }
      },
      {
        $unwind: { path: "$profesorJoined", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup:
        {
          from: "paraleloProfesor",
          let: { nombre: "$nombre", codigo: "$codigo", profesor: "$profesorJoined._id" },
          pipeline: [
            {
              $match:
              {
                $expr:
                {
                  $and:
                    [
                      { $eq: ["$$profesor", "$idProfesor"] },
                      {
                        $or: [
                          { $eq: ["$$nombre", "$nombreMateria"] },
                          { $eq: ["$$codigo", "$codigoMateria"] },
                        ]
                      }
                    ]
                }
              }
            },
            { $sort: { 'año': -1 } },
            { $limit: 1 }
          ],
          as: "lastParaleloProfesorJoined"
        }
      },
      {
        $unwind: { path: "$lastParaleloProfesorJoined", preserveNullAndEmptyArrays: true }
      },
      {
        $addFields: {
          score: {
            $let: {
              vars: {
                prom: {
                  $cond: {
                    if: { $eq: ["$lastParaleloProfesorJoined", undefined] },
                    then: 0,
                    else: "$lastParaleloProfesorJoined.promedio"
                  }
                },
                sumaPositivo: {
                  $cond: {
                    if: { $eq: ["$profesorJoined.stats", undefined] },
                    then: 0,
                    else: {
                      $add: [
                        "$profesorJoined.stats.feliz",
                        "$profesorJoined.stats.confianza",
                      ]
                    }
                  }
                },
                sumaNegativo: {
                  $cond: {
                    if: { $eq: ["$profesorJoined.stats", undefined] },
                    then: 0,
                    else: {
                      $add: [
                        "$profesorJoined.stats.enojado",
                        "$profesorJoined.stats.miedo",
                        "$profesorJoined.stats.triste",
                      ]
                    }
                  }
                }
              },
              in: {
                $divide: [
                  {
                    $multiply:
                      ["$$prom",
                        "$$sumaPositivo"
                      ]
                  },
                  { $add: [0.01, "$$sumaNegativo"] }
                ]
              }
            }
          }
        }
      },
      { $sort: { 'score': -1 } }
    ]
  }
};

module.exports = {
  getAll: TheoryClass.getAll,
  getByClassCode: TheoryClass.getByClassCode
};