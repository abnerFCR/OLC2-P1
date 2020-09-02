import { Tipo } from "../Abstracto/Retorno";

export class Simbolo{
    public valor :any;
    public id : string;
    public tipo : Tipo;

    constructor(valor: any, id: string, tipo: Tipo){
        this.valor = valor;
        this.id = id;
        this.tipo = tipo;
    }
}