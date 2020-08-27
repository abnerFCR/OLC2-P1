import { Component } from '@angular/core';
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
  entrada = "mula mundo ";
  salida = "";
  options: any = {
    lineNumbers: true,
    theme:'dracula',
    //theme :'mbo',
    lineWrapping : true,
    indentWithTabs: true,
    mode: 'javascript',

    styleActiveLine: true
    //extraKeys: {"Ctrl-Space": "autocomplete"}
  };

  

  

  ejecutar(){
    try {
      //const value = Parser.parse(this.entrada);
      //this.salida = value + '';  
    } catch (error) {
      //alert("Aun no valido errores");

    }
  }
}



