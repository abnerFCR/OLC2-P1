import { Instruccion } from "../Abstracto/Instruccion";
import { Entorno } from "../Simbolo/Entorno";
import { Expresion } from "../Abstracto/Expresion";
import { Tipo } from '../Abstracto/Retorno';
import { ElementoDeclaracion, TipoDeclaracion } from '../Util/ElementoDeclaracion';
import { errores } from '../Errores/Errores';
import { Error_ } from '../Errores/Error';
import { Simbolo } from '../Simbolo/Simbolo';
import { Type_ } from '../Objetos/Type_';
import { GuardsCheckStart } from '@angular/router';
import { Validators } from '@angular/forms';
import { AsignacionTipo } from './AsignacionTipo';
import { ConstantPool } from '@angular/compiler';
import { Type } from '@angular/core';

export class Declaracion extends Instruccion {

    private declaraciones: any;
    private tipoDeclaraciones: string; //constante o variable. 

    constructor(tipoDeclaraciones: string, declaraciones: any, linea: number, columna: number) {
        super(linea, columna);
        this.tipoDeclaraciones = tipoDeclaraciones;
        this.declaraciones = declaraciones;
    }
    //Si hay algun error al momento de guardar el dato, lo reporta el entorno.
    public ejecutar(entorno: Entorno) {
        for (const declaracion of this.declaraciones) {
            if (declaracion.tipo == Tipo.TYPE) {
                this.declararUnTipo(declaracion, entorno);
                return;
            }
            if (declaracion.tipoDeclaracion == TipoDeclaracion.ID) {
                if (this.tipoDeclaraciones == 'const')
                    throw new Error_(this.linea, this.columna, "Semantico", "No se puede declarar una constante sin inicializarla.");
                entorno.guardar(declaracion.id, null, Tipo.NULL, this.tipoDeclaraciones, '', this.linea, this.columna);
            }
            else if (declaracion.tipoDeclaracion == TipoDeclaracion.ID_TIPO) {
                if (this.tipoDeclaraciones == 'const')
                    throw new Error_(this.linea, this.columna, "Semantico", "No se puede declarar una constante sin inicializarla.");
                entorno.guardar(declaracion.id, null, declaracion.tipo, this.tipoDeclaraciones, '', this.linea, this.columna);
            }
            else if (declaracion.tipoDeclaracion == TipoDeclaracion.ID_VALOR) {
                const val = declaracion.valor.ejecutar(entorno);
                entorno.guardar(declaracion.id, val.valor, val.tipo, this.tipoDeclaraciones, '', this.linea, this.columna);
            }
            else if (declaracion.tipoDeclaracion == TipoDeclaracion.ID_TIPO_VALOR) {
                const val = declaracion.valor.ejecutar(entorno);
                if (val.tipo == declaracion.tipo) {
                    entorno.guardar(declaracion.id, val.valor, val.tipo, this.tipoDeclaraciones, '', this.linea, this.columna);
                }
                else {
                    throw new Error_(this.linea, this.columna, 'Semantico', 'Error al declarar la variable, el tipo de dato no concuerda con su valor');
                }
            }
            else {
                throw new Error_(this.linea, this.columna, 'Semantico', 'Error al declarar la variable [DEV] ');
            }
        }
    }


    private declararUnTipo(declaracion: ElementoDeclaracion, entorno: Entorno) {

        let plantillaType = entorno.getType(declaracion.idTipo);

        if (plantillaType == null) {
            throw new Error_(this.linea, this.columna, 'Semantico', 'Error el tipo especificado no existe');
        }

        let listaAtributos: Map<string, Simbolo> = new Map();
        for (const atributo of plantillaType.atributos) { //atributo devuelve un arreglo en cuya posicion 0 esta la clave y en la 1 esta el valor
            let idTipo = '';
            if (atributo[1].tipo == Tipo.TYPE) {
                idTipo = atributo[1].idTipo;
            }
            listaAtributos.set(atributo[1].id, new Simbolo(null, atributo[1].id, atributo[1].tipo, 'let', idTipo));
        }

        let nuevaVariableTipo = new Type_(listaAtributos);

        entorno.guardar(declaracion.id, nuevaVariableTipo, Tipo.TYPE, 'let', declaracion.idTipo, this.linea, this.columna);
        console.log(entorno);

        //declaracion.valor en este caso tiene una lista de valores ya que es un type
        if (declaracion.valor != null) {
            let asignacion = new AsignacionTipo(declaracion.id, declaracion.idTipo, declaracion.valor, this.linea, this.columna);
            asignacion.ejecutar(entorno);
        }
    }

}