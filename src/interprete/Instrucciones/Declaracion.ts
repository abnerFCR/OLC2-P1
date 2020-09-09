import { Instruccion } from "../Abstracto/Instruccion";
import { Entorno } from "../Simbolo/Entorno";
import { Expresion } from "../Abstracto/Expresion";
import { Tipo } from '../Abstracto/Retorno';
import { ElementoDeclaracion, TipoDeclaracion } from '../Util/ElementoDeclaracion';
import { errores } from '../Errores/Errores';
import { Error_ } from '../Errores/Error';
//import { env } from "process";

export class Declaracion extends Instruccion{

    private declaraciones: any;
    private tipoDeclaraciones:string; //constante o variable. 

    constructor(tipoDeclaraciones: string, declaraciones:any, linea : number, columna: number){
        super(linea, columna);
        this.tipoDeclaraciones = tipoDeclaraciones;
        this.declaraciones= declaraciones;
    }
    
    public ejecutar(entorno: Entorno) {
        for(const declaracion of this.declaraciones)
        {
            if(declaracion.tipoDeclaracion == TipoDeclaracion.ID)
            {
                entorno.guardar(declaracion.id, null, Tipo.NULL,this.tipoDeclaraciones);
            }
            else if(declaracion.tipoDeclaracion == TipoDeclaracion.ID_TIPO)
            {
                entorno.guardar(declaracion.id, null, declaracion.tipo, this.tipoDeclaraciones);
            }
            else if(declaracion.tipoDeclaracion == TipoDeclaracion.ID_VALOR)
            {
                const val = declaracion.valor.ejecutar(entorno);
                entorno.guardar(declaracion.id, val.valor, val.tipo,this.tipoDeclaraciones);
            }
            else if(declaracion.tipoDeclaracion == TipoDeclaracion.ID_TIPO_VALOR)
            {   
                const val = declaracion.valor.ejecutar(entorno);
                if(val.tipo == declaracion.tipo)
                {
                    entorno.guardar(declaracion.id, val.valor, val.tipo,this.tipoDeclaraciones);
                }
                else{
                    throw new Error_(this.linea, this.columna, 'Semantico', 'Error al declarar la variable, el tipo de dato no concuerda con su valor');        
                }
            }
            else
            {
                throw new Error_(this.linea, this.columna, 'Semantico', 'Error al declarar la variable [DEV. Revisar clase declaracion] ');
            }
        }
    }
}