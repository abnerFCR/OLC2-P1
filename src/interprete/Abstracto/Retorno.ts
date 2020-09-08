export enum Tipo{

    NUMBER = 0,
    STRING = 1,
    BOOLEAN = 2,
    NULL = 3,
    ARRAY = 4,
    VOID = 5

}

export type Retorno ={
    valor : any,
    tipo : Tipo
}

export class cuadro_texto{

    public static salida:string ="";
    public static errores_sintacticos_lexicos:string ="";
}