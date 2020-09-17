import { Instruccion } from '../Abstracto/Instruccion';
import { Entorno } from '../Simbolo/Entorno';
import { Tipo } from '../Abstracto/Retorno';


export class DeclaracionArreglo extends Instruccion{
    
    private id:string;
    private tipo:Tipo;
    private valores:Array<any>= new Array();
    private tipoSimbolo:string;

    constructor(id:string, tipo:Tipo, valores:Array<any>,tipoSimbolo:string, linea:number,columna:number){
        super(linea,columna);
        this.id=id;
        this.tipo=tipo;
        this.valores=valores;
        this.tipoSimbolo = tipoSimbolo;
    }

    public ejecutar(entorno: Entorno) {

    }

}




