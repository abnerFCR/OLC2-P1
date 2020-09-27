import { Instruccion } from '../Abstracto/Instruccion';
import { Entorno } from '../Simbolo/Entorno';
import { Expresion } from '../Abstracto/Expresion';
import { Statement } from '../Instrucciones/Statement';
import { Retorno } from '../Abstracto/Retorno';
import { errores } from '../Errores/Errores';
import { Break } from '../Instrucciones/Break';
import { Continue } from '../Instrucciones/Continue';
import { Return } from '../Instrucciones/Return';

export class Caso extends Instruccion{
    
    private listaInstrucciones: any;
    private valor:Expresion;

    constructor(valor:Expresion, listaInstrucciones:any, fila:number, columna:number){
        super(fila, columna);
        this.valor=valor;
        this.listaInstrucciones=listaInstrucciones;
    }


    public ejecutar(entorno: Entorno) {
        if(this.listaInstrucciones instanceof Statement){
            const respuesta = this.listaInstrucciones.ejecutar(entorno);
            if(respuesta instanceof Break){
                return respuesta;
            }
            if(respuesta instanceof Return){
                return respuesta;
            }
        }else{
            for(const instr of this.listaInstrucciones){
                try{
                    let respuesta = instr.ejecutar(entorno);
                    if(respuesta instanceof Break){
                        return respuesta;
                    }
                    if(respuesta instanceof Continue){
                        return respuesta;
                    }
                    if(respuesta instanceof Return){
                        return respuesta;
                    }
                }catch(error){
                    errores.push(error);
                } 
            }
        }   
    }

    public getValor(entorno:Entorno):Retorno{
        if(this.valor == null){
            return null;//si el caso devuelve null es porque es default
        }
        return this.valor.ejecutar(entorno);
    }

    
}