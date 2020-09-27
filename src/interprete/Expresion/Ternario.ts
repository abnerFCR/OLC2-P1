import { expressionType } from '@angular/compiler/src/output/output_ast';
import { Expresion } from '../Abstracto/Expresion';
import { Retorno, Tipo } from '../Abstracto/Retorno';
import { Error_ } from '../Errores/Error';
import { Entorno } from '../Simbolo/Entorno';

export class Ternario extends Expresion{
    private expresionBooleana:Expresion;
    private si:Expresion; 
    private no:Expresion;

    constructor(expresionBooleana:Expresion, si:Expresion, no:Expresion, linea:number, columna:number){
        super(linea,columna);
        this.expresionBooleana = expresionBooleana;
        this.si = si;
        this.no = no;
    }
    public ejecutar(entorno: Entorno): Retorno {
        console.log("Estoy en ternario");
        let condicion = this.expresionBooleana.ejecutar(entorno);
        if(condicion.tipo != Tipo.BOOLEAN){
            throw new Error_(this.linea, this.columna, "Semantico", "La condicion inicial del operador ternario debe ser booleana");
        }
        let respuesta;
        if(condicion.valor == true){
            respuesta = this.si.ejecutar(entorno);
        }else{
            respuesta = this.no.ejecutar(entorno);
        }
        console.log("Respuesta");
        console.log(respuesta);
        return respuesta;
    }    
}