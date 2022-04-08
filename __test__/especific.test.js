var Reader = require('./../src/Reader');
var path = require('path')
jest.setTimeout(10000);
require('dotenv').config({
  path: path.join(__dirname, '..', '.env') 
});

beforeAll(done => {
  done()
})

afterEach(done => {
  done()
})

describe('Reader', () => {
  describe('Reader.getResourceData', () => {
    // describe('Career', () => {
    //   it('should return an array of careers', async () => {
    //     const careers = await Reader.getResourceData({
    //       resourceName: 'Career',
    //       query: 'getAll',
    //       projectedFields: ['_id', 'facultad', 'nombre']
    //     });
    //     console.log(JSON.stringify(careers))
    //     expect(careers).toBeInstanceOf(Array);
    //     expect(careers.length).toBeGreaterThan(0);
    //   });
    // })

    // describe('TheoryClass', () => {
    //   test('should return the number of matching theory classes', async () => {
    //     const theoryClasses = await Reader.getResourceData({
    //       resourceName: 'TheoryClass',
    //       query: 'getTotalOfRecords',
    //       queryParams: {
    //         target: "jedrez"
    //       }
    //     });
    //     console.log(theoryClasses);
    //     expect(theoryClasses).toBeGreaterThanOrEqual(0)
    //   });
    // })

    // describe('TheoryClass', () => {
    //   test('should return an array of matching theory classes', async () => {
    //     const theoryClasses = await Reader.getResourceData({
    //       resourceName: 'TheoryClass',
    //       query: 'getByQuery',
    //       queryParams: {
    //         target: "jedrez",
    //         pagination: {
    //           from: 5,
    //           pageSize: 5
    //         }
    //       },
    //       projectedFields: [
    //         "_id", "codigo", "nombre",
    //         "paralelo", "profesor"
    //       ]
    //     });
    //     console.log(theoryClasses);
    //     expect(theoryClasses).toBeInstanceOf(Array);
    //   });
    // })

    describe('TheoryClass', () => {
      test('should return an array of theory classes', async () => {
        const theoryClasses = await Reader.getResourceData({
          resourceName: 'TheoryClass',
          query: 'getStatsByCode',
          queryParams: {
            classCode: 'ADMG2029',
          }
        });
        console.log("1: ", theoryClasses);
        expect(theoryClasses).toBeInstanceOf(Array);
        expect(theoryClasses.length).toBeGreaterThan(0);
      });
      test('should return an array of theory classes by subject', async () => {
        const theoryClasses = await Reader.getResourceData({
          resourceName: 'TheoryClass',
          query: 'getByClassCode',
          queryParams: {
            classCode: 'ADMG2029',
          }
        });
        console.log("2: ", theoryClasses);
        expect(theoryClasses).toBeInstanceOf(Array);
        expect(theoryClasses.length).toBeGreaterThan(0);
      });
    })
  })
});