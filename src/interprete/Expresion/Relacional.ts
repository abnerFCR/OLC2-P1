import { Expresion } from "../Abstracto/Expresion";
import { Retorno, Tipo } from "../Abstracto/Retorno";
import { Entorno } from "../Simbolo/Entorno";
import { Error_ } from "../Errores/Error";

export enum OperacionRelacional{
    MAYORQUE,
    MENORQUE,
    MAYORIGUALQUE,
    MENORIGUALQUE,
    IGUALACION,
    DIFERENCIACION,
    AND,
    OR,
    NOT
}

export class Relacional extends Expresion{
    private tiposString:string[]=['NUMBER','STRING', 'BOOLEAN','NULL', 'ARRAY', 'VOID'];
    
    constructor(private izquierda: Expresion, private derecha: Expresion, private tipo : OperacionRelacional, linea: number, columna: number){
        super(linea,columna);
    }
    //TODO PREGUNTA: LOS TIPOS TIENEN QUE SER IGUALES PARA COMPARARSE


    //TODO Probar muy bien las validaciones
    public ejecutar(entorno : Entorno) : Retorno{
        const izquierdaValue = this.izquierda.ejecutar(entorno);
        const derechaValue = this.derecha.ejecutar(entorno);

        let result : Retorno;

        if(izquierdaValue.tipo == derechaValue.tipo){
            if(this.tipo == OperacionRelacional.IGUALACION)
            {
                const respuesta=izquierdaValue.valor ==derechaValue.valor ;
                result = {valor: respuesta, tipo: Tipo.BOOLEAN};
            }
            else if(this.tipo == OperacionRelacional.DIFERENCIACION)
            {
                const respuesta=izquierdaValue.valor != derechaValue.valor;
                result = {valor: respuesta, tipo: Tipo.BOOLEAN};
            }
            else if(this.tipo == OperacionRelacional.MAYORIGUALQUE)
            {
                const respuesta=izquierdaValue.valor >= derechaValue.valor;
                result = {valor: respuesta, tipo: Tipo.BOOLEAN};
            }
            else if(this.tipo == OperacionRelacional.MENORIGUALQUE)
            {
                const respuesta=izquierdaValue.valor <= derechaValue.valor;
                result = {valor: respuesta, tipo: Tipo.BOOLEAN};
            }
            else if(this.tipo == OperacionRelacional.MAYORQUE)
            {
                const respuesta=izquierdaValue.valor > derechaValue.valor;
                result = {valor: respuesta, tipo: Tipo.BOOLEAN};
            }
            else if(this.tipo == OperacionRelacional.MENORQUE)
            {
                const respuesta=izquierdaValue.valor < derechaValue.valor;
                result = {valor: respuesta, tipo: Tipo.BOOLEAN};
            }
            else if(this.tipo == OperacionRelacional.AND)
            {
                if(izquierdaValue.tipo == Tipo.BOOLEAN  && derechaValue.tipo == Tipo.BOOLEAN)
                {
                    const respuesta:boolean = izquierdaValue.valor && derechaValue.valor;
                    result = {valor: respuesta, tipo: Tipo.BOOLEAN};
                }
                else
                {
                    result={valor:-1, tipo: Tipo.NULL};    
                    throw new Error_(this.linea, this.columna, 'Semantico', 'No se pueden operar logicamente: ' + this.tiposString[izquierdaValue.tipo]+'_'+this.tiposString[derechaValue.tipo]);
                }

            }
            else if(this.tipo == OperacionRelacional.OR)
            {
                if(izquierdaValue.tipo == Tipo.BOOLEAN  && derechaValue.tipo == Tipo.BOOLEAN)
                {
                    const respuesta:boolean = izquierdaValue.valor || derechaValue.valor;
                    //console.log("hola mundo");
                    result = {valor: respuesta, tipo: Tipo.BOOLEAN};
                }
                else
                {
                    result={valor:-1, tipo: Tipo.NULL};    
                    throw new Error_(this.linea, this.columna, 'Semantico', 'No se pueden operar logicamente: ' + this.tiposString[izquierdaValue.tipo]+'_'+this.tiposString[derechaValue.tipo]);
                }

            }
            else if(this.tipo == OperacionRelacional.NOT)
            {
                if(izquierdaValue.tipo == Tipo.BOOLEAN  && derechaValue.tipo == Tipo.BOOLEAN)
                {
                    const respuesta:boolean = ! izquierdaValue.valor;
                    result = {valor: respuesta, tipo: Tipo.BOOLEAN};
                }
                else
                {
                    result={valor:-1, tipo: Tipo.NULL};    
                    throw new Error_(this.linea, this.columna, 'Semantico', 'No se pueden operar logicamente: ' + this.tiposString[izquierdaValue.tipo]+'_'+this.tiposString[derechaValue.tipo]);
                }

            }

        }else{
            if((izquierdaValue.tipo == Tipo.TYPE && derechaValue.tipo==Tipo.NULL)){
                const respuesta:boolean = izquierdaValue.valor ==null;
                return {valor:respuesta, tipo:Tipo.BOOLEAN};
            }else if(izquierdaValue.tipo==Tipo.NULL && derechaValue.tipo == Tipo.TYPE ){
                const respuesta:boolean = derechaValue.valor ==null;
                return {valor:respuesta, tipo:Tipo.BOOLEAN};
            }
            result={valor:-1, tipo: Tipo.NULL};    
            throw new Error_(this.linea, this.columna, 'Semantico', 'No se pueden comparar tipos distintos: ' + this.tiposString[izquierdaValue.tipo]+'_'+this.tiposString[derechaValue.tipo]);
        }

        return result;
    }
}