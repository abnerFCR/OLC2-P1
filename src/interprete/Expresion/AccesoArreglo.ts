import { Expresion } from '../Abstracto/Expresion';
import { Retorno, Tipo } from '../Abstracto/Retorno';
import { Error_ } from '../Errores/Error';
import { Arreglo } from '../Objetos/Arreglo';
import { Entorno } from '../Simbolo/Entorno';
import { Simbolo } from '../Simbolo/Simbolo';

export class AccesoArreglo extends Expresion {

    public id: string;
    private indice: Expresion;
    private anterior: Expresion | null;
    public funcion: string;
    public paraPush: Expresion | null;

    constructor(id: string, indice: Expresion, anterior: Expresion | null, funcion: string, paraPush: Expresion | null, linea: number, columna: number) {
        super(linea, columna);
        this.id = id;
        this.indice = indice;
        this.anterior = anterior;
        this.funcion = funcion;
        this.paraPush = paraPush;
    }

    public ejecutar(entorno: Entorno): Retorno {
        if (this.anterior == null) {
            let varArreglo = entorno.getVar(this.id);
            if (this.indice == null) {
                if (varArreglo.valor instanceof Arreglo) {
                    if (this.funcion == '.length') {
                        return { valor: varArreglo.valor.getLength(), tipo: Tipo.NUMBER };
                    } else if (this.funcion == '.pop') {
                        return { valor: varArreglo.valor.pop(), tipo: varArreglo.valor.tipo };
                    } else if (this.funcion == '.push') {
                        //TODO ACA VA EL PUSH
                        let insertar = this.paraPush.ejecutar(entorno);
                        if (insertar.tipo == Tipo.ARRAY) {
                            varArreglo.valor.setElemento(new Simbolo(insertar.valor, varArreglo.id, varArreglo.valor.tipo, 'let', ''), varArreglo.valor.getLength());
                            return { valor: true, tipo: Tipo.BOOLEAN };
                        } else {
                            varArreglo.valor.setElemento(new Simbolo(insertar.valor, varArreglo.id, insertar.tipo, 'let', ''), varArreglo.valor.getLength());
                            return { valor: true, tipo: Tipo.BOOLEAN };
                        }

                    }

                }
                throw new Error_(this.linea, this.columna, "Semantico", "Se necesita un indice para acceer a un arreglo.");
            }
            if (varArreglo?.valor instanceof Arreglo) {
                let posicion = this.indice.ejecutar(entorno);
                if (posicion.tipo == Tipo.NUMBER) {
                    posicion.valor = Math.round(posicion.valor);
                    if (this.funcion != '') {
                        if (this.funcion == '.length' && varArreglo.valor.getElemento(posicion.valor).valor instanceof Arreglo) {
                            return { valor: varArreglo.valor.getElemento(posicion.valor).valor.getLength(), tipo: Tipo.NUMBER };
                        } else if (this.funcion == '.pop' && varArreglo.valor.getElemento(posicion.valor).valor instanceof Arreglo) {
                            let a = { valor: varArreglo.valor.getElemento(posicion.valor).valor.pop().valor.valor.valor, tipo: varArreglo.valor.tipo };
                            console.log('soy a');
                            console.log(a);
                            return a;
                        } else if (this.funcion == '.push' && varArreglo.valor.getElemento(posicion.valor).valor instanceof Arreglo) {
                            let resultado = this.paraPush.ejecutar(entorno);
                            console.log(resultado);
                            console.log(varArreglo);
                            if (resultado.tipo == varArreglo.valor.tipo.tipo) {
                                //TODO asignar el valor del push y corregir condicion
                                let insertar = this.paraPush.ejecutar(entorno);
                                if (insertar.tipo == Tipo.ARRAY) {
                                    varArreglo.valor.setElemento(new Simbolo(insertar.valor, varArreglo.id, varArreglo.valor.tipo, 'let', ''), varArreglo.valor.getLength());
                                    return { valor: true, tipo: Tipo.BOOLEAN };
                                } else {
                                    varArreglo.valor.setElemento(new Simbolo(insertar.valor, varArreglo.id, insertar.tipo, 'let', ''), varArreglo.valor.getLength());
                                    return { valor: true, tipo: Tipo.BOOLEAN };
                                }

                                return { valor: true, tipo: Tipo.BOOLEAN };
                            } else {
                                return { valor: false, tipo: Tipo.BOOLEAN };
                            }
                        }
                    } else {
                        return { valor: varArreglo.valor.getElemento(posicion.valor).valor, tipo: varArreglo.valor.getElemento(posicion.valor).tipo };
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
                            if (this.funcion == '.length' && valor.getElemento(posicion.valor).valor instanceof Arreglo) {
                                return { valor: valor.getElemento(posicion.valor).valor.getLength(), tipo: Tipo.NUMBER };
                            } else if (this.funcion == '.pop') {
                                let a = { valor: valor.getElemento(posicion.valor).valor.pop().valor, tipo: valor.tipo };
                                console.log('soy aaa');
                                console.table(entorno);
                                return a;
                            } else if (this.funcion == '.push') {
                                let resultado = this.paraPush.ejecutar(entorno);
                                if (resultado.tipo == valor.getElemento(posicion.valor).valor.elementos[0].tipo) {
                                    //TODO asignar el valor del push y corregir condicion
                                    return { valor: true, tipo: Tipo.BOOLEAN };
                                } else {
                                    return { valor: false, tipo: Tipo.BOOLEAN };
                                }
                            } else {
                                throw new Error_(this.linea, this.columna, "Semantico", "Solo pueden aplicar las operacions push, pop y length a tipos de datos arreglos");
                            }
                        } else {
                            return { valor: valor.getElemento(posicion.valor).valor, tipo: valor.getElemento(posicion.valor).tipo };
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