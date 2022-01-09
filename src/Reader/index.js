
var Models = require('./models/index.js');

class Reader {

  static async getResourceData(parameters) {
    const {
      resourceName,
      query
    } = parameters;

    if (!resourceName ||
      !query ||
      resourceName == "" ||
      query == "") {
      throw new Error("Missing parameters");
    }

    const model = Models[resourceName]
    console.log({ model })
    if (!model) {
      throw new Error("Unknow resource name");
    }
    const queryCallback = model[query]
    console.log({ queryCallback })
    if (!queryCallback) {
      throw new Error("Unknow query");
    }
    const response = await queryCallback()
    return response;
  }
}
module.exports = Reader;