import { Instruccion } from '../Abstracto/Instruccion';
import { Error_ } from '../Errores/Error';
import { Entorno } from '../Simbolo/Entorno';

export class Break extends Instruccion{
    
    constructor(fila:number, columna:number){
        super(fila,columna);
    }
    public ejecutar(entorno: Entorno) {
        if(entorno.getBanderaCiclo() == true    ||  entorno.getBanderaSwitch()==true){
            return new Break(this.linea, this.columna);
        }
        throw new Error_(this.linea, this.columna,"Semantico","Un Break solamente puede estar dentro de un ciclo o un switch");
    }
}