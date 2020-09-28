import { Instruccion } from '../Abstracto/Instruccion';
import { Expresion } from '../Abstracto/Expresion';
import { Entorno } from '../Simbolo/Entorno';
import { Retorno, Tipo } from '../Abstracto/Retorno';
import { Type_ } from '../Objetos/Type_';
import { Error_ } from '../Errores/Error';

export class AsignacionIndTipo extends Expresion{

    private id1:string;
    private id2:string;
    private anterior:Expresion |null;
    public expresionNueva:Expresion;

    constructor(id1:string, id2:string, anterior:Expresion|null,nuevaExpresion, fila:number, columna:number){
        super(fila, columna);
        this.id1 = id1;
        this.id2 = id2;
        this.anterior = anterior;
        this.expresionNueva =nuevaExpresion;
    }

    public ejecutar(entorno: Entorno): Retorno {
        console.log(this);
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
                if(this.expresionNueva == null){
                    return {valor:valorId1.getAtributo(this.id2).valor, tipo:valorId1.getAtributo(this.id2).valor.tipo};
                }else{
                    let resultadoExpresion = this.expresionNueva.ejecutar(entorno);
                    if(resultadoExpresion.tipo == valorId1.getAtributo(this.id2).tipo){
                        valorId1.getAtributo(this.id2).valor = resultadoExpresion.valor;
                    }else{
                        throw new Error_(this.linea, this.columna, "Semantico", "El tipo de dato que desea asignar no coincide con el valor");
                    }
                    
                }
                
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
            let resultadoExpresion = this.expresionNueva.ejecutar(entorno);
            console.log("------------------------------------------------");
            console.log(resultadoExpresion);
            if(z.tipo == resultadoExpresion.tipo){
                x.getAtributo(this.id1).valor = resultadoExpresion.valor;
            }else{
                throw new Error_(this.linea,this.columna, "Semantico", "El tipo de atributo no coincide con el tipo del valor");
            }
            //return {valor: z?.valor, tipo:z?.valor};
        }
        return null;
    }   
}