import { Instruccion } from '../Abstracto/Instruccion';
import { Entorno } from '../Simbolo/Entorno';
import { Error_ } from '../Errores/Error';
import { errores } from '../Errores/Errores';
import { Tipo } from '../Abstracto/Retorno';
import { Declaracion } from './Declaracion';
import { ElementoDeclaracion, TipoDeclaracion } from '../Util/ElementoDeclaracion';
import { Simbolo } from '../Simbolo/Simbolo';
import { Type_ } from '../Objetos/Type_';

export class AsignacionTipo extends Instruccion {

    private valoresAtributos: any;
    private idVariable: string;
    private idTipo: string;

    constructor(idVariable: string, idTipo: string, valoresAtributos: any, fila: number, columna: number) {
        super(fila, columna);
        this.idTipo = idTipo;
        this.idVariable = idVariable;
        this.valoresAtributos = valoresAtributos;
    }

    public ejecutar(entorno: Entorno) {
        //variableTipo es una variable que nos devuelve la variable a la que queremos asignar sin los valores
        let variableTipo = entorno.getVar(this.idVariable);
        let plantillaType = entorno.getType(variableTipo.idTipo);
        let listaAtributos: Map<string, Simbolo> = new Map();

        //PREGUNTAR SI EL VALOR ES NULO SI ES ASI ENTONCES NO HAY QUE HACER NADA EN TODO EL METODO 
        
        for (const atributo of plantillaType.atributos) { //atributo devuelve un arreglo en cuya posicion 0 esta la clave y en la 1 esta el valor
            let idTipo = '';
            if (atributo[1].tipo == Tipo.TYPE) {
                idTipo = atributo[1].idTipo;
            }
            listaAtributos.set(atributo[1].id, new Simbolo(null, atributo[1].id, atributo[1].tipo, 'let', idTipo));
        }


        variableTipo.valor = new Type_(listaAtributos);
        

        if (variableTipo == null) {
            throw new Error_(this.linea, this.columna, 'Semantico', 'Error el variable especificada');
        }
        //TODO verificar que esten todos los atributos para asignar
        for (const atributoValor of this.valoresAtributos) {
            try {
                if (variableTipo.valor.atributos.has(atributoValor.id)) {
                    //console.log(atributoValor.valor);

                    if (atributoValor.valor instanceof Array) {

                        let elementoDeclaracion: ElementoDeclaracion = new ElementoDeclaracion(TipoDeclaracion.ID_TIPO_VALOR, "_" + atributoValor.id, Tipo.TYPE, variableTipo.valor.atributos.get(atributoValor.id).idTipo, atributoValor.valor);
                        let nuevaDeclaracion = new Declaracion('let', [elementoDeclaracion], this.linea, this.columna);
                        nuevaDeclaracion.ejecutar(entorno);

                        let atributoCompleto = entorno.getVar("_" + atributoValor.id);
                        atributoCompleto.id = atributoCompleto.id.substring(1);
                        variableTipo.valor.atributos.set(atributoValor.id, atributoCompleto);
                        let respuesta = entorno.deleteVar("_" + atributoValor.id, this.linea, this.columna);
                        if (respuesta == null) {
                            continue;
                        }
                        errores.push(respuesta);
                        return; //----->este return puede ser reemplazado
                    }
                    const valorAtributo = atributoValor.valor.ejecutar(entorno);
                    //---------------------------------
                    if(valorAtributo.tipo ==Tipo.NULL){
                        if(variableTipo.valor.getAtributo(atributoValor.id).tipo == Tipo.TYPE){
                            continue;
                        }
                    }

                    //---------------------------------
                    if (valorAtributo.tipo == variableTipo.valor.getAtributo(atributoValor.id).tipo) {
                        variableTipo.valor.atributos.get(atributoValor.id).valor = valorAtributo.valor;
                    } else {
                        throw new Error_(this.linea, this.columna, 'Semantico', 'El tipo del atributo: "' + atributoValor.id + '" no coincide con el tipo de su valor');
                    }

                } else {
                    throw new Error_(this.linea, this.columna, 'Semantico', 'No existe un atributo con el nombre "' + atributoValor.id + '" para este tipo.');
                }

            } catch (error) {
                errores.push(error);
            }
        }

        let respuesta = entorno.updateVar(this.idVariable, variableTipo.valor, Tipo.TYPE, this.idTipo, this.linea, this.columna);
        if (respuesta instanceof Error_) {
            respuesta.setLinea(this.linea);
            respuesta.setColumna(this.columna);
            throw respuesta;
        }
        console.table(entorno);
    }

}