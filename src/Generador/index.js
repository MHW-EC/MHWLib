const async = require('async');
const { v4 } = require('uuid')

const Horario = require('./Horario');
const Combinador = require('./Combinador');
const { progress } = require('../firebase');

class Generador {
  constructor(paquetes) {
    this.paquetes = paquetes;
    this.mapaPaquetes = new Map();
    this.permutaciones = [];
    this.schedulesResult = [];
    this.horariosGenerados = [];
  }

  /**
   * Description. Crea un mapa cen la que sus claves son los nombres de las
   * materias y como valor una lista de todos los paralelos de esa materia
   *
   * @param {Paquete} paquete Lista de todas las materias selecionadas por el usuario
   *
   */
  crearMapa() {
    for (let index = 0; index < this.paquetes.length; index++) {
      const paquete = this.paquetes[index];
      let nombreMateria = paquete['paquete'][0]['nombre'];
      if (!this.mapaPaquetes.has(nombreMateria)) {
        this.mapaPaquetes.set(nombreMateria, []);
      }
      this.mapaPaquetes.get(nombreMateria).push(paquete);
    }

    /* this.paquetes.forEach((paquete) => {
			let nombreMateria = paquete['paquete'][0]['nombre'];
			if (!this.mapaPaquetes.has(nombreMateria)) {
				this.mapaPaquetes.set(nombreMateria, []);
			}
			this.mapaPaquetes.get(nombreMateria).push(paquete);
		}); */
  }

  /**
   * Description. Genera los horarios pposibles dado las materias seleccionadas
   * @param {(error, schedulesResult: Horario[]) => {}} callback
   *  Funcion en el que se retornan los horarios generados
   */
  generarHorarios(callback) {
    //Crearmos los maquetes
    this.crearMapa();

    //Lista que contiene lista de materias del mismo nombre
    //Ejemplo: [[CVU1, CVU2], [FP2,FP6], [DS6, DS9]]
    let clusters = [];

    for (let [clave, valor] of this.mapaPaquetes) {
      clusters.push(valor);
    }
    const uuid = v4();
    const combinaciones = new Combinador(clusters);
    const totalIter = combinaciones.resultados.length;
    let idx = 0;
    return async.each(
      combinaciones.resultados,
      (combinacion, cback) => {
        let numMats = 0;
        //let materiaAnterior = null;
        const horario = new Horario();
        for (let idx2 = 0; idx2 < combinacion.length; idx2++) {
          const paquete = combinacion[idx2];
          //horario.addPaquete(paquete['paquete']) ? numMats + 1 : numMats;
          numMats += horario.addPaquete(paquete['paquete'])
            ? numMats + 1
            : numMats
            ? 1
            : 0;
        }
        //if (numMats > 1) {
        let repetido = false;
        for (let hor of this.schedulesResult) {
          if (horario.equals(hor)) {
            repetido = true;
            break;
          }
        }
        if (!repetido) {
          this.schedulesResult.push(horario);
        }
        const dataUpdate = {
          uuid,
          percentage: Math.round(((idx + 1) / totalIter) * 100),
          payload: {
            totalIter,
            horarios: this.schedulesResult.map((hor)=> hor.toJSON()),
          },
        };
        idx++;
        return progress(dataUpdate, cback);
      },
      (err = null) =>
        progress(
          {
            uuid,
            percentage: 100,
            payload: { totalIter, horarios: this.schedulesResult.map((hor)=> hor.toJSON()) },
          },
          () => callback(err, this.schedulesResult)
        )
    );

    //Legacy
    for (let idx = 0; idx < totalIter; idx++) {
      const combinacion = combinaciones.resultados[idx];
      let numMats = 0;
      //let materiaAnterior = null;
      const horario = new Horario();
      for (let idx2 = 0; idx2 < combinacion.length; idx2++) {
        const paquete = combinacion[idx2];
        //horario.addPaquete(paquete['paquete']) ? numMats + 1 : numMats;
        numMats += horario.addPaquete(paquete['paquete'])
          ? numMats + 1
          : numMats
          ? 1
          : 0;
      }
      //if (numMats > 1) {
      let repetido = false;
      for (let hor of this.horariosGenerados) {
        if (horario.equals(hor)) {
          repetido = true;
          break;
        }
      }
      if (!repetido) {
        this.horariosGenerados.push(horario);
      }
    }
  }
  /**
   * @deprecated Los horario generados se obtienen en el callback al llamar la funcion generarHorarios
   */
  get HorariosGenerados() {
    throw new Error(
      'Los horario generados se obtienen en el callback al llamar a generarHorarios'
    );
  }
}
module.exports = Generador;

/* combinaciones.resultados.forEach((combinacion) => {
			//let entroMatPrioritaria = true;
			//let materiaAnterior = null;
			let horario = new Horario();
			combinacion.forEach((paquete) => {
				horario.addPaquete(paquete['paquete']);
			});
			let repetido = false;
			for (let hor of this.horariosGenerados) {
				if (horario.equals(hor)) {
					repetido = true;
					break;
				}
			}
			if (!repetido) { this.horariosGenerados.push(horario);}
		}); */
