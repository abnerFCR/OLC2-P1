import { Instruccion } from '../Abstracto/Instruccion';
import { Entorno } from '../Simbolo/Entorno';
import { Acceso } from '../Expresion/Acceso';
import { Tipo } from '../Abstracto/Retorno';
import { Error_ } from '../Errores/Error';

export class IncreDecre extends Instruccion{
    
    private id:Acceso;
    private operacion:string;

    constructor(operacion:string, id:Acceso, linea:number, columna:number){
        super(linea, columna);
        this.id=id;
        this.operacion=operacion;
    }
    public ejecutar(entorno: Entorno) {

        let respuesta = this.id.ejecutar(entorno);
        if(respuesta.tipo == Tipo.NUMBER){
            if(this.operacion == "incre"){
                respuesta.valor++;
                //console.log(entorno);
            }else{
                respuesta.valor--;
            }
            let cumplido = entorno.updateVar(this.id.id, respuesta.valor,respuesta.tipo, "", this.linea, this.columna);
            if(cumplido instanceof Error_){
                cumplido.setLinea(this.linea);
                cumplido.setColumna(this.columna);
                throw cumplido;
            }
        }else{
            throw new Error_(this.linea, this.columna, "Semantico", "Solamente se pueden incrementar variables NUMBER");
        }
    }
}