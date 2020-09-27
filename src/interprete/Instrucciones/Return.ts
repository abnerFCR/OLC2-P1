import { Expresion } from '../Abstracto/Expresion';
import { Instruccion } from '../Abstracto/Instruccion';
import { Retorno } from '../Abstracto/Retorno';
import { Error_ } from '../Errores/Error';
import { Entorno } from '../Simbolo/Entorno';

export class Return extends Instruccion{
    
    constructor(public expresion:any, fila:number, columna:number){
        super(fila,columna);
    }
    public ejecutar(entorno: Entorno) {
        let resultado  = this.expresion.ejecutar(entorno);
        return new Return(resultado,this.linea, this.columna);
        //throw new Error_(this.linea, this.columna,"Semantico","Un Break solamente puede estar dentro de un ciclo o un switch");
    }
}