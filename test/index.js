const Generador = require('../index');

const listaPaquete1 = require('../src/listaPaquetes1');
//Data for test
let listaPaquete2 = listaPaquete1.slice(0, 1);
console.log(listaPaquete2);
console.log('Tamaño paqueteria: ', listaPaquete2.length);
const retFun = (arr) => ({ paquete: arr });

let paquetesObj = listaPaquete2.map(retFun);
console.log(paquetesObj);
let gen = new Generador(paquetesObj);
let result = gen.HorariosGenerados;

result.forEach((horario,indice) => {
  //console.log("Horario # ", indice+1)
  let mats = horario.materias;
  let idsMats = []
  mats.forEach(mat => {
      //console.log(mat['nombre'],mat['paralelo']);
      idsMats.push(mat['_id']);
  })
  //console.log(idsMats);
})
console.log("Horarios generados: ",result.length);