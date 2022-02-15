var Reader = require('./../src/Reader');
var path = require('path')
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
  describe('Reader.connectDatabase', () => {
    test('should return true if connected', async() => {
      await expect(Reader.connectDatabase()).resolves.toBe(true);
    });
  })
  describe('Reader.getResourceData', () => {
    describe('Invalid parameters', () => {
      test('should throw Missing parameter error', async() => {
        const parameters = {
          resourceName: "Career",
        }
        await expect(Reader.getResourceData(parameters)).rejects.toThrowError(
          'Missing parameters'
        );
      });
      test('should throw Unknown resource name error', async() => {
        const parameters = {
          resourceName: "UnexsintingResource",
          query: "getAll",
        }
        await expect(Reader.getResourceData(parameters)).rejects.toThrowError(
          'Unknown resource name'
        );
      });
      test('should throw Unknown query error', async() => {
        const parameters = {
          resourceName: "Career",
          query: "UnexsistingQuery",
        }
        await expect(Reader.getResourceData(parameters)).rejects.toThrowError(
          'Unknown query'
        );
      });
    });
    describe('Career', () => {
      test('should return an array of careers', async () => {
        const careers = await Reader.getResourceData({
          resourceName: 'Career',
          query: 'getAll'
        });
        expect(careers).toBeInstanceOf(Array);
        expect(careers.length).toBeGreaterThan(0);
      });
    })
    describe('Teacher', () => {
      test('should return an array of teachers', async () => {
        const teachers = await Reader.getResourceData({
          resourceName: 'Teacher',
          query: 'getAll'
        });
        expect(teachers).toBeInstanceOf(Array);
        expect(teachers.length).toBeGreaterThan(0);
      });
      test('should return an array of teachers by subject', async () => {
        const response = await Reader.getResourceData({
          resourceName: 'Teacher',
          query: 'getBySubject',
          queryParams: {
            teacherName: 'ALFONSO BOUHABEN MIGUEL',
            subjectName: 'NARRACIÓN AUDIOVISUAL',
            subjectCode: 'PRTCO02774',
          }
        });
        expect(response).toMatchSnapshot({
          nombre: expect.any(String),
          registros: expect.any(Array)
        });
      });
    })
    describe('TheoryClass', () => {
      test('should return an array of theory classes', async () => {
        const theoryClasses = await Reader.getResourceData({
          resourceName: 'TheoryClass',
          query: 'getAll'
        });
        expect(theoryClasses).toBeInstanceOf(Array);
        expect(theoryClasses.length).toBeGreaterThan(0);
      });
      test('should return an array of theory classes by subject', async () => {
        const theoryClasses = await Reader.getResourceData({
          resourceName: 'TheoryClass',
          query: 'getByClassCode',
          queryParams: {
            classCode: 'ARTG2044',
          }
        });
        expect(theoryClasses).toBeInstanceOf(Array);
        expect(theoryClasses.length).toBeGreaterThan(0);
      });
    })
    describe('PracticalClass', () => {
      test('should return an array of practical classes', async () => {
        const practicalClasses = await Reader.getResourceData({
          resourceName: 'PracticalClass',
          query: 'getAll'
        });
        expect(practicalClasses).toBeInstanceOf(Array);
        expect(practicalClasses.length).toBeGreaterThan(0);
      });
      test('should return an array of practical classes by theoryId', async () => {
        const practicalClasses = await Reader.getResourceData({
          resourceName: 'PracticalClass',
          query: 'getByTheoryId',
          queryParams: {
            id: 'ARTG2044_1',
          }
        });
        expect(practicalClasses).toBeInstanceOf(Array);
        expect(practicalClasses.length).toBeGreaterThan(0);
      });
    })
  })
});