import { Instruccion } from "../Abstracto/Instruccion";
import { cuadro_texto } from "../Abstracto/Retorno";
import { Expresion } from "../Abstracto/Expresion";
import { Entorno } from "../Simbolo/Entorno";

//import{ AppComponent } from '../../app/app.component';

export class Imprimir extends Instruccion{

    constructor(private valor : Expresion, linea : number, columna : number){
        super(linea, columna);
    }

    public ejecutar(entorno : Entorno) {
        const valor = this.valor.ejecutar(entorno);
        cuadro_texto.salida=cuadro_texto.salida+valor.valor+'\n';
        //cuadro_texto.salida=cuadro_texto.salida+valor.valor;
        //console.log(entorno);
        return valor;
    }
}





