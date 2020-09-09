export class Error_{
    
    constructor(public linea : number, public columna: number, public tipo : string, public mensaje : string){

    }

    
    public getLinea() : number {
        return this.linea;
    }
    public setLinea(linea : number) {
        this.linea = linea;
    }
    public getColumna() : number {
        return this.columna;
    }
    public setColumna(columna : number) {
        this.columna = columna;
    }
    
    
}