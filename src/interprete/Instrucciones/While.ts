import { Instruccion } from "../Abstracto/Instruccion";
import { Expresion } from "../Abstracto/Expresion";
import { Entorno } from "../Simbolo/Entorno";
import { Tipo } from '../Abstracto/Retorno';
import { Error_ } from "../Errores/Error";
import { errores } from '../Errores/Errores';

export class While extends Instruccion{

    constructor(
        private condicion:Expresion, 
        private instrucciones: Instruccion, 
        linea : number, 
        columna : number
        )
        {
        super(linea, columna);
    }

    public ejecutar(entorno : Entorno) {

        let resCondicion=this.condicion.ejecutar(entorno);
        if(resCondicion.tipo != Tipo.BOOLEAN){
            throw new Error_(this.linea, this.columna, 'Semantico', 'Error en While: La condicion debe ser booleana.');
        }
        while(resCondicion.valor){  
            try {
                const resultado = this.instrucciones.ejecutar(entorno);    
            } catch (error) {
                errores.push(error);
            }
            resCondicion = this.condicion.ejecutar(entorno);
            if(resCondicion.tipo != Tipo.BOOLEAN){
                throw new Error_(this.linea, this.columna, 'Semantico', 'Error en While: La condicion debe ser booleana.');
            }
        }

    }
}
