import { Instruccion } from '../Abstracto/Instruccion';
import { Entorno } from '../Simbolo/Entorno';
import { Expresion } from '../Abstracto/Expresion';
import { Caso } from '../Util/Caso';

export class Switch extends Instruccion {
    
    private valor:Expresion;
    private listaCasos:Array<Caso>;

    constructor(valor:Expresion, listaCasos:Array<Caso>, linea:number, columna:number){
        super(linea, columna);
        this.valor= valor;
        this.listaCasos=listaCasos;
    }
    //TODO el switch ejecuta cada caso por separado, no importa sino tiene break solo ejecutara las instrucciones de ese caso.
    public ejecutar(entorno: Entorno) {
        const nuevoEntorno =new Entorno(entorno);
        const valorOp= this.valor.ejecutar(nuevoEntorno);
        for(const caso of this.listaCasos){
            let valorCaso= caso.getValor(nuevoEntorno);
            if(valorCaso == null){
                let respuesta = caso.ejecutar(nuevoEntorno);
                return;
            }
            if(valorCaso.valor == valorOp.valor    &&  valorCaso.tipo == valorOp.tipo){
                let respuesta = caso.ejecutar(nuevoEntorno);
                return;
            }
        }
    }
}