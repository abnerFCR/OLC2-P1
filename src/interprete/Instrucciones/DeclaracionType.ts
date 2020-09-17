import { Instruccion } from '../Abstracto/Instruccion';
import { Entorno } from '../Simbolo/Entorno';
import { Type_ } from '../Objetos/Type_';
import { Simbolo } from '../Simbolo/Simbolo';
import { Tipo } from '../Abstracto/Retorno';

export class DeclaracionType extends Instruccion{
    
    private id:string;
    private atributos:any;
    
    constructor(id:string, atributos:any, linea:number, columna:number){
        super(linea, columna);
        this.id = id;
        this.atributos=atributos;
    }

    public ejecutar(entorno: Entorno) {
    
        let listaAtributos:Map<string, Simbolo> = new Map();   
        for(const decla of this.atributos){
            let idTipo='';
            if(decla.tipo ==Tipo.TYPE){
                idTipo = decla.idTipo;
            }
            listaAtributos.set(decla.id, new Simbolo(null, decla.id, decla.tipo, 'let',idTipo));
        }
        let nuevoTipo =new Type_(listaAtributos);
        entorno.guardarTipo(this.id, nuevoTipo, this.linea, this.columna);
        //console.log(entorno);
    }
}