import { Instruccion } from '../Abstracto/Instruccion';
import { Error_ } from '../Errores/Error';
import { Arreglo } from '../Objetos/Arreglo';
import { Entorno } from '../Simbolo/Entorno';
import { Simbolo } from '../Simbolo/Simbolo';
import { AsignacionTipo } from './AsignacionTipo';

export class AsignacionArreglo extends Instruccion{
    
    private arreglo: Simbolo;
    private valores: Array<any> = new Array();
    constructor(arreglo: Simbolo, valores: Array<any>, linea: number, columna: number) {
        super(linea, columna);
        this.arreglo = arreglo;
        this.valores = valores;
    }
    
    public ejecutar(entorno: Entorno) {
        let bandera = false;
        let arregloAux = new Arreglo([], this.arreglo.tipo);
        if (this.valores.length > 0) { //si el array tiene algun elemento sea Expresion o un Array
            for (let i = 0; i < this.valores.length; i++) {
                if (this.valores[i] instanceof Array) {
                    let nuevoArreglo = new AsignacionArreglo(this.arreglo, this.valores[i], this.linea, this.columna);
                    let resultadoArreglo = nuevoArreglo.ejecutar(entorno);
                    this.valores[i] = new Simbolo(resultadoArreglo,this.arreglo.id,this.arreglo.tipo,this.arreglo.tipoSimbolo, this.arreglo.idTipo);
                    //this.valores[i] = resultadoArreglo;
                } else {
                    let resultado = this.valores[i].ejecutar(entorno);
                    //console.log(resultado);
                    if (resultado.tipo != this.arreglo.valor.tipo.tipo) {
                        throw new Error_(this.linea, this.columna, "Semantico", "El tipo de dato a insertar debe coincidir con el tipo de dato del arreglo.");
                    }
                    let nuevoSimbolo = new Simbolo(resultado.valor, this.arreglo.id, resultado.tipo, 'let', '');
                    bandera = true;
                    this.valores[i] = nuevoSimbolo; 
                    arregloAux.push(nuevoSimbolo);
                }
            }

        }
        if (bandera) {
            //console.log(this);
            return arregloAux;
        }
        
        //console.log(this);
        let nuevoArreglo:Arreglo = new Arreglo(this.valores,this.arreglo.valor.tipo.tipo);
        return nuevoArreglo;
    }
}