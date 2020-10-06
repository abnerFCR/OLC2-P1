import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { environment } from 'src/environments/environment';
import { Expresion } from '../Abstracto/Expresion';
import { Instruccion } from '../Abstracto/Instruccion';
import { Tipo } from '../Abstracto/Retorno';
import { Error_ } from '../Errores/Error';
import { errores } from '../Errores/Errores';
import { Acceso } from '../Expresion/Acceso';
import { Entorno } from '../Simbolo/Entorno';
import { TipoDeclaracion } from '../Util/ElementoDeclaracion';
import { Declaracion } from './Declaracion';
import { Return } from './Return';

export class Llamada extends Instruccion {

    private expresiones: Array<Expresion>;
    private nombre: string;

    constructor(nombre, expresiones: Array<Expresion>, linea: number, columna: number) {
        super(linea, columna);
        this.nombre = nombre;
        this.expresiones = expresiones;
    }

    public ejecutar(entorno: Entorno) {
        let funcion = entorno.getFuncion(this.nombre, this.linea, this.columna);
        //console.log("Ejecutando Llamada a metodo");


        if (funcion.parametros.length != this.expresiones.length) {
            throw new Error_(this.linea, this.columna, "Semantico", "El numero de parametros que se indican es incorrecto.");
        }
        let nuevoEntorno: Entorno | null = new Entorno(entorno.getGlobal());
        for (let i = 0; i < funcion.parametros.length; i++) {
            let expresionActual = this.expresiones[i].ejecutar(entorno);
            //console.log("Expresion Actual");
            //console.log(expresionActual);
            if (funcion.parametros[i].tipo == expresionActual.tipo) {
                if (funcion.parametros[i].tipo == Tipo.ARRAY) {
                    nuevoEntorno.guardar(funcion.parametros[i].id, expresionActual.valor,expresionActual.tipo,'let',funcion.parametros[i].idTipo,this.linea,this.columna);
                } else if (funcion.parametros[i].tipo == Tipo.TYPE) {
                    nuevoEntorno.guardar(funcion.parametros[i].id, expresionActual.valor,expresionActual.tipo,'let',funcion.parametros[i].idTipo,this.linea,this.columna);
                    //console.log(expresionActual);
                } else {
                    nuevoEntorno.guardar(funcion.parametros[i].id, expresionActual.valor, expresionActual.tipo, 'let', '', this.linea, this.columna);
                    //console.log(nuevoEntorno);
                }
            } else {
                throw new Error_(this.linea, this.columna, "Semantico", "El tipo de dato en los parametros no coincide con la funcion origen.");
            }
        }
        
       //TODO banderas de las variables del entorno para ciclos y switch
        try {
            let respuesta = funcion.instrucciones.ejecutar(nuevoEntorno);
            if (respuesta instanceof Return) {
                //console.log(respuesta.expresion);
                if(respuesta.expresion.tipo == Tipo.TYPE){
                    if(funcion.tipoRetorno.tipo != Tipo.TYPE){
                        throw new Error_(this.linea,this.columna,"Semantico","Intenta devolver un tipo en una funcion que no devuelve tipo");
                    }
                    return respuesta.expresion;
                
                }
                if (respuesta.expresion.tipo == funcion.tipoRetorno) { 
                    return respuesta.expresion;
                }
                throw new Error_(this.linea, this.columna, "Semantico", "La funcion no puede retornar un tipo de dato diferente al definido");
            }
        } catch (error) {

            errores.push(error);
        }
   
        //console.log("Finalizando Llamada a metodo");
    }

}