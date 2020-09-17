import { Identifiers } from '@angular/compiler';
import { Simbolo } from '../Simbolo/Simbolo';

export class Type_{

    public atributos:Map<string, Simbolo>;

    constructor(atributos:Map<string,Simbolo>){
        this.atributos=atributos;
    }

    public getAtributo(idAtributo:string):Simbolo{
        return this.atributos.get(idAtributo);
    }
    public setAtributo(idAtributo, atributo:Simbolo){
        this.atributos.set(idAtributo, atributo);
    }
    
}
