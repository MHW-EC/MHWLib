
var Models = require('./models');
var mongoose = require('mongoose')

class Reader {

  static async connectDatabase() {
    console.log('process.env.DB_URI', process.env.DB_URI);
    console.log('process.env.DB_NAME', process.env.DB_NAME);
    try {
      await mongoose
      .connect(process.env.DB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        dbName: process.env.DB_NAME
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static parametersValidation(parameters) {
    const {
      resourceName,
      query,
      queryParams = {},
      projectedFields = []
    } = parameters;

    if (
      !query?.length ||
      !resourceName?.length
    ) {
      console.log("Invalid parameters", typeof parameters);
      console.log('resourceName', resourceName);
      console.log('query', query);
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
    return [queryResponse, queryParams, projectedFields]
  }

  static async getResourceData(parameters) {
    const consoleLog = console.log;
    console.log = function (...args) {
      args.unshift('[ LIBRARY ]');
      consoleLog.apply(console, args);
    };

    console.log("start getResourceData without callback", parameters);

    const connectedDatabase = await Reader.connectDatabase();
    if(!connectedDatabase) throw new Error("No database connected");  
    console.log("Database connected")

    console.log("validating parameters");
    const [
      queryResponse, queryParams, projectedFields
    ] = Reader.parametersValidation(parameters)
    
    let response;
    try{
      console.log("awaiting query response");
      response = await queryResponse(queryParams, projectedFields);
    }catch(error){
      console.log(error);
      throw new Error("Query execution error");
    } finally {
      console.log = consoleLog;
      mongoose.connection.close();
      return response;
    }
  }

}
module.exports = Reader;