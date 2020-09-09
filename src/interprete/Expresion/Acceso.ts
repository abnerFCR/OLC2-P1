import { Expresion } from "../Abstracto/Expresion";
import { Entorno } from "../Simbolo/Entorno";
import { Retorno } from "../Abstracto/Retorno";
import { Error_ } from '../Errores/Error';

export class Acceso extends Expresion{

    constructor(private id: string, linea : number, columna: number){
        super(linea, columna);
    }

    public ejecutar(entorno: Entorno): Retorno {
        const valor = entorno.getVar(this.id);
        if(valor == null)
            throw new Error_(this.linea, this.columna, 'Semantico', 'La variable indicada no existe');
        return {valor : valor.valor, tipo : valor.tipo};
    }
}