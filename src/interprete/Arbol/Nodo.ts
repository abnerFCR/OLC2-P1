export class Nodo{

    etiqueta:string;
    hijos:Array<Nodo>;
    valor:string;
    idNodo:number;

    constructor(etiqueta:string, idNodo:number){
        this.etiqueta= etiqueta;
        this.hijos = new Array<Nodo>();
        this.idNodo = idNodo;
        this.valor = '';
    }


    add(hijo:Nodo){
        this.hijos.push(hijo);
    }

    setValor(valor:string){
        this.valor = valor;
    }


}