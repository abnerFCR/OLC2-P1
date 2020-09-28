import { Simbolo } from "./Simbolo";
import { cuadro_texto, Tipo } from "../Abstracto/Retorno";
import { Error_ } from '../Errores/Error';
import { errores } from '../Errores/Errores';
import { Type_ } from '../Objetos/Type_';
import { Funcion } from '../Instrucciones/Funcion';

export class Entorno {

    public variables: Map<string, Simbolo>;
    
    private types: Map<string, Type_>;

    public funciones:Map<string,Funcion>;

    public banderaCiclo:boolean[]=new Array();
    public banderaSwitch:boolean[]=new Array();
    public banderaFuncion:boolean;

    constructor(public anterior: Entorno | null) {
        this.variables = new Map();
        this.types = new Map();
        this.funciones = new Map();
    }

    //TODO NOTIFICAR ERROR EN FORMA QUE SE INSERTA EN EL AMBITO
    public guardar(id: string, valor: any, tipo: Tipo, tipoSimbolo:any, idTipo:string, fila:number, columna:number) {
        let entorno: Entorno | null = this;
        if (!entorno.variables.has(id)  &&  !entorno.types.has(id)) {
            entorno.variables.set(id, new Simbolo(valor, id, tipo, tipoSimbolo,idTipo));
            cuadro_texto.simbolos.push([entorno.getVar(id),fila,columna]);
            return;
        }
        throw new Error_(fila, columna, "Semantico", "Ya existe una variable con el mismo nombre en ese ambito");
        //errores.push(nuevoError);
    }

    public guardarTipo(idTipo: string, valor: any, fila, columna) {
        let entorno: Entorno | null = this;
        if (!entorno.types.has(idTipo) &&   !entorno.variables.has(idTipo)) {
            entorno.types.set(idTipo, valor);
            return;
        }
        throw new Error_(fila, columna, "Semantico", "Ya existe un tipo con el mismo nombre en ese ambito");
        //errores.push(nuevoError);
    }

    public guardarFunciones(nombre:string, funcion:Funcion, fila:number, columna:number){
        let entorno:Entorno|null =this;
        if(!entorno.funciones.has(nombre)){
            entorno.funciones.set(nombre, funcion);
            return;
        }
        throw new Error_(fila, columna, "Semantico", "Ya existe un nombre que hace referencia a esa funcion.");
    }

    public getVar(id: string): Simbolo | undefined | null {
        let entorno: Entorno | null = this;
        while (entorno != null) {
            if (entorno.variables.has(id)) {
                return entorno.variables.get(id);
            }
            entorno = entorno.anterior;
        }
        //let nuevoError= new Error_(1,2,"Semantico", "No existe la variable en este ambito");
        //errores.push(nuevoError);
        return null;
    }

    public getType(id:string){
        let entorno:Entorno | null =this;
        while(entorno!=null){
            if(entorno.types.has(id)){
                let retorno = entorno.types.get(id);
                return retorno;
            }
            entorno=entorno.anterior;
        }
        return null;
    }

    public getFuncion(id:string, fila, columna){
        let entorno:Entorno|null = this;
        while(entorno != null){
            if(entorno.funciones.has(id)){
                return entorno.funciones.get(id);
            }
            entorno = entorno.anterior;
        }
        throw new Error_(fila, columna, "Semantico", "La funcion indicada no existe: "+id);
    }
    public getGlobal(){
        let entorno:Entorno|null =this;
        while(entorno.anterior !=null){
            entorno = entorno.anterior;
        }
        return entorno;
    }

    public updateVar(id: string, valor: any, tipo: Tipo,idTipo:string, fila:number, columna:number): any {
        let entorno: Entorno | null = this;
        while (entorno != null) {
            if (entorno.variables.has(id)) {
                let simboloActual: Simbolo = entorno.variables.get(id);
                if (simboloActual.tipoSimbolo == 'let') {
                    if (simboloActual.tipo == tipo || simboloActual.tipo == Tipo.NULL) {
                        entorno.variables.set(id, new Simbolo(valor, id, tipo, simboloActual.tipoSimbolo, idTipo));
                        return;
                    } else {
                        return new Error_(fila, columna, "Semantico", "No se puede asignar un tipo " + tipo + " en un tipo " + simboloActual.tipo);
                    }
                } else {
                    return new Error_(fila, columna, "Semantico", "No se puede modificar una constante");
                }
            }
            entorno = entorno.anterior;
        }
        return new Error_(fila, columna, "Semantico", "Ya existe una variable con el mismo nombre en ese ambito");
    }

    public deleteVar(id:string, fila:number, columna:number){
        let entorno: Entorno | null = this;
        while(entorno != null){
            if(entorno.variables.has(id)){
                let respuesta = entorno.variables.delete(id);
                if(!respuesta){
                    throw new Error_(fila, columna, "En tiempo de ejecucion", "No se pudo eliminar la variable solicitada");
                }
                return null;
            }
            entorno= entorno.anterior;
        }
        return new Error_(fila, columna, "Semantico", 'La variable solicitada no existe [dev].')
    }

    public getBanderaCiclo():boolean{
        let entorno:Entorno = this;
        while(entorno!=null){
            if(entorno.anterior == null){
                if(entorno.banderaCiclo.length == 0){
                    console.log("-------------------->"+entorno.banderaCiclo);
                    return false;
                }
                return true;
                //return entorno.banderaCiclo;
            }
            entorno = entorno.anterior;
        }
    }
    public setBanderaCiclo(banderaCiclo){
        let entorno:Entorno = this;
        while(entorno!=null){
            if(entorno.anterior == null){
                if(banderaCiclo){
                    entorno.banderaCiclo.push(banderaCiclo);
                    return;
                }
                entorno.banderaCiclo.pop();
                return;
                //entorno.banderaCiclo = banderaCiclo;
                //return;
            }
            entorno = entorno.anterior;
        }
    }

    public getBanderaSwitch():boolean{
        let entorno:Entorno = this;
        while(entorno!=null){
            if(entorno.anterior == null){
                if(entorno.banderaSwitch.length == 0){
                    return false;
                }
                return true;
            }
            entorno = entorno.anterior;
        }
    }
    public setBanderaSwitch(banderaSwitch){
        let entorno:Entorno = this;
        while(entorno!=null){
            if(entorno.anterior == null){
                if(banderaSwitch){
                    entorno.banderaSwitch.push(banderaSwitch);
                    return;
                }
                entorno.banderaSwitch.pop();
                return;
            }
            entorno = entorno.anterior;
        }
    }
}