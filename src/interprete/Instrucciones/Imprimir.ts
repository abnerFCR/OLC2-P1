import { Instruccion } from "../Abstracto/Instruccion";

import { Expresion } from "../Abstracto/Expresion";
import { Entorno } from "../Simbolo/Entorno";

export class Imprimir extends Instruccion{

    constructor(private valor : Expresion, linea : number, columna : number){
        super(linea, columna);
    }

    public ejecutar(entorno : Entorno) {
        const valor = this.valor.ejecutar(entorno);
        console.log(valor);
        return valor;
        //HAY QUE PASAR EL VALOR A LA INTERFAZ GRAFICA. 

    }
}




