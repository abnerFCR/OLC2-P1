import { Instruccion } from "../Abstracto/Instruccion";
import { Entorno } from "../Simbolo/Entorno";
import { Expresion } from "../Abstracto/Expresion";
import { Tipo } from '../Abstracto/Retorno';
import { ElementoDeclaracion, TipoDeclaracion } from '../Util/ElementoDeclaracion';
import { errores } from '../Errores/Errores';
import { Error_ } from '../Errores/Error';

export class Declaracion extends Instruccion{

    private declaraciones: any;
    private tipoDeclaraciones:string; //constante o variable. 

    constructor(tipoDeclaraciones: string, declaraciones:any, linea : number, columna: number){
        super(linea, columna);
        this.tipoDeclaraciones = tipoDeclaraciones;
        this.declaraciones= declaraciones;
    }
    //Si hay algun error al momento de guardar el dato, lo reporta el entorno.
    public ejecutar(entorno: Entorno) {
        for(const declaracion of this.declaraciones)
        {
            if(declaracion.tipoDeclaracion == TipoDeclaracion.ID)
            {
                if(this.tipoDeclaraciones == 'const')
                    throw new Error_(this.linea, this.columna, "Semantico","No se puede declarar una constante sin inicializarla.");
                entorno.guardar(declaracion.id, null, Tipo.NULL,this.tipoDeclaraciones, this.linea, this.columna);
            }
            else if(declaracion.tipoDeclaracion == TipoDeclaracion.ID_TIPO)
            {
                if(this.tipoDeclaraciones == 'const')
                    throw new Error_(this.linea, this.columna, "Semantico","No se puede declarar una constante sin inicializarla.");
                entorno.guardar(declaracion.id, null, declaracion.tipo, this.tipoDeclaraciones, this.linea, this.columna);
            }
            else if(declaracion.tipoDeclaracion == TipoDeclaracion.ID_VALOR)
            {
                const val = declaracion.valor.ejecutar(entorno);
                entorno.guardar(declaracion.id, val.valor, val.tipo,this.tipoDeclaraciones, this.linea, this.columna);
            }
            else if(declaracion.tipoDeclaracion == TipoDeclaracion.ID_TIPO_VALOR)
            {   
                const val = declaracion.valor.ejecutar(entorno);
                if(val.tipo == declaracion.tipo)
                {
                    entorno.guardar(declaracion.id, val.valor, val.tipo,this.tipoDeclaraciones, this.linea, this.columna);
                }
                else{
                    throw new Error_(this.linea, this.columna, 'Semantico', 'Error al declarar la variable, el tipo de dato no concuerda con su valor');        
                }
            }
            else
            {
                throw new Error_(this.linea, this.columna, 'Semantico', 'Error al declarar la variable [DEV] ');
            }   
        }
    }
}