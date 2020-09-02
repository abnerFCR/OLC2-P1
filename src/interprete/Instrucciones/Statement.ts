import { Instruccion } from "../Abstracto/Instruccion";
import { Entorno } from "../Simbolo/Entorno";
import { errores } from "../Errores/Errores";

export class Statement extends Instruccion{

    constructor(private sentencias : Array<Instruccion>, line : number, column : number){
        super(line, column);
    }

    public ejecutar(env : Entorno) {
        const nuevoEntorno = new Entorno(env);
        for(const instr of this.sentencias){
            try {
                const elemento = instr.ejecutar(nuevoEntorno);
                if(elemento != undefined || elemento != null)
                    return elemento;                
            } catch (error) {
                errores.push(error);
            }
        }
    }
}