import { Entorno } from "../Simbolo/Entorno";

export abstract class Instruccion {

    public linea: number;
    public columna: number;

    constructor(linea: number, columna: number) {
        this.linea = linea;
        this.columna = columna;
    }

    public abstract ejecutar(entorno : Entorno) : any;

}