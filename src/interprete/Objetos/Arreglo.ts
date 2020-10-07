import { Simbolo } from '../Simbolo/Simbolo';

export class Arreglo{
    public elementos:Array<Simbolo>=new Array();
    //el tipo es de la forma{tipo:number, idTipo:string};
    public tipo:any;
    public idTipo:number;

    constructor(elementos:Array<Simbolo>, tipo:any){
        this.elementos=elementos;
        this.tipo=tipo;
        this.idTipo=this.tipo.idTipo;
    }

    public push(elemento:Simbolo){
        this.elementos.push(elemento);
    }
    public pop():Simbolo{
        return this.elementos.pop();
    }
    public getLength(){
        return this.elementos.length;
    }
    public getElemento(id:number){
        return this.elementos[id];
    }
    public reemplazarElemento(elemento:Simbolo, id:number){
        this.elementos[id]=elemento;
    }
    public setElemento(elemento:Simbolo, posicion:number){
        this.elementos[posicion]=elemento;
    }
    public setAllElementos(elementos:Array<Simbolo>){
        this.elementos=elementos;
    }
}