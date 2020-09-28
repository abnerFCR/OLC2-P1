import { Statement } from '@angular/compiler';
import { Expresion } from '../Abstracto/Expresion';
import { Instruccion } from '../Abstracto/Instruccion';
import { Tipo } from '../Abstracto/Retorno';
import { Error_ } from '../Errores/Error';
import { errores } from '../Errores/Errores';
import { Entorno } from '../Simbolo/Entorno';
import { Break } from './Break';
import { Continue } from './Continue';
import { Return } from './Return';

export class For extends Instruccion {

    private declaAsigna: Instruccion;
    private condicion: Expresion;
    private asignacion: Instruccion;
    private instrucciones: Instruccion;

    constructor(declaAsigna: Instruccion, condicion: Expresion, asignacion: Expresion, instrucciones: Instruccion, linea: number, columna: number) {
        super(linea, columna);
        this.declaAsigna = declaAsigna;
        this.condicion = condicion;
        this.asignacion = asignacion;
        this.instrucciones = instrucciones;
    }

    public ejecutar(entorno: Entorno) {
        entorno.setBanderaCiclo(true);
        let nuevoEntorno:Entorno = new Entorno(entorno);
        this.declaAsigna.ejecutar(nuevoEntorno);
        let resCondicion = this.condicion.ejecutar(nuevoEntorno);

        if (resCondicion.tipo != Tipo.BOOLEAN) {
            throw new Error_(this.linea, this.columna, 'Semantico', 'Error en el For: La condicion debe ser booleana.');
        }

        while (resCondicion.valor == true) {
            try {
                let resultado =  this.instrucciones.ejecutar(nuevoEntorno);
                if(resultado instanceof Break){
                    //entorno.setBanderaCiclo(false);
                    break;
                }
                this.asignacion.ejecutar(nuevoEntorno);
                
                if(resultado instanceof Continue){
                    //entorno.setBanderaCiclo(false);
                    //continue;
                } 
                if(resultado instanceof Return){
                    entorno.setBanderaCiclo(false);
                    return resultado;
                }
            } catch (error) {
                errores.push(error);
            }
            resCondicion = this.condicion.ejecutar(nuevoEntorno);

            if (resCondicion.tipo != Tipo.BOOLEAN) {
                throw new Error_(this.linea, this.columna, 'Semantico', 'Error en el for: La condicion debe ser booleana.');
            }
        }
        entorno.setBanderaCiclo(false);
    }

}