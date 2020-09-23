import { Instruccion } from '../Abstracto/Instruccion';
import { cuadro_texto } from '../Abstracto/Retorno';
import { Entorno } from '../Simbolo/Entorno';
import { Simbolo } from '../Simbolo/Simbolo';

export class GraficarTs extends Instruccion {
    private tiposString:string[]=['NUMBER','STRING', 'BOOL','NULL', 'ARRAY', 'VOID','TYPE'];
    public ejecutar(entorno: Entorno) {
        cuadro_texto.salida=cuadro_texto.salida + '**************************************************TABLA DE SIMBOLOS***************************************************';
        cuadro_texto.salida = cuadro_texto.salida + '\nINDICE\t\t|NOMBRE\t\t\t\t\t\t\t|TIPO DE SIMBOLO\t\t\t|TIPO\t\t\t\t|VALOR\t\t\t\n';
        cuadro_texto.salida=cuadro_texto.salida + '----------------------------------------------------------------------------------------------------------------------';
        let entornoPivote = entorno;
        while (entornoPivote != null) {
            let i = 1;
            for (const elemento of entornoPivote.variables) {
                let varActual:Simbolo = elemento[1];
                console.log(varActual);
                cuadro_texto.salida = cuadro_texto.salida+'\n'+i+'\t\t\t|'+ varActual.id+ '\t\t\t\t\t\t\t|'+varActual.tipoSimbolo+'\t\t\t\t\t\t|'+
                                    this.tiposString[varActual.tipo]+'\t\t\t\t|'+varActual.valor;
                i++;
            }
            cuadro_texto.salida=cuadro_texto.salida + '\n----------------------------------------------------------------------------------------------------------------------';
            entornoPivote = entornoPivote.anterior;
        }
        cuadro_texto.salida=cuadro_texto.salida + '\n********************************************************FIN***********************************************************\n';
    }
    //TODO preguntar si tambien se tienen que imprimir los tipos declarados con ts.
}