
var Models = require('./models/index.js');

class Reader {
    static async getResourceData(parameters) {
      const {
        resourceName,
        query
      } = parameters;

      if(!resourceName ||
        !query ||
        resourceName == "" ||
        query == ""){
        throw new Error(`Missing parameters - parameters: ${parameters}`);
      }

      const model = Models[resourceName]
      console.log({model})
      if(!model){
        throw new Error("Unknow resource name: ", resourceName);
      }
      const queryCallback = model[query]
      console.log({queryCallback})
      if(!queryCallback){
        throw new Error("Unknow query: ", query);
      }
      const response = await queryCallback()
      console.log({response})
      return response;
    }
  }
module.exports = Reader;