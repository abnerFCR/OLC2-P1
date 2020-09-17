import { Simbolo } from '../Simbolo/Simbolo';

export class Arreglo{
    private elementos:Array<Simbolo>=new Array();
    //si es tipo number entonces es de los 3 tipos principales
    //si es tipo string entonces tipo type
    private tipo:any;

    constructor(elementos:Array<Simbolo>, tipo:number){
        this.elementos=elementos;
        this.tipo=tipo;
    }

    public push(elemento:Simbolo){
        this.elementos.push(elemento);
    }
    public pop(){
        this.elementos.pop();
    }
    public getLength(){
        return this.elementos.length;
    }
    public getElemento(id:number){
        return this.elementos[id];
    }
    public setElementos(elementos:Array<Simbolo>){
        this.elementos=elementos;
    }

}