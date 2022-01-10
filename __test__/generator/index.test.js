var Generator = require("./../../src/Generador");
var smallExample = require('./smallExample');
var largeExample = require('./largeExample');

describe("Generator(smallTarget)", () => {
  test('smallTarget', async () => {
    const {
      schedulesGenerated,
      candidateClasses
    } = smallExample;
    const generator = new Generator(
      "randomId",
      candidateClasses.map(
        (_class) => ({ 'paquete': _class })
    ));
    const schedulesPromise = await new Promise((resolve, reject) => {
      generator.generarHorarios((error, results) => {
        if (error) {
          reject(error);
        }
        resolve(
          results.map((schedule) => {
            return schedule.materias.map(_class => _class['_id']);
          })
        )
      }, true);
    });
    expect(schedulesPromise).toMatchObject(schedulesGenerated);
  });
});
// describe("Generator(largeExample)", () =>{
//   test('largeExample', async () => {
//     const {
//       schedulesGenerated,
//       candidateClasses
//     } = largeExample;
//     const generator = new Generator(
//       "randomId",
//       candidateClasses.map(
//         (_class) => ({ 'paquete': _class })
//     ));
//     const schedulesPromise = await new Promise((resolve, reject) => {
//       generator.generarHorarios((error, results) => {
//         if (error) {
//           reject(error);
//         }
//         resolve(
//           results.map((schedule) => {
//             return schedule.materias.map(_class => _class['_id']);
//           })
//         )
//       }, true);
//     });
//     expect(schedulesPromise).toMatchObject(schedulesGenerated);
//   });
// })
