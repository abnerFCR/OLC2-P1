import { Instruccion } from "../Abstracto/Instruccion";
import { Expresion } from "../Abstracto/Expresion";
import { Entorno } from "../Simbolo/Entorno";
import { Tipo } from '../Abstracto/Retorno';
import { Error_ } from "../Errores/Error";

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
//TODO imprimir en consola 
    public ejecutar(entorno : Entorno) {
        const resCondicion=this.condicion.ejecutar(entorno);
        
        if(resCondicion.tipo != Tipo.BOOLEAN){
            throw new Error_(this.linea, this.columna, 'Semantico', 'Una condicion debe ser booleana');
        }

        if(resCondicion.valor){
            this.instruccionesSisi.ejecutar(entorno);
        }else{
            this.instruccionesSino?.ejecutar(entorno);
        }
        //HAY QUE PASAR EL VALOR A LA INTERFAZ GRAFICA. 

    }
}
