import { Tipo } from "../Abstracto/Retorno";

export class Simbolo{
    public valor :any;
    public id : string;
    public tipo : Tipo;
    public tipoSimbolo:string;

    constructor(valor: any, id: string, tipo: Tipo,tipoSimbolo:string){
        this.valor = valor;
        this.id = id;
        this.tipo = tipo;
        this.tipoSimbolo= tipoSimbolo;
    }
}