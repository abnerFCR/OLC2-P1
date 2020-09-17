import { Tipo } from "../Abstracto/Retorno";

export class Simbolo{
    public valor :any;
    public id : string;
    public tipo : Tipo;
    public tipoSimbolo:string; //para ver si es constante o variable
    public idTipo:string;
    
    //TODO agregar al constructor el idDelTipo 
    constructor(valor: any, id: string, tipo: Tipo,tipoSimbolo:string, idTipo:string){
        this.valor = valor;
        this.id = id;
        this.tipo = tipo;
        this.tipoSimbolo= tipoSimbolo;
        this.idTipo=idTipo;
    }

    public getValor() : any {
        return this.valor;
    }
    public setValor(valor :any) {
        this.valor = valor;
    }
    public getId() : string {
        return this.id;
    }
    public setId(id :string) {
        this.id = id;
    }
    public getTipo() : number {
        return this.tipo;
    }
    public setTipo(tipo :number) {
        this.tipo = tipo;
    }
    public getTipoSimbolo() : string {
        return this.tipoSimbolo;
    }
    public setTipoSimbolo(tipoSimbolo :string) {
        this.tipoSimbolo = tipoSimbolo;
    }
}