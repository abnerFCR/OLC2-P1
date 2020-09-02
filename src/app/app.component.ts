import { Component } from '@angular/core';
import { parser } from '../interprete/Grammar/Grammar.js';
import {Entorno} from '../interprete/Simbolo/Entorno';
import {Imprimir} from '../interprete/Instrucciones/Imprimir';

import{ errores } from '../interprete/Errores/Errores';


import "codemirror/lib/codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'interprete-web';
  entrada = "console.log()";
  salida = "";
  traduccion="";
  options_entrada: any = {
    lineNumbers: true,
    theme:'dracula',
    lineWrapping : true,
    indentWithTabs: true,
    mode: 'javascript',
    styleActiveLine: true
  };
  options_salida: any = {
    lineNumbers: true,
    theme :'mbo',
    lineWrapping : true,
    indentWithTabs: true,
    mode: 'javascript',
    styleActiveLine: true
  };
  options_consola: any = {
    lineNumbers: true,
    theme:'abcdef',
    lineWrapping : true,
    indentWithTabs: true,
    mode: '',
    styleActiveLine: true
  };

  public ejecutar(){
      const ast = parser.parse(this.entrada.toString());
      const env = new Entorno(null);
      this.salida="";
      errores.length=0;
    for(const instr of ast){
        try {  

          if(instr instanceof Imprimir){
            this.salida=this.salida+instr.ejecutar(env).valor+'\n';
          }else{
            instr.ejecutar(env);
          }
          
        } catch (error) {
          this.salida=this.salida+error.mensaje.toString()+'.  Fila: '+error.linea+', Columna: '+error.columna+'\n';
          errores.push(error);  
        }
    }

/*
    for(const err of errores){
      this.salida=this.salida+err.mensaje.toString()+'.  Fila: '+err.linea+', Columna: '+err.columna+'\n';
    }
    */
  }



}




