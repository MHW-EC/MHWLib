var TheoryClass = require('./../src/Reader/models/TheoryClass');

test('getResourceData - Error', async () => {
  const args0 = {
    resourceName: "Theory",
  }
  const args1 = {
    resourceName: "Theorys",
    query: "getAll"
  }
  const args2 = {
    resourceName: "Theory",
    query: "getAlls"
  }
  await expect(TheoryClass.getResourceData(args0))
    .rejects.toThrow("Missing parameters");
  await expect(TheoryClass.getResourceData(args1))
    .rejects.toThrow("Unknow resource name");
  await expect(TheoryClass.getResourceData(args2))
    .rejects.toThrow("Unknow query");
})

test('getResourceData - Success', async () => {
  const args1 = {
    resourceName: "Theory",
    query: "getAll"
  }
  await expect(TheoryClass.getResourceData(args1))
    .resolves.toBeInstanceOf(Array)
})

test('getResourceData - Success', async () => {
  const args1 = {
    resourceName: "Theory",
    query: "getStatsByCode",
    queryParams: {
      classCode: "ARTG2044"
    }
  }
  await expect(TheoryClass.getResourceData(args1))
    .resolves.toBeInstanceOf(Array)
})