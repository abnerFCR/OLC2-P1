import { Expresion } from '../Abstracto/Expresion';
import { Retorno, Tipo } from '../Abstracto/Retorno';
import { Error_ } from '../Errores/Error';
import { Arreglo } from '../Objetos/Arreglo';
import { Entorno } from '../Simbolo/Entorno';
import { Simbolo } from '../Simbolo/Simbolo';

export class AsignacionIndArreglo extends Expresion {

    private id: string;
    private indice: Expresion;
    private anterior: Expresion | null;
    public funcion: string;
    public expresionNueva: Expresion | null;

    constructor(id: string, indice: Expresion, anterior: Expresion | null, funcion: string, expresionNueva: Expresion | null, linea: number, columna: number) {
        super(linea, columna);
        this.id = id;
        this.indice = indice;
        this.anterior = anterior;
        this.funcion = funcion;
        this.expresionNueva = expresionNueva;
    }

    public ejecutar(entorno: Entorno): Retorno {
        if (this.anterior == null) {
            let varArreglo = entorno.getVar(this.id);
            if (this.indice == null) {
                throw new Error_(this.linea, this.columna, "Semantico", "Se necesita un indice para acceder a un arreglo.");
            }
            if (varArreglo?.valor instanceof Arreglo) {
                let posicion = this.indice.ejecutar(entorno);
                if (posicion.tipo == Tipo.NUMBER) {
                    posicion.valor = Math.round(posicion.valor);
                    if (this.funcion != '') {
                        /*
                        if (this.funcion == '.push' && varArreglo.valor.getElemento(posicion.valor).valor instanceof Arreglo) {
                            let resultado = this.paraPush.ejecutar(entorno);
                            console.log(resultado);
                            console.log(varArreglo);
                            if (resultado.tipo == varArreglo.valor.tipo.tipo) {
                                //TODO asignar el valor del push y corregir condicion
                                return { valor: true, tipo: Tipo.BOOLEAN };
                            } else {
                                return { valor: false, tipo: Tipo.BOOLEAN };
                            }
                        }
                        */
                    } else {
                        if (this.expresionNueva != null) {
                            let resultado = this.expresionNueva.ejecutar(entorno);
                            if(varArreglo.valor.getElemento(posicion.valor) == undefined){
                                varArreglo.valor.setElemento(new Simbolo(resultado.valor,'',resultado.tipo,'',''),posicion.valor);
                                return;
                            }
                            if(resultado.tipo == varArreglo.valor.getElemento(posicion.valor).tipo){
                                varArreglo.valor.getElemento(posicion.valor).valor = resultado.valor;
                            }else{
                                throw new Error_(this.linea, this.columna, "Semantico","El tipo que se intenta insertar no coincide con el tipo del arreglo.");
                            }
                            
                        } else {
                            //validacion para hacerlo dinamico, verificar con la instancia
                            if(varArreglo.valor.getElemento(posicion.valor) == undefined){
                                varArreglo.valor.setElemento(new Simbolo(new Arreglo([], varArreglo.valor.tipo),varArreglo.id,Tipo.ARRAY,varArreglo.tipoSimbolo,varArreglo.idTipo),posicion.valor);
                                //return {valor:varArreglo.valor.setElemento(new Simbolo(new Arreglo([], varArreglo.valor.tipo),'',Tipo.ARRAY,'',''),posicion.valor),tipo:Tipo.ARRAY};
                            }
                            return { valor: varArreglo.valor.getElemento(posicion.valor).valor, tipo: varArreglo.valor.getElemento(posicion.valor).tipo };

                        }
                    }
                } else {
                    throw new Error_(this.linea, this.columna, "Semantico", "El indice para acceder a un arreglo debe ser de tipo numerico.");
                }
            } else {
                throw new Error_(this.linea, this.columna, "Semantico", "Intenta acceder o implementar la funcion nativa de un arreglo en una variable que no es un arreglo.");
            }

        } else {
            let varAnterior = this.anterior.ejecutar(entorno);
            console.log(varAnterior);
            if (varAnterior.tipo == Tipo.ARRAY) {
                let valor = varAnterior.valor;
                if (valor instanceof Arreglo) {
                    let posicion = this.indice.ejecutar(entorno);
                    if (posicion.tipo == Tipo.NUMBER) {
                        posicion.valor = Math.round(posicion.valor);
                        if (this.funcion != '') {
                            if (this.funcion == '.push') {
                                /*
                                let resultado = this.expresionNueva.ejecutar(entorno);
                                if (resultado.tipo == valor.getElemento(posicion.valor).valor.elementos[0].tipo) {
                                    //TODO asignar el valor del push y corregir condicion
                                    return { valor: true, tipo: Tipo.BOOLEAN };
                                } else {
                                    return { valor: false, tipo: Tipo.BOOLEAN };
                                }
                                */
                            } else {
                                throw new Error_(this.linea, this.columna, "Semantico", "Solo pueden aplicar las operacions push, pop y length a tipos de datos arreglos");
                            }
                        } else {
                            //return { valor: valor.getElemento(posicion.valor).valor, tipo: valor.getElemento(posicion.valor).tipo };
                            if (this.expresionNueva != null) {
                                let resultado = this.expresionNueva.ejecutar(entorno);
                                if(valor.getElemento(posicion.valor) == undefined){
                                    valor.setElemento(new Simbolo(resultado.valor,'',resultado.tipo,'',''),posicion.valor);
                                    return;
                                }
                                if(resultado.tipo == valor.getElemento(posicion.valor).tipo){
                                    valor.getElemento(posicion.valor).valor = resultado.valor;
                                }else{
                                    throw new Error_(this.linea, this.columna, "Semantico","El tipo que se intenta insertar no coincide con el tipo del arreglo.");
                                }
                                
                            } else {
                                if(valor.getElemento(posicion.valor) == undefined){
                                    valor.setElemento(new Simbolo(new Arreglo([], valor.tipo),'',Tipo.ARRAY,'',''),posicion.valor);
                                    //return {valor:valor.g};
                                }
                                return { valor: valor.getElemento(posicion.valor).valor, tipo: valor.getElemento(posicion.valor).tipo };
                            }

                        }
                    } else {
                        throw new Error_(this.linea, this.columna, "Semantico", "No se puede obtener accesar a un indice de una variable que no es un arreglo");
                    }
                } else {
                    throw new Error_(this.linea, this.columna, "Semantico", "No se puede obtener accesar a un indice de una variable que no es un arreglo 2");
                }
            } else {

                throw new Error_(this.linea, this.columna, "Semantico", "Ya se accedieron a todas las dimensiones del arreglo");
            }
        }
        return null;
    }

}