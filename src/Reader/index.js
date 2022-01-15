
var Models = require('./models');
var mongoose = require('mongoose')
var path = require('path')

class Reader {

  static async connectDatabase() {
    
    
    require('dotenv').config({
      path: path.join(__dirname, '..', '..', '.env') 
    });
    console.log('process.env.DB_URI', process.env.DB_URI)
    console.log('process.env.DB_NAME', process.env.DB_NAME)
    
    console.log("returning promise connectDatabase")
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
    console.log("start getResourceData")
    const connectedDatabase = await Reader.connectDatabase();
    if(!connectedDatabase) throw new Error("No database connected");  

    console.log("validating parameters");
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
      throw new Error("Unknown resource name");
    }
    const queryResponse = model[query]
    if (!queryResponse) {
      throw new Error("Unknown query");
    }
    try{
      console.log("awaiting query response");
      return queryResponse(queryParams);
    }catch(error){
      console.log(error);
      throw new Error("Query execution error");
    }
  }
}
module.exports = Reader;