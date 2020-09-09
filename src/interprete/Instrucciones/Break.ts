import { Instruccion } from '../Abstracto/Instruccion';
import { Entorno } from '../Simbolo/Entorno';

export class Break extends Instruccion{
    
    constructor(fila:number, columna:number){
        super(fila,columna);
    }
    public ejecutar(entorno: Entorno) {
        return;
    }
}