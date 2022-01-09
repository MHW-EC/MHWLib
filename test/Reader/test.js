var Reader = require('./../../src/Reader/index');

test('getResourceData', async () => {
    const args1 = {
        resourceName: "Career",
        query: "getAll"
    }
    expect(await Reader.getResourceData(args1)).toStrictEqual(300)
})