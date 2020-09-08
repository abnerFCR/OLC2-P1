import { Expresion } from '../Abstracto/Expresion';

export class ElementoDeclaracion{
    private id: string;
    private tipo: number;
    private valor: Expresion;
    private tipoDeclaracion: number;

    constructor(tipoDeclaracion:number, nombre:string, tipo:number, valor:Expresion){
        this.id=nombre;
        this.tipo=tipo;
        this.valor=valor;
        this.tipoDeclaracion=tipoDeclaracion;
    }

}

export enum TipoDeclaracion{
    ID=0,
    ID_VALOR = 1,
    ID_TIPO = 2,
    ID_TIPO_VALOR = 3

}