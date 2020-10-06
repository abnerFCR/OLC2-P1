import { Nodo } from "./Nodo";

export class Dot {

    contador: number;
    grafo: string;

    constructor() {
        this.contador = 0;
        this.grafo = '';
    }

    codigoAST(raiz: Nodo): string {

        this.grafo = "digraph G{\n";
        this.grafo += "node[shape =\"hexagon\"]; \n";
        this.contador = 1;
        this.grafo += this.recorrerAST(raiz);
        this.grafo += "\n}";
        console.log(this.grafo);
        return this.grafo;
    }

    limpiar(cadena: string): string {
        if (cadena != undefined && cadena != null) {
            cadena = cadena.replace('\\', '\\\\');
            cadena = cadena.replace('\'', '');
            cadena = cadena.replace('\"', '');
            cadena = cadena.replace('\"', '');
            cadena = cadena.replace('\n', '\\n');
        }
        return cadena;
    }

    recorrerAST(raiz: Nodo) {

        let cuerpoRecorridoArbol: string = "";
        this.contador++;
        var padre: string = "nodo" + this.contador;

        if (raiz.valor != null || raiz.valor != undefined) {

            cuerpoRecorridoArbol += padre + "[label = \"" + this.limpiar(raiz.etiqueta) + "\\n" + raiz.valor + "\"];\n";
        }
        else {
            cuerpoRecorridoArbol += padre + "[label = \"" + this.limpiar(raiz.etiqueta) + "\"];";
        }
        if (raiz.hijos == null || raiz.hijos == undefined) {
            return cuerpoRecorridoArbol;
        }
        //for(let nodo of raiz.hijos){
        for (let i = 0; i < raiz.hijos.length; i++) {
            cuerpoRecorridoArbol += padre + " -> nodo" + (this.contador + 1) + ";\n";
            cuerpoRecorridoArbol += this.recorrerAST(raiz.hijos[i]);
        }
        return cuerpoRecorridoArbol;
    }
}