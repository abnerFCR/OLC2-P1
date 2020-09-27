import { Statement } from '@angular/compiler';
import { Expresion } from '../Abstracto/Expresion';
import { Instruccion } from '../Abstracto/Instruccion';
import { Retorno, Tipo } from '../Abstracto/Retorno';
import { errores } from '../Errores/Errores';
import { Entorno } from '../Simbolo/Entorno';
import { ElementoDeclaracion } from '../Util/ElementoDeclaracion';

export class Funcion extends Instruccion{
    
    public nombre:string;
    public parametros:ElementoDeclaracion[];
    public instrucciones:Instruccion;
    public tipoRetorno:any;

    constructor(nombre:string, parametros:ElementoDeclaracion[], tipoRetorno:any,instrucciones:Instruccion, linea:number, columna:number){
        super(linea, columna);
        this.nombre= nombre;
        this.parametros =  parametros;
        this.tipoRetorno = tipoRetorno;
        this.instrucciones = instrucciones;
        
    }
    
    public ejecutar(entorno: Entorno) {
        try {
            console.log(this);
            entorno.guardarFunciones(this.nombre, this, this.linea, this.columna);
        } catch (error) {
            errores.push(error);
        }
    }
}