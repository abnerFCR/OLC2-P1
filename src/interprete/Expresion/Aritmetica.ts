import { Expresion } from "../Abstracto/Expresion";
import { Retorno, Tipo } from "../Abstracto/Retorno";
import { Entorno } from "../Simbolo/Entorno";
import { Error_ } from "../Errores/Error";

export enum OperacionAritmetica{
    SUMA,
    RESTA,
    MULTIPLICACION,
    DIVISION,
    POTENCIA,
    MODULO,
    NEGACION,
    INCREMENTO,
    DECREMENTO
}

export class Aritmetica extends Expresion{
    private tiposString:string[]=['NUMBER','STRING', 'BOOLEAN','NULL', 'ARRAY', 'VOID'];
    
    constructor(private izquierda: Expresion, private derecha: Expresion, private tipo : OperacionAritmetica, linea: number, columna: number){
        super(linea,columna);
    }


    public ejecutar(entorno : Entorno) : Retorno{

        

        const izquierdaValue = this.izquierda.ejecutar(entorno);
        const derechaValue = this.derecha.ejecutar(entorno);

        let result : Retorno;

        const tipoDominante = this.tipoDominante(izquierdaValue.tipo, derechaValue.tipo);
        
        if(this.tipo == OperacionAritmetica.SUMA){

            if(tipoDominante == Tipo.STRING){
                result = {valor : (izquierdaValue.valor.toString() + derechaValue.valor.toString()), tipo : Tipo.STRING};
            }
            else if(tipoDominante == Tipo.NUMBER){
                result = {valor : (izquierdaValue.valor + derechaValue.valor), tipo : Tipo.NUMBER};
            }
            else{
                result={valor:-1, tipo: Tipo.NULL};
                throw new Error_(this.linea, this.columna, 'Semantico', 'No se puede sumar: ' + this.tiposString[izquierdaValue.tipo] + ' _ ' +this.tiposString[derechaValue.tipo]);            
            }
        }
        else if(this.tipo == OperacionAritmetica.RESTA){
            if(tipoDominante == Tipo.NUMBER){
                result = {valor : (izquierdaValue.valor - derechaValue.valor), tipo : Tipo.NUMBER};    
            }else{
                result={valor:-1, tipo: Tipo.NULL};    
                throw new Error_(this.linea, this.columna, 'Semantico', 'No se puede restar: ' + this.tiposString[izquierdaValue.tipo] + ' _ ' +this.tiposString[derechaValue.tipo]);
            }
            
        }
        else if(this.tipo == OperacionAritmetica.MULTIPLICACION){
            if(tipoDominante == Tipo.NUMBER){
                result = {valor : (izquierdaValue.valor * derechaValue.valor), tipo : Tipo.NUMBER};
            }else{
                result={valor:-1, tipo: Tipo.NULL};    
                throw new Error_(this.linea, this.columna, 'Semantico', 'No se puede multiplicar: ' + this.tiposString[izquierdaValue.tipo] + ' _ ' +this.tiposString[derechaValue.tipo]);               
            }
        }
        else if(this.tipo == OperacionAritmetica.DIVISION){

            if(derechaValue.valor == 0){
                result={valor:-1, tipo: Tipo.NULL};
                throw new Error_(this.linea, this.columna, "Semantico", "No se puede dividir entre 0");
            }else if(tipoDominante==Tipo.NUMBER){
                result = {valor : (izquierdaValue.valor / derechaValue.valor), tipo : Tipo.NUMBER};
            }else{
                result={valor:-1, tipo: Tipo.NULL};    
                throw new Error_(this.linea, this.columna, 'Semantico', 'No se puede dividir: ' + this.tiposString[izquierdaValue.tipo] + ' _ ' +this.tiposString[derechaValue.tipo]);
            }
            
        }else if(this.tipo== OperacionAritmetica.POTENCIA){
            if(tipoDominante == Tipo.NUMBER){
                result ={valor: (Math.pow(izquierdaValue.valor, derechaValue.valor)), tipo: Tipo.NUMBER};
            }else{
                result={valor:-1, tipo: Tipo.NULL};    
                throw new Error_(this.linea, this.columna, 'Semantico', 'No se puede elevar: ' + this.tiposString[izquierdaValue.tipo] + ' _ ' +this.tiposString[derechaValue.tipo]);
            }

        }else if(this.tipo== OperacionAritmetica.MODULO){
            if(tipoDominante == Tipo.NUMBER){
                result ={valor: (izquierdaValue.valor % derechaValue.valor), tipo: Tipo.NUMBER};
            }else{
                result={valor:-1, tipo: Tipo.NULL};    
                throw new Error_(this.linea, this.columna, 'Semantico', 'No se puede dividir: ' + this.tiposString[izquierdaValue.tipo] + ' _ ' +this.tiposString[derechaValue.tipo]);
            }

        }else if(this.tipo== OperacionAritmetica.INCREMENTO){
            if(tipoDominante == Tipo.NUMBER){
                result ={valor: (izquierdaValue.valor + 1), tipo: Tipo.NUMBER};
            }else{
                result={valor:-1, tipo: Tipo.NULL};    
                throw new Error_(this.linea, this.columna, 'Semantico', 'No se puede incrementar: ' + this.tiposString[izquierdaValue.tipo]);
            }

        }else if(this.tipo== OperacionAritmetica.DECREMENTO){
            if(tipoDominante == Tipo.NUMBER){
                result ={valor: (izquierdaValue.valor-1), tipo: Tipo.NUMBER};
            }else{
                result={valor:-1, tipo: Tipo.NULL};    
                throw new Error_(this.linea, this.columna, 'Semantico', 'No se puede decrementar: ' + this.tiposString[izquierdaValue.tipo]);
            }

        }else if(this.tipo== OperacionAritmetica.NEGACION){
            if(tipoDominante == Tipo.NUMBER){
                result ={valor: (izquierdaValue.valor*-1), tipo: Tipo.NUMBER};
            }else{
                result={valor:-1, tipo: Tipo.NULL};    
                throw new Error_(this.linea, this.columna, 'Semantico', 'No se puede negar: ' + this.tiposString[izquierdaValue.tipo]);
            }

        }else{
            result={valor:-1, tipo: Tipo.NULL};    
            throw new Error_(this.linea, this.columna, 'Semantico', 'No es una operacion aritmetica valida ' + this.tiposString[izquierdaValue.tipo]);
        }
        return result;
    }
}