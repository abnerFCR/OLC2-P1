import { Expresion } from "../Abstracto/Expresion";
import { Retorno,Tipo } from "../Abstracto/Retorno";

export class Literal extends Expresion{
    
    constructor(private valor : any, linea : number, columna: number, private tipo : number){
        super(linea, columna);
    }

    public ejecutar() : Retorno{
        if(this.tipo <= 1){
            return {valor : Number(this.valor), tipo : Tipo.NUMBER};
        }else if (this.tipo == 2){
            return {valor : this.valor, tipo : Tipo.STRING};
        }else if(this.tipo == 3){
            const v:boolean=this.valor;
            return {valor : v, tipo : Tipo.BOOLEAN};
        }
            
    }

}

