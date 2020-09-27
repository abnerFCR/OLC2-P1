import { Instruccion } from "../Abstracto/Instruccion";
import { Expresion } from "../Abstracto/Expresion";
import { Entorno } from "../Simbolo/Entorno";
import { Tipo } from '../Abstracto/Retorno';
import { Error_ } from "../Errores/Error";
import { errores } from '../Errores/Errores';
import { Break } from './Break';
import { Continue } from './Continue';
import { Return } from './Return';

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
        entorno.setBanderaCiclo(true);
        let resCondicion=this.condicion.ejecutar(entorno);
        if(resCondicion.tipo != Tipo.BOOLEAN){
            throw new Error_(this.linea, this.columna, 'Semantico', 'Error en While: La condicion debe ser booleana.');
        }
        while(resCondicion.valor){  
            try {
                const resultado = this.instrucciones.ejecutar(entorno);
                if(resultado instanceof Break){
                    //entorno.setBanderaCiclo(false);
                    break;
                }
                
                if(resultado instanceof Continue){
                    //entorno.setBanderaCiclo(false);
                    //continue; //NO PUEDO PONER ESTE CONTINUE PORQUE FALTA QUE SE EJECUTE LA CONDICION. IGUAL ES CON EL DO WHILE
                } 
                if(resultado instanceof Return){
                    entorno.setBanderaCiclo(false);
                    return resultado;
                }
                   
            } catch (error) {
                errores.push(error);
            }
            resCondicion = this.condicion.ejecutar(entorno);
            if(resCondicion.tipo != Tipo.BOOLEAN){
                throw new Error_(this.linea, this.columna, 'Semantico', 'Error en While: La condicion debe ser booleana.');
            }
        }
        entorno.setBanderaCiclo(false);

    }
}
