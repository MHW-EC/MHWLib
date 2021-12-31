const Generador = require('../index');

const listaPaquete1 = require('../src/Generador/listaPaquetes1');
//Data for test
const listaPaquete2 = listaPaquete1.slice(0, 1);
console.log(listaPaquete2);
console.log('Tamaño paqueteria: ', listaPaquete2.length);
const retFun = (arr) => ({ paquete: arr });

const paquetesObj = listaPaquete2.map(retFun);
console.log(paquetesObj);
const gen = new Generador(paquetesObj);
gen.generarHorarios((err, horarios) => {
  if (err) {
    console.log('Error: ', err);
    process.exit(1);
  }
  horarios.forEach((horario) => {
    //console.log("Horario # ", indice+1)
    let mats = horario.materias;
    let idsMats = [];
    mats.forEach((mat) => {
      //console.log(mat['nombre'],mat['paralelo']);
      idsMats.push(mat['_id']);
    });
    //console.log(idsMats);
  });
  console.log('Horarios generados: ', horarios.length);
  process.exit(0);
});
