import { Instruccion } from '../Abstracto/Instruccion';
import { Entorno } from '../Simbolo/Entorno';
import { Expresion } from '../Abstracto/Expresion';
import { Caso } from '../Util/Caso';
import { Break } from './Break';
import { Continue } from './Continue';

export class Switch extends Instruccion {

    private valor: Expresion;
    private listaCasos: Array<Caso>;

    constructor(valor: Expresion, listaCasos: Array<Caso>, linea: number, columna: number) {
        super(linea, columna);
        this.valor = valor;
        this.listaCasos = listaCasos;
    }
    //TODO el switch ejecuta cada caso por separado, no importa sino tiene break solo ejecutara las instrucciones de ese caso.
    public ejecutar(entorno: Entorno) {
        //entorno.setBanderaCiclo(true);
        entorno.setBanderaSwitch(true);

        const nuevoEntorno = new Entorno(entorno);
        const valorOp = this.valor.ejecutar(nuevoEntorno);

        let banderaEncontrado = false;
        for (let i = 0; i < this.listaCasos.length; i++) {
            let caso = this.listaCasos[i];

            let valorCaso = caso.getValor(nuevoEntorno);
            let respuesta;
            if (!banderaEncontrado) {
                if (valorCaso == null || (valorCaso.valor == valorOp.valor && valorCaso.tipo == valorOp.tipo)) {
                    respuesta = caso.ejecutar(nuevoEntorno);
                    if (respuesta instanceof Break) {
                        //entorno.setBanderaSwitch(false);
                        break;
                    }
                    if (respuesta instanceof Continue) {
                        entorno.setBanderaSwitch(false);
                        return respuesta;
                    } 
                    banderaEncontrado = true;
                }
            } else {
                respuesta = caso.ejecutar(nuevoEntorno);
                if (respuesta instanceof Break) {
                    //entorno.setBanderaSwitch(false);
                    break;
                }
            }
        }
        //entorno.setBanderaCiclo(false);
        entorno.setBanderaSwitch(false);
    }
}