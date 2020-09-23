import { Instruccion } from "../Abstracto/Instruccion";
import { Entorno } from "../Simbolo/Entorno";
import { errores } from "../Errores/Errores";
import { Break } from './Break';
import { Continue } from './Continue';

export class Statement extends Instruccion {

    constructor(private sentencias: Array<Instruccion>, line: number, column: number) {
        super(line, column);
    }

    public ejecutar(env: Entorno) {
        const nuevoEntorno = new Entorno(env);
        for (const instr of this.sentencias) {
            try {
                const elemento = instr.ejecutar(nuevoEntorno);

                if (elemento instanceof Break) {
                    return elemento;
                }
                if (elemento instanceof Continue) {
                    return elemento;
                }

            } catch (error) {
                errores.push(error);
            }
        }
    }
}