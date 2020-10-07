import { Component, OnInit } from '@angular/core';
import { cuadro_texto } from 'src/interprete/Abstracto/Retorno';
import { Error_ } from 'src/interprete/Errores/Error';
import { Entorno } from 'src/interprete/Simbolo/Entorno';
import { Simbolo } from 'src/interprete/Simbolo/Simbolo';
import { errores } from '../../../interprete/Errores/Errores';
import { graphviz } from 'd3-graphviz';
import { wasmFolder } from "@hpcc-js/wasm";
import { Nodo } from 'src/interprete/Arbol/Nodo';
import { Dot } from 'src/interprete/Arbol/Dot';
import { parser2 } from '../../../interprete/Grammar/Grammar2.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  errores2: Array<Error_> = errores;
  simbolos = new Array();
  grafico: any;
  private tiposString: string[] = ['NUMBER', 'STRING', 'BOOLEAN', 'NULL', 'ARRAY', 'VOID', 'TYPE'];
  constructor(private router:Router) {
    this.simbolos = cuadro_texto.simbolos;
    //console.table(this.simbolos);
    //console.log("Se termino tambien");
  }

  ngOnInit(): void {
    let dot: Dot = new Dot();
    if (cuadro_texto.entrada == "") {
      alert("Los reportes requieren haber ejecutado o traducido la cadena de entrada.");
      this.router.navigate(['/']);
    } else {
      const ast = parser2.parse(cuadro_texto.entrada);
      //console.log(ast);
      wasmFolder('https://cdn.jsdelivr.net/npm/@hpcc-js/wasm@0.3.13/dist');
      graphviz('#graph').renderDot(dot.codigoAST(ast));
    }
    console.log("Se termino");

  }

  getTipoString() {

  }
}
