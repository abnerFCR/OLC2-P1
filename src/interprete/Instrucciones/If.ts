import { Instruccion } from "../Abstracto/Instruccion";
import { Expresion } from "../Abstracto/Expresion";
import { Entorno } from "../Simbolo/Entorno";
import { Tipo } from '../Abstracto/Retorno';
import { Error_ } from "../Errores/Error";
import { Break } from './Break';
import { Continue } from './Continue';

export class If extends Instruccion{

    constructor(
        private condicion:Expresion, 
        private instruccionesSisi: Instruccion, 
        private instruccionesSino:Instruccion|null,
        linea : number, 
        columna : number
        )
        {
        super(linea, columna);
    }

    public ejecutar(entorno : Entorno) {
        
        const resCondicion=this.condicion.ejecutar(entorno);
        if(resCondicion.tipo != Tipo.BOOLEAN){
            throw new Error_(this.linea, this.columna, 'Semantico', 'La condicion debe ser booleana');
        }
        let respuesta;
        if(resCondicion.valor){
            respuesta = this.instruccionesSisi.ejecutar(entorno);
        }else{
            respuesta = this.instruccionesSino?.ejecutar(entorno);
        } 
        if(respuesta instanceof Break){
            return respuesta;
        }
        if(respuesta instanceof Continue){
            return respuesta;
        }

    }
}
