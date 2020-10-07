import { Component } from '@angular/core';
import { parser } from '../interprete/Grammar/Grammar.js';
//import { parser2 } from '../interprete/Grammar/Grammar2.js';
import { Entorno } from '../interprete/Simbolo/Entorno';
import { cuadro_texto, prueba } from "../interprete/Abstracto/Retorno";
import { errores } from '../interprete/Errores/Errores';
import "codemirror/lib/codemirror";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import { Error_ } from 'src/interprete/Errores/Error.js';
import { Router } from '@angular/router';
import { Funcion } from 'src/interprete/Instrucciones/Funcion';
import { TranslationWidth } from '@angular/common';
import { DeclaracionType } from 'src/interprete/Instrucciones/DeclaracionType.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'interprete-web';
  entrada = prueba.prueba;
  traduccion = "";
  consola_salida = ""
  constructor(private router:Router){

  }
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
    cuadro_texto.entrada = this.entrada.toString();
    errores.length = 0;
    const env = new Entorno(null);
    this.consola_salida = "";
    cuadro_texto.salida = "";
    cuadro_texto.simbolos =[];
    const ast = parser.parse(this.entrada.toString());

    for(const instr of ast){
      try{
        if(instr instanceof Funcion){
          instr.ejecutar(env);
        }
      }catch{
        errores.push();
      }
    }
    console.log(env);

    for (const instr of ast) {
      try {
        if(instr instanceof Funcion){
          
        }else{
          instr.ejecutar(env);
        }
      } catch (error) {
        errores.push(error);
      }
    }
    console.log(env);
    this.imprimirErrores();
  
  }

  public traducir(){
    cuadro_texto.entrada = this.entrada.toString();
    errores.length = 0;
    const env = new Entorno(null);
    this.consola_salida = "";
    cuadro_texto.salida = "";
    cuadro_texto.simbolos =[];
    const ast = parser.parse(this.entrada.toString());
    
    for(const instr of ast){
      try{
        if(instr instanceof Funcion){
          instr.ejecutar(env);
        }else if(instr instanceof DeclaracionType){
          instr.ejecutar(env);
        }
      }catch{
        errores.push();
      }
    }
    console.log(env);

    for (const instr of ast) {
      try {
        if(instr instanceof Funcion){
          
        }else{
          instr.ejecutar(env);
        }
      } catch (error) {
        errores.push(error);
      }
    }
    console.log(env);
    this.traduccion = this.entrada;
    //this.imprimirErrores();

  }
  
  public imprimirErrores() {
    for (const err of errores) {
      this.consola_salida = this.consola_salida + "-----------------------**** ERROR ****-----------------------------------------\n";
      this.consola_salida = this.consola_salida + '[X]   ->   ' + err.mensaje + '.  Fila: ' + err.linea + ', Columna: ' + err.columna + '\n';
      this.consola_salida = this.consola_salida + "-------------------------------------------------------------------------------\n";
    }
    this.consola_salida = this.consola_salida + cuadro_texto.salida;
  }


  public reportes(){
    this.router.navigate(['/reportes']);
  }



}




