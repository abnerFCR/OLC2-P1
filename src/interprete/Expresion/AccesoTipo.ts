import { Instruccion } from '../Abstracto/Instruccion';
import { Expresion } from '../Abstracto/Expresion';
import { Entorno } from '../Simbolo/Entorno';
import { Retorno, Tipo } from '../Abstracto/Retorno';
import { Type_ } from '../Objetos/Type_';
import { Error_ } from '../Errores/Error';

export class AccesoTipo extends Expresion{

    private id1:string;
    private id2:string;
    private anterior:Expresion |null;

    constructor(id1:string, id2:string, anterior:Expresion|null, fila:number, columna:number){
        super(fila, columna);
        this.id1 = id1;
        this.id2 = id2;
        this.anterior = anterior;
    }

    public ejecutar(entorno: Entorno): Retorno {

        if(this.anterior == null){
            let variableId1 = entorno.getVar(this.id1);
            if(variableId1 == null){
                throw new Error_(this.linea, this.columna, "Semantico", "El tipo '"+this.id1+"' no existe");
            }
            
            if(variableId1?.valor instanceof Type_){
                let valorId1 = variableId1.valor as Type_;
                if(valorId1.getAtributo(this.id2) == null){
                    throw new Error_(this.linea, this.columna, "Semantico", "La variable '"+this.id2+"' no existe");
                }

                return {valor:valorId1.getAtributo(this.id2).valor, tipo:valorId1.getAtributo(this.id2).valor.tipo};
            }else{
                throw new Error_(this.linea, this.columna, "Semantico", "No es una instancia de tipo");
            }
        }else{
            let anterior = this.anterior.ejecutar(entorno);
            let x = anterior.valor as Type_;

            if(x == null){
                throw new Error_(this.linea, this.columna, "Semantico", "Error al acceder a los parametros del tipo");
            }

            let z = x.getAtributo(this.id1);
            if(z == null){
                throw new Error_(this.linea, this.columna, "Semantico", "No existe el parametro '"+this.id1+"' en este tipo");
            }
            
            return {valor: z?.valor, tipo:z?.valor};
        }
        return null;
    }   
}