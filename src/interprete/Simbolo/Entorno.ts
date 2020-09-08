import { Simbolo } from "./Simbolo";
import { Tipo } from "../Abstracto/Retorno";
import { Error_ } from '../Errores/Error';
import { errores } from '../Errores/Errores';

export class Entorno{

    private variables : Map<string, Simbolo>;
    //TODO UNA CLASE LLAMADA TYPE Y PONERLO COMO VALOR DEL MAP
    private types: Map<string, Simbolo>;

    constructor(public anterior : Entorno | null){
        this.variables = new Map();
    }

    //TODO NOTIFICAR ERROR EN FORMA QUE SE INSERTA EN EL AMBITO
    public guardar(id: string, valor: any, tipo: Tipo, tipoSimbolo){
        let entorno : Entorno | null = this;
        while(entorno != null){
            if(!entorno.variables.has(id)){
                entorno.variables.set(id, new Simbolo(valor, id, tipo, tipoSimbolo));
                return;
            }
            entorno = entorno.anterior;
        }
        let nuevoError= new Error_(1,1,"entorno", "Ya existe una variable con el mismo nombre en ese ambito");
        errores.push(nuevoError);
        //this.variables.set(id, new Simbolo(valor, id, tipo));
    }

    public getVar(id: string) : Simbolo | undefined | null{
        let entorno : Entorno | null = this;
        while(entorno != null){
            if(entorno.variables.has(id)){
                return entorno.variables.get(id);
            }
            entorno = entorno.anterior;
        }
        let nuevoError= new Error_(1,1,"Entorno", "No existe la variable en este ambito");
        errores.push(nuevoError);
        return null;
    } 
}