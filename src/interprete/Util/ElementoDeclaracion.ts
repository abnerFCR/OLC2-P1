import { Expresion } from '../Abstracto/Expresion';

export class ElementoDeclaracion{
    public id: string;
    public tipo: number;
    public valor: any;
    public tipoDeclaracion: number;
    public idTipo:string;

    constructor(tipoDeclaracion:number, nombre:string, tipo:number, idTipo:string, valor:any){
        this.id=nombre;
        this.tipo=tipo;
        this.valor=valor;
        this.tipoDeclaracion=tipoDeclaracion;
        this.idTipo=idTipo;
    }

}

export enum TipoDeclaracion{
    ID=0,
    ID_VALOR = 1,
    ID_TIPO = 2,
    ID_TIPO_VALOR = 3

}