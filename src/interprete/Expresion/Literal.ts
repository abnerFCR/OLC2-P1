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
            let valor_string=this.valor.slice(1,-1);
            valor_string = valor_string.replaceAll('\\n','\n');
            valor_string = valor_string.replaceAll('\\r','\r');
            valor_string = valor_string.replaceAll('\\t','\t');
            valor_string = valor_string.replaceAll('\\"','\"');
            valor_string = valor_string.replaceAll("\\'",'\'');
            valor_string = valor_string.replaceAll("\\\\",'\\');
            return {valor : valor_string, tipo : Tipo.STRING};
        }else if(this.tipo == 3){
            const v:boolean=this.valor;
            return {valor : v, tipo : Tipo.BOOLEAN};
        }
    }
}

