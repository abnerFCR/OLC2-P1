import { Component, OnInit } from '@angular/core';
import { cuadro_texto } from 'src/interprete/Abstracto/Retorno';
import { Error_ } from 'src/interprete/Errores/Error';
import { Entorno } from 'src/interprete/Simbolo/Entorno';
import { Simbolo } from 'src/interprete/Simbolo/Simbolo';
import {errores } from '../../../interprete/Errores/Errores';
import {graphviz} from 'd3-graphviz';
import { wasmFolder } from "@hpcc-js/wasm";

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  errores2 : Array<Error_> = errores;
  simbolos = new Array();
  grafico:any;
  private tiposString:string[]=['NUMBER','STRING', 'BOOLEAN','NULL', 'ARRAY', 'VOID','TYPE'];
  constructor() { 
    this.simbolos = cuadro_texto.simbolos;
    console.table(this.simbolos);
    

  }

  ngOnInit(): void {
    
    
  }

  getTipoString(){

  }
}
