const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class TheoryClass {

  static getSchema() {
    return mongoose.models.Teorico ||
    mongoose.model('Teorico', new Schema({
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
      paralelos_practicos: {
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
    ).exec();
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

  static getTotalOfRecords(queryParams) {
    const filters = {}
    const {
      target = ""
    } = queryParams;
    const orConditions = [];
    if(target) {
      const regexTarget = new RegExp(target, 'i');
      orConditions.push({nombre: regexTarget})
      orConditions.push({codigo: regexTarget})
      orConditions.push({profesor: regexTarget})
    }
    
    if(orConditions.length) filters['$or'] = orConditions;
    console.log({filters})
    return TheoryClass.getSchema().find(filters).count().exec();
  }

  static getByQuery(queryParams, projectedFields) {
    const filters = {}
    const pagination = {}
    const toProject = projectedFields.join(" "); 
    const {
      target = "",
      pagination: {
        from, pageSize
      } = {}
    } = queryParams;
    const orConditions = [];
    if(target) {
      const regexTarget = new RegExp(target, 'i');
      orConditions.push({nombre: regexTarget})
      orConditions.push({codigo: regexTarget})
      orConditions.push({profesor: regexTarget})
    }
    if(from != undefined &&
      pageSize != undefined){
      pagination.skip = from
      pagination.limit = pageSize
    }
    
    if(orConditions.length) filters['$or'] = orConditions;
    console.log({filters})
    return TheoryClass.getSchema().find(filters, toProject, pagination).exec();
  }
};

module.exports = {
  getAll: TheoryClass.getAll,
  getByClassCode: TheoryClass.getByClassCode,
  getByQuery: TheoryClass.getByQuery,
  getTotalOfRecords: TheoryClass.getTotalOfRecords,
  getStatsByCode: TheoryClass.getStatsByCode
};