import { Statement } from '@angular/compiler';
import { Expresion } from '../Abstracto/Expresion';
import { Instruccion } from '../Abstracto/Instruccion';
import { Tipo } from '../Abstracto/Retorno';
import { Error_ } from '../Errores/Error';
import { errores } from '../Errores/Errores';
import { Arreglo } from '../Objetos/Arreglo';
import { Entorno } from '../Simbolo/Entorno';
import { Break } from './Break';
import { Continue } from './Continue';
import { Return } from './Return';

export class ForOf extends Instruccion {

    private id:string;
    private expresion: Expresion;
    private instrucciones: Instruccion;

    constructor(id: string, expresion: Expresion, instrucciones: Instruccion, linea: number, columna: number) {
        super(linea, columna);
        this.id = id;
        this.expresion = expresion;
        this.instrucciones = instrucciones;
    }

    public ejecutar(entorno: Entorno) {
        entorno.setBanderaCiclo(true);
        let nuevoEntorno: Entorno = new Entorno(entorno);

        let arreglo = this.expresion.ejecutar(entorno);
        console.log(arreglo);
        if(arreglo.valor instanceof Arreglo){

        }else{
            throw new Error_(this.linea, this.columna,"Semantico", "For Of requiere un objeto iterador para poder funcionar");
        }
        nuevoEntorno.guardar(this.id,arreglo.valor.getElemento(0),arreglo.valor.getElemento(0).tipo,'let','',this.linea,this.columna);
        for (let i=0; i< arreglo.valor.getLength(); i++) {
            let pivote = arreglo.valor.getElemento(i);
            nuevoEntorno.updateVar(this.id,pivote.valor,pivote.tipo,'',this.linea,this.columna);
            try {
                let resultado = this.instrucciones.ejecutar(nuevoEntorno);
                if (resultado instanceof Break) {
                    //entorno.setBanderaCiclo(false);
                    break;
                }
                if (resultado instanceof Continue) {
                    //entorno.setBanderaCiclo(false);
                    //continue;
                }
                if (resultado instanceof Return) {
                    entorno.setBanderaCiclo(false);
                    return resultado;
                }
            } catch (error) {
                errores.push(error);
            }
        }
        entorno.setBanderaCiclo(false);
    }
}