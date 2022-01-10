
var Models = require('./models');
var mongoose = require('mongoose')
var path = require('path')

class Reader {

  static async connectDatabase() {
    if (process.env.NODE_ENV !== 'production') {
      require('dotenv').config({
        path: path.join(__dirname, '..', '..', '.env') 
      });
    }
    return new Promise((resolve) => {
      mongoose
      .connect(process.env.DB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        dbName: process.env.DB_NAME,
      })
      .then(
        () => {
          resolve(true)
        },
        () => {
          resolve(false)
        }
      )
    })
  }

  static async getResourceData(parameters) {

    const connectedDatabase = await Reader.connectDatabase();
    if(!connectedDatabase) throw new Error("No database connected");  

    const {
      resourceName,
      query,
      queryParams = {}
    } = parameters;

    if (!resourceName ||
      !query ||
      resourceName == "" ||
      query == "") {
      throw new Error("Missing parameters");
    }

    const model = Models[resourceName]
    if (!model) {
      throw new Error("Unknow resource name");
    }
    const queryResponse = model[query]
    if (!queryResponse) {
      throw new Error("Unknow query");
    }
    try{
      return queryResponse(queryParams);
    }catch(error){
      console.log(error);
      throw new Error("Query execution error");
    }
  }
}
module.exports = Reader;