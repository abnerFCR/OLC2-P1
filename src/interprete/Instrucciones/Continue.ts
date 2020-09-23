import { Instruccion } from '../Abstracto/Instruccion';
import { Error_ } from '../Errores/Error';
import { Entorno } from '../Simbolo/Entorno';

export class Continue extends Instruccion{
    
    constructor(fila:number, columna:number){
        super(fila,columna);
    }
    public ejecutar(entorno: Entorno) {
        if(entorno.getBanderaCiclo() == true){
            return new Continue(this.linea, this.columna);
        }
        throw new Error_(this.linea, this.columna,"Semantico","Un continue solamente puede estar dentro de un ciclo");
    }
}