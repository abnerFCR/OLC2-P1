import { errores } from '../Errores/Errores';
import { Error_ } from '../Errores/Error';
import { Tipo } from '../Abstracto/Retorno';
import { Instruccion } from "../Abstracto/Instruccion";
import { Entorno } from "../Simbolo/Entorno";
import { Expresion } from '../Abstracto/Expresion';

export class Asignacion extends Instruccion{

    private id:string;
    private valor:Expresion;

    constructor(id:string, valor:Expresion, linea:number, columna:number){
        super(linea,columna);
        this.id = id;
        this.valor= valor;
    }

    public ejecutar(entorno: Entorno){
        const resultado = this.valor.ejecutar(entorno);
        let respuesta = entorno.updateVar(this.id, resultado.valor, resultado.tipo);
        if(respuesta instanceof Error_){
            respuesta.setLinea(this.linea);
            respuesta.setColumna(this.columna);
            errores.push(respuesta);
            
        }
        //console.log(entorno);
    }
}