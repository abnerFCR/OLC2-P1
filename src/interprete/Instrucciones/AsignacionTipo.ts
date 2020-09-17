import { Instruccion } from '../Abstracto/Instruccion';
import { Entorno } from '../Simbolo/Entorno';
import { Error_ } from '../Errores/Error';
import { errores } from '../Errores/Errores';
import { Tipo } from '../Abstracto/Retorno';
import { Declaracion } from './Declaracion';
import { ElementoDeclaracion, TipoDeclaracion } from '../Util/ElementoDeclaracion';

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

    }

}