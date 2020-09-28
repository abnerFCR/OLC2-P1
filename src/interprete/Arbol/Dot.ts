import { Nodo } from "./Nodo";
//import {digraph, INode} from 'ts-graphviz';
import {Graph, digraph, Node} from 'd3-graphviz';

export class Dot{

    contador:number;
    grafo:string;

    constructor(){
        this.contador = 0;
        this.grafo = '';
    }


    codigoAST(raiz:Nodo){

        //this.grafo = "digraph G{";
        //this.grafo += "node[shape =\"hexagon\"]; \n";
        var arbol = digraph('G');
        //this.grafo += "nodo0[label=\"" + this.limpiar(raiz.etiqueta) + "\"];\n";
        
        let nodo0 = arbol.addNode('nodo0', {'label':raiz.etiqueta });
        this.contador = 1;
        
        this.recorrerAST(arbol, nodo0, raiz);
        console.log(arbol.to_dot());
        arbol.output( "png", "AST.png" );
    
    }

    limpiar(cadena:string):string{
        cadena = cadena.replace('\\', '\\\\');
        cadena = cadena.replace('\"', '');
        cadena = cadena.replace('\n', '\\n');
        return cadena;
    }

    recorrerAST(arbol:Graph, padre:Node, hijo:Nodo){
        hijo.hijos.forEach(element => {
            //let nombre_hijo = 'nodo' + this.contador;
            //this.grafo += nombre_hijo + '[label=\"' + this.limpiar(element.etiqueta) + '\"];\n';
            let nodo_hijo = arbol.addNode('nodo' + this.contador, {'label': this.limpiar(element.etiqueta)});
            //this.grafo += padre + "->" + nombre_hijo + ";\n";
            arbol.addEdge(padre, nodo_hijo);
            this.contador++;
            this.recorrerAST(arbol, nodo_hijo, element);
        });
    }






}