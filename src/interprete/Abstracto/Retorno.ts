import { Simbolo } from '../Simbolo/Simbolo';

export enum Tipo{

    NUMBER = 0,
    STRING = 1,
    BOOLEAN = 2,
    NULL = 3,
    ARRAY = 4,
    VOID = 5,
    TYPE = 6,
    BREAK = 7,
    CONTINUE = 8,
    RETURN =9,
    

}
export type Retorno ={
    valor : any,
    tipo : Tipo
}

export class cuadro_texto{

    public static salida:string ="";
    public static errores_sintacticos_lexicos:string ="";
    public static simbolos = new Array();
    public static entrada:string="";
    public static traducir:string = "";
}

export class prueba{
    public static prueba:string =``+
    
    //otro comentario
`console.log(true || true);\n`+
`console.log(true || false);\n`+
`console.log(false || true);\n`+
`console.log("------------------");\n`+
`console.log(false || false);\n`+
`console.log(!(true && true));\n`+
`console.log(!(true && false));\n`+
`console.log(!(false && true));\n`+
`console.log(!(false && false));\n`+
`console.log("------------------");\n`+
`console.log("hola" > "hola");\n`+
`/*\n`+
`comentario multilineas\n`+
`*/\n`+
`\n`+
`let primera=4;\n`+
`if(9 > 3){\n`+
`   let hola2;\n`+
`	console.log("hola mundo, soy mayor que 3");\n`+
`}else if(8 > 9){\n`+
`	//comentario de una linea\n`+
`	console.log("adios, estoy mal");\n`+
`}else{\n`+
`	console.log("soy el ultimo");\n`+
` \n`+
`	//comentario de una linea 2\n`+
`}\n`+
`\n`+
`if(true){\n`+
`	let hola=5;\n`+
`}\n`+
`//console.log(hola);\n`+
`\n`+
`let tercera;\n`+
`tercera=5;\n`+
`\n`+
`if(tercera > 2){\n`+
`	tercera=3;\n`+
`}else{\n`+
`	tercera=10;\n`+
`}\n`+
`console.log(tercera);\n`+
`\n`+
`let conta=1;\n`+
`\n`+
`while(conta < 10){\n`+
`	console.log("contador: "+conta);\n`+
`  	conta=conta+1;\n`+
`}\n`+
`\n`+
`let contador=1;\n`+
`\n`+
`while(contador < 10){\n`+
`	console.log("Contador: "+contador);\n`+
`	contador=contador+1;\n`+
`}\n`+
`console.log(contador);\n`+
`\n`+
`let hola1=8;\n`+
`\nconsole.log("-----------SWITCH-------------");\n`+
`switch(hola1){\n`+
`  case 1:{\n`+
`  	console.log("soy uno");\n`+
`  }\n`+
`  case 2:\n`+
`	console.log("soy 2");\n`+
`  case 3: \n`+
`	console.log("soy 3");\n`+
`	let it = 1;\n`+
`   while(it<5){\n`+
`    console.log("soy el it: "+it);\n`+
`    it++;\n`+
`   }\n`+
`   break;\n`+
`  case 5: \n`+
`	console.log("soy 5");\n`+
`	default: \n`+
`	console.log("soy default");\n`+
`\n`+
`}\nconsole.log("-----------SWITCH-------------");\n`+
`/***************************************************************/\n`+
`\n`+
`let esDia:boolean=true;\n`+
`let saludo:string ="Buenos Dias";\n`+
`let hora:number = 5.5;\n`+
`graficar_ts();\n`+
`while(esDia){\n`+
`  let otra:string;\n`+
`  //graficar_ts();\n`+
`    hora = hora + 0.5;\n`+
`    if(hora >= 12){\n`+
`        esDia = !esDia;\n`+
`    }else{\n`+
`        console.log(saludo+"! Fercho"+ hora);\n`+
`    }\n`+
`}\n`+
`//graficar_ts();\n`+
`do{\n`+
`    hora = hora +0.5;\n`+
`    switch(hora){\n`+
`        case 13:\n`+
`            console.log("Es la una: " + hora);\n`+
`\n`+
`        case 17:\n`+
`            console.log("Son las 5: " + hora);\n`+
`\n`+
`        default:{\n`+
`            console.log("La hora es: "+hora);\n`+
`\n`+
`        }\n`+
`    }\n`+
`}while(hora <= 18);\n`+
`\n`+
`type hola={\n`+
`	primer:string,\n`+
`    segundo:number,\n`+
`  	tercero:boolean,\n`+
`  	cuarto:hola\n`+
`};\n`+
`\n`+
`type adios={\n`+
`	primer:string,\n`+
`    segundo:number,\n`+
`  	tercero:boolean,\n`+
`  	cuarto:hola\n`+
`};\n`+
`\n`+
`let primeraHola:hola ={\n`+
`	primer:"ciencuenta"\n`+
`}; \n`+
`graficar_ts();\n`+
`let it2=5;\n`+
`console.log("---------------------------");\n`+
`while(it2 > 0){\n`+
`  	console.log("PrimerCiclo"+it2);\n`+
`  	let it=10;\n`+
`	while(it > 0){\n`+
`	   console.log(it);\n`+
`   	if(it==5){\n`+
`	  if(it2 == 2 ){\n`+
`	  	break;\n`+
`	  }\n`+
`   	}\n`+
`  	it--;\n`+
`\n`+	  
`	}\n`+
`	it2--;\n`+
`}\n`+
`console.log("---------------------------");\n`+
`//-----------NUMERO IMPARES DEL 1 AL 10-------------------\n`+
`console.log("-----------NUMERO IMPARES DEL 1 AL 10---------------");\n`+
`let numero=0;\n`+
`while(numero<10){\n`+
`  	numero++;\n`+
`	if(numero%2 ==0){\n`+
`		continue;\n`+
`	}\n`+
`  console.log(numero);\n`+
`}\n`+
`console.log("--------------------------------------------------");\n`+
`//-------------------------------------------------------\n`;
}