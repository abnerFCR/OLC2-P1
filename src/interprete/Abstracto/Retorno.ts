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