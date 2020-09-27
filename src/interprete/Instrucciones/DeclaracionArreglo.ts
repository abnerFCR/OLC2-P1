import { Instruccion } from '../Abstracto/Instruccion';
import { Entorno } from '../Simbolo/Entorno';
import { Tipo } from '../Abstracto/Retorno';
import { Simbolo } from '../Simbolo/Simbolo';
import { Arreglo } from '../Objetos/Arreglo';
import { Error_ } from '../Errores/Error';
import { AsignacionArreglo } from './AsignacionArreglo';


export class DeclaracionArreglo extends Instruccion {

    private arreglo: Simbolo;
    private valores: Array<any> = new Array();

    constructor(arreglo: Simbolo, valores: Array<any>, linea: number, columna: number) {
        super(linea, columna);
        this.arreglo = arreglo;
        this.valores = valores;
    }

    public ejecutar(entorno: Entorno) {
        //console.table(this.valores);
        
        //TODO validaciones para que la estructura del arreglo coincida con la estructura de los valores. 
        //la estructura de los valores se almacenan en la variable respuesta. 
        console.log(this.valores);
        if(this.valores.length > 0){
            let asignacion = new AsignacionArreglo(this.arreglo,this.valores,this.linea,this.columna);
            let respuesta = asignacion.ejecutar(entorno);
            entorno.guardar(this.arreglo.id,respuesta,this.arreglo.tipo,this.arreglo.tipoSimbolo, this.arreglo.idTipo, this.linea,this.columna);
            console.log(entorno);
            return;
        }
        entorno.guardar(this.arreglo.id,this.arreglo.valor,this.arreglo.tipo,this.arreglo.tipoSimbolo, this.arreglo.idTipo, this.linea,this.columna);
        console.log(entorno);

    }
}




