
var Models = require('./models');
var mongoose = require('mongoose')
var path = require('path')
var util = require('util');

class Reader {

  static async connectDatabase() {
    console.log('process.env.DB_URI', process.env.DB_URI);
    console.log('process.env.DB_NAME', process.env.DB_NAME);
    return new Promise((resolve) => {
      mongoose
      .connect(process.env.DB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        dbName: process.env.DB_NAME,
      })
      .then(() => resolve(true))
      .catch(
        (err) => {
          console.log('Error DB JOSUE:', err);
          return resolve(false);
      })
    });
  }

  static parametersValidation(parameters, callBack) {
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
    return [queryResponse, queryParams]
  }

  static async getResourceData(parameters) {
    console.log("start getResourceData without callback");

    const connectedDatabase = await Reader.connectDatabase();
    if(!connectedDatabase) throw new Error("No database connected");  
    console.log("Database connected")

    console.log("validating parameters");
    const [queryResponse, queryParams] = Reader.parametersValidation(parameters)
    
    try{
      console.log("awaiting query response");
      return queryResponse(queryParams);
    }catch(error){
      console.log(error);
      throw new Error("Query execution error");
    }
  }

  static getResourceDataByCb(parameters, callBack) {

    console.log("start getResourceDataByCb")
    require('dotenv').config({
      path: path.join(__dirname, '..', '..', '.env') 
    });

    return mongoose.connect(
      process.env.DB_URI, 
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        dbName: process.env.DB_NAME,
      },
      (error) => {
        if(error){
          console.log("No database connected")
          return callBack(error);
        }
        console.log("Database connected");
        try{
          const [queryResponse, queryParams] = Reader.parametersValidation(parameters, callBack)
          console.log("Valid parameters");
          
          return queryResponse(queryParams, (error, response) => {
            if(error){
              console.log("Error getting resource");
              return callBack(error);
            }
            console.log("Returning resources");
            return callBack(null, response);
          })
        }catch(error){
          return callBack(error);
        }
      })
  }
}
module.exports = Reader;