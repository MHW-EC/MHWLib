var Reader = require('./../src/Reader');

test('getResourceData - Error', async () => {
  const args0 = {
    resourceName: "Career",
  }
  const args1 = {
    resourceName: "Careers",
    query: "getAll"
  }
  const args2 = {
    resourceName: "Career",
    query: "getAlls"
  }
  await expect(Reader.getResourceData(args0))
    .rejects.toThrow("Missing parameters");
  await expect(Reader.getResourceData(args1))
    .rejects.toThrow("Unknow resource name");
  await expect(Reader.getResourceData(args2))
    .rejects.toThrow("Unknow query");
})

test('getResourceData - Success', async () => {
  const args1 = {
    resourceName: "Career",
    query: "getAll"
  }
  await expect(Reader.getResourceData(args1))
    .resolves.toBeInstanceOf(Array)
})