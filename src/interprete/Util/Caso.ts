import { Instruccion } from '../Abstracto/Instruccion';
import { Entorno } from '../Simbolo/Entorno';
import { Expresion } from '../Abstracto/Expresion';
import { Statement } from '../Instrucciones/Statement';
import { Retorno } from '../Abstracto/Retorno';

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
        }else{
            for(const instr of this.listaInstrucciones){
                console.log("intento ejecutar las instrucciones");
                let respuesta = instr.ejecutar(entorno);
                console.log(respuesta);
                //TODO poner si respuesta es una instancia de break entonces return new break (en el caso del if return new break hasta encontrar un ciclo)
            }
        }
        
    }

    public getValor(entorno:Entorno):Retorno{
        if(this.valor == null){
            return null;
        }
        return this.valor.ejecutar(entorno);
    }

    
}