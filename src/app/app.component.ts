import { Component } from '@angular/core';
import { parser } from '../interprete/Grammar/Grammar.js';
import { Entorno } from '../interprete/Simbolo/Entorno';
//import { Imprimir } from '../interprete/Instrucciones/Imprimir';
import { cuadro_texto } from "../interprete/Abstracto/Retorno";
import { errores } from '../interprete/Errores/Errores';

import "codemirror/lib/codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import { Error_ } from 'src/interprete/Errores/Error.js';


 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'interprete-web';
  entrada = "";
  //public static salida: string = "";
  traduccion = "";
  consola_salida = ""


  options_entrada: any = {
    lineNumbers: true,
    theme: 'dracula',
    lineWrapping: true,
    indentWithTabs: true,
    mode: 'javascript',
    styleActiveLine: true
  };
  options_salida: any = {
    lineNumbers: true,
    theme: 'mbo',
    lineWrapping: true,
    indentWithTabs: true,
    mode: 'javascript',
    styleActiveLine: true
  };
  options_consola: any = {
    lineNumbers: true,
    theme: 'abcdef',
    lineWrapping: true,
    indentWithTabs: true,
    mode: '',
    styleActiveLine: true
  };

  public ejecutar() {

    errores.length = 0;
    const env = new Entorno(null);
    this.consola_salida = "";
    cuadro_texto.salida = "";
    const ast = parser.parse(this.entrada.toString());

    for (const instr of ast) {
      try {
        instr.ejecutar(env);
      } catch (error) {
        //cuadro_texto.salida = cuadro_texto.salida + error.mensaje.toString() + '.  Fila: ' + error.linea + ', Columna: ' + error.columna + '\n';
        //let nuevoError=new Error_(1,1,"sintactico", "hola");
        errores.push(error);
      }
    }
    
    //this.consola_salida = cuadro_texto.errores_sintacticos_lexicos + cuadro_texto.salida;
    for (const err of errores) {
      this.consola_salida = this.consola_salida + "-----------------------**** ERROR ****-----------------------------------------\n";
      this.consola_salida = this.consola_salida + '[X]   ->   ' + err.mensaje + '.  Fila: ' + err.linea + ', Columna: ' + err.columna + '\n';
      this.consola_salida = this.consola_salida + "-------------------------------------------------------------------------------\n";
    }
    this.consola_salida = this.consola_salida + cuadro_texto.salida;
  }
  
}




