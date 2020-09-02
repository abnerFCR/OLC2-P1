import { Simbolo } from "./Simbolo";
import { Tipo } from "../Abstracto/Retorno";

export class Entorno{
    
    private variables : Map<string, Simbolo>;

    constructor(public anterior : Entorno | null){
        this.variables = new Map();
    }

    public guardar(id: string, valor: any, tipo: Tipo){
        let env : Entorno | null = this;
        while(env != null){
            if(env.variables.has(id)){
                env.variables.set(id, new Simbolo(valor, id, tipo));
                return;
            }
            env = env.anterior;
        }
        this.variables.set(id, new Simbolo(valor, id, tipo));
    }

}