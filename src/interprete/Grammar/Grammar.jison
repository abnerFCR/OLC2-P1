 
%{
    const { Aritmetica, OperacionAritmetica } = require('../Expresion/Aritmetica');
    const { Relacional, OperacionRelacional } = require('../Expresion/Relacional');
    const { Acceso } = require('../Expresion/Acceso');
    const { AccesoTipo } = require('../Expresion/AccesoTipo');
    const { Ternario } = require('../Expresion/Ternario');
    const { AccesoArreglo } = require('../Expresion/AccesoArreglo');
    const { Literal} = require('../Expresion/Literal');
    const { Imprimir } =require('../Instrucciones/Imprimir');
    const { GraficarTs } =require('../Instrucciones/GraficarTs');
    const { Break } =require('../Instrucciones/Break');
    const { Return } =require('../Instrucciones/Return');
    const { DeclaracionArreglo } =require('../Instrucciones/DeclaracionArreglo');
    const { Continue } =require('../Instrucciones/Continue');
    const { Switch } =require('../Instrucciones/Switch');
    const { If } = require('../Instrucciones/If');
    const { While } = require('../Instrucciones/While');
    const { Arreglo } = require('../Objetos/Arreglo');
    const { Simbolo } = require('../Simbolo/Simbolo');
    const { DoWhile } = require('../Instrucciones/DoWhile');
    const { For } = require('../Instrucciones/For');
    const { ForOf } = require('../Instrucciones/ForOf');
    const { ForIn } = require('../Instrucciones/ForIn');
    const { IncreDecre } = require('../Instrucciones/IncreDecre');
    const { Statement} = require('../Instrucciones/Statement');
    const { Asignacion} = require('../Instrucciones/Asignacion');
    const { AsignacionIndArreglo } = require('../Instrucciones/AsignacionIndArreglo');
    const { AsignacionIndTipo } = require('../Instrucciones/AsignacionIndTipo');
    const { AsignacionTipo } = require('../Instrucciones/AsignacionTipo');
    const { Tipo, cuadro_texto } =require("../Abstracto/Retorno");
    const { errores } =require('../Errores/Errores');
    const { Error_ } =require('../Errores/Error');
    const { Declaracion } = require('../Instrucciones/Declaracion');
    const { Funcion } = require('../Instrucciones/Funcion');
    const { Llamada } = require('../Instrucciones/Llamada');
    const { ElementoDeclaracion, TipoDeclaracion } = require('../Util/ElementoDeclaracion');
    const { Caso } = require('../Util/Caso');
    const { DeclaracionType } = require('../Instrucciones/DeclaracionType');
%}

%lex
%options case-sensitive
number  [0-9]+
decimal {number}"."{number}
//string  (\"[^"]*\")
identificador [a-zA-Z]([a-zA-Z]|[0-9])*
escapechar [\'\"\\bfnrtv]
escape \\{escapechar}
acceptedquote [^\"\\]+
acceptedquote2 [^\'\\]+
acceptedquote3 [^`\\]+
string (\"({escape}|{acceptedquote})*\")
string2 (\'({escape}|{acceptedquote2})*\')
string3 (\`({escape}|{acceptedquote3})*\`)

%%
\s+                   /* skip whitespace */ 
"/""/"([^\n])*([\n]|<<EOF>>)                  //console.log("imprime comentario "+yytext);
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] //console.log("imprime comentario Multilinea"+yytext);

//TIPOS DE DATOS / EXPRESIONES REGULARES

{decimal}               return 'DECIMAL'
{number}                return 'NUMBER'
{string}                return 'STRING'
{string2}                return 'STRING2'
{string3}                return 'STRING3'


//SIMBOLOS ARITMETICOS, COMA, PUNTOCOMA
"**"                     return '**'
"*"                     return '*'
"/"                     return '/'
";"                     return ';'
","                     return ','
"++"                    return '++'
"--"                    return '--'
"-"                     return '-'
"+"                     return '+'
"^"                     return '^'
"%"                     return '%'

//SIMBOLOS RELACIONALES Y LOGICOS
"<="                  return '<='
">="                  return '>='
"<"                   return '<'
">"                   return '>'
"=="                  return '=='
"!="                  return '!='
"||"                  return '||'
"&&"                  return '&&'
"!"                   return '!'
"?"                     return '?'

//SIMBOLOS DE ASIGNACION
"="                   return '='

//SIMBOLOS DE AGRUPACION
"("                     return '('
")"                     return ')' 
"{"                     return '{'
"}"                     return '}'
"["                     return '['
"]"                     return ']'

":"                     return ':'

//PALABRAS RESERVADAS
"if"                    return 'IF'
"else"                  return 'ELSE'
"while"                 return 'WHILE'
"true"                  return 'TRUE'
"false"                 return 'FALSE'
"console.log"           return 'CONSOLELOG'
"graficar_ts"           return 'GRAFICAR_TS'
"do"                    return 'DO'
"let"                   return 'LET'
"const"                 return 'CONST'
"number"                return 'TIPONUMBER'
"string"                return 'TIPOSTRING'
"boolean"               return 'TIPOBOOLEAN'
"switch"                return 'SWITCH'
"case"                  return 'CASE'
"default"               return 'DEFAULT'
"type"                  return 'TYPE'
"null"                  return 'NULL'
"break"                 return 'BREAK'
"continue"              return 'CONTINUE'
"for"                   return 'FOR'
"of"                   return 'OF'
"in"                    return 'IN'
"function"              return 'FUNCTION'
"void"                  return "TIPOVOID"
"return"                  return "RETURN"  
".push"                 return 'PUSH'
".pop"                  return 'POP'
".length"               return 'LENGTH'
"."                     return '.'

([a-zA-Z_])[a-zA-Z0-9_ñÑ]*	return 'ID';
<<EOF>>		            return 'EOF'

.  { 
    //cuadro_texto.errores_sintacticos_lexicos='Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column+'\n'; 
    error=new Error_(yylloc.first_line, yylloc.first_column, 'Lexico','El caracter: " ' + yytext + ' ",  no pertenece al lenguaje');
    errores.push(error);
    //console.log(error);
}

/lex

%left '?'
%left '||'
%left '&&'
%left '==', '!='
%left '>=', '<=', '<', '>'
%left '+' '-' 
%left '*' '/' '%'
%right '**'
$right '!'
%left '++' '--'


%start Init

%%

Init    
    : Instrucciones EOF 
    {
        return $1;
    } 
;

Instrucciones
    : Instrucciones Instruccion
    {
        $1.push($2);
        $$ = $1;
    }
    |Instruccion
    {
        $$ = [$1];
    }
;

Instruccion
    : Imprimir
    {
        $$=$1;
    }
    |DeclaracionVariable
    {
        $$=$1;
    }
    |AsignacionVariable ';'
    {
        $$=$1;
    }
    |IfSt
    {
        $$=$1;
    }
    |WhileSt
    {
        $$=$1;
    }
    |DoWhileSt
    {
        $$=$1;
    }
    |SwitchSt
    {
        $$=$1;
    }
    |IncreDecre ';'
    {
        $$=$1;
    }
    |DefinicionTypes ';'
    {
        $$=$1;
    }
    |GraficarTs ';'
    {
        $$ =$1;
    }
    |'BREAK' ';'
    {
        $$ =new Break(@1.first_line, @1.first_column);
    }
    |'CONTINUE' ';'
    {
        $$ =new Continue(@1.first_line, @1.first_column);
    }
    |DeclaracionArreglos ';'
    {
        $$=$1;
    }
    |ForNormal 
    {
        $$=$1;
    }
    |ForOf 
    {
        $$=$1;
    }
    |ForIn 
    {
        $$=$1;
    }
    |Funcion 
    {
        $$=$1;
    }
    |ID '(' ListaExpr ')' ';'
    {
        $$ =new Llamada($1, $3, @1.first_line, @1.first_column);
    }
    |ID '('')' ';'
    {
        $$ =new Llamada($1, [], @1.first_line, @1.first_column);
    }
    |ID  '=' '{' ListaValoresTipo '}' ';'
    {
        $$ =  new AsignacionTipo($1, '', $4, @1.first_line, @1.first_column);
    }
    |'RETURN' Expr ';'
    {
        $$ = new Return($2,@1.first_line, @1.first_column);
    }
    |'RETURN' ';'
    {
        $$ = new Return(new Literal(-1, @1.first_line, @1.first_column, 11),@1.first_line, @1.first_column);
    }
    |AsigIndividual '=' Expr ';'
    {
        var s = eval('$$');
        var indice = s.length-1;
        console.log("------------------------------------------------------------------>");
        console.log(s[indice-3]);
        s[indice-3].expresionNueva = $3;
        $$=$1;
    }
    |AsigIndividual '=' '['']' ';'
    {
        var s = eval('$$');
        var indice = s.length-1;
        console.log("------------------------------------------------------------------>");
        console.log(s[indice-3]);
        s[indice-3].expresionNueva = null;
        $$=$1;
    }
    |error ';'
    {
        error=new Error_(@1.first_line, @1.first_column, 'Sintactico','El caracter: " ' + yytext + ' ",  no se esperaba');
        errores.push(error);
    }
    |error '}'
    {
        error=new Error_(@1.first_line,@1.first_column, 'Sintactico','El caracter: " ' + yytext + ' ",  no se esperaba');
        errores.push(error);
    }
    
;

Funcion
    :'FUNCTION' ID '(' ListaParametros ')' ':' TiposFuncion StatementFuncion
    {
        //console.log("Soy el statement");
        //console.log($8);
        var s = eval('$$');
        var ind = s.length - 1;
        $$ = new Funcion(s[ind - 6], s[ind -4 ], s[ind-1],s[ind], @1.first_line, @1.first_column);
    }
    |'FUNCTION' ID '(' ListaParametros ')' StatementFuncion
    {
        //console.log("Soy el statement");
        //console.log($8);
        var s = eval('$$');
        var ind = s.length - 1;
        $$ = new Funcion(s[ind - 4], s[ind -2 ], Tipo.VOID,s[ind], @1.first_line, @1.first_column);
    }
    |'FUNCTION' ID '(' ')' ':' TiposFuncion StatementFuncion
    {
        //console.log("Soy el statement");
        //console.log($8);
        var s = eval('$$');
        var ind = s.length - 1;
        $$ = new Funcion(s[ind - 5], [], s[ind-1],s[ind], @1.first_line, @1.first_column);
    }
    |'FUNCTION' ID '(' ')' StatementFuncion
    {
        //console.log("Soy el statement");
        //console.log($8);
        var s = eval('$$');
        var ind = s.length - 1;
        $$ = new Funcion(s[ind - 3], [], Tipo.VOID, s[ind], @1.first_line, @1.first_column);
    }
;

ListaParametros
    :ElementoParametro ListaParametrosPrima
    {
        //console.log("Que paso");
        var s = eval('$$');
        var indice = s.length - 1;
        if(s[indice]==undefined){
            $$ = [s[indice-1]];
        }else{
            s[indice].unshift(s[indice-1]);
            $$ = s[indice];
        }
    }
;

ListaParametrosPrima
    : ',' ElementoParametro ListaParametrosPrima
    {
        var s = eval('$$');
        var indice = s.length - 1;
        if(s[indice] != undefined){
            s[indice].unshift(s[indice-1]);
        }else{
            s[indice] = [s[indice-1]];
        }
        $$= s[indice]; 
    }
    |{}
;

ElementoParametro
    :ElementoDeclaracion
    {
        $$=$1;
    }
    |ID ':' Tipos ListaCorh
    {
        $$ = new ElementoDeclaracion(TipoDeclaracion.ID_TIPO_VALOR, $1, Tipo.ARRAY, $3, null);
    }
;

ListaCorh
    :ListaCorh '['']'
    |'['']'
;

TiposFuncion
    :TipoNormal
    {
        $$=$1;
    }
    |'TIPOVOID'
    {
        $$=Tipo.VOID;
    }
    |ID
    {
        $$={tipo:Tipo.TYPE, idTipo:$1};
    }
    |TipoNormal ListaCorh
    {
        $$=Tipo.ARRAY;
    }
;

Imprimir
    :CONSOLELOG '(' ListaExpr ')' ';'
    {
        $$ = new Imprimir($3, @1.first_line, @1.first_column);
    /* CONSOLELOG '(' Expr ')' ';'
    {
        $$ = new Imprimir($3, @1.first_line, @1.first_column);
    }
    |*/
    }
;

GraficarTs
    :'GRAFICAR_TS' '(' ')'
    {
        $$ = new GraficarTs(@1.first_line,@1.first_column);
    }
;

DeclaracionVariable
    : 'LET' ListaDeclaraciones ';' 
    {
        $$= new Declaracion('let', $2, @1.first_line, @1.first_column);
    }
    | 'CONST' ListaDeclaraciones ';'
    {
        $$ = new Declaracion('const',$2, @1.first_line, @1.first_column);
    }   
; 

AsignacionVariable
    : ID '=' Expr 
    {
        $$ = new Asignacion($1, $3, @1.first_line, @1.first_column);
        /*
        
    |ID '=' '{' ListaValoresTipo '}'
    {
        let nuevoE =  new ElementoDeclaracion(TipoDeclaracion.ID_TIPO_VALOR, $1, Tipo.TYPE, '', $4);
        $$ = AsignacionTipo($1, '', nuevoE, this.linea, this.columna);
    }
        */
    }
;

IfSt
    : 'IF' '(' Expr ')' Statement ElseSt
    {
        $$ = new If($3, $5, $6, @1.first_line, @1.first_column);
    }
;

ElseSt
    : 'ELSE' Statement
    {
        $$=$2;
    } 
    | 'ELSE' IfSt
    {
        $$=$2;
    }
    | 
    {
        $$=null;    
    }
;

WhileSt
    : 'WHILE' '(' Expr ')' Statement
    {
        $$ = new While($3, $5, @1.first_line, @1.first_column);
    }
;

DoWhileSt
    : 'DO' Statement 'WHILE' '(' Expr ')' ';'
    {
        $$ = new DoWhile($5, $2, @1.first_line, @1.first_column);
    }
;

ForNormal
    :'FOR' '(' DeclaracionVariable Expr ';' OpcAsignacion ')' Statement
    {
        $$ = new For($3, $4, $6, $8, @1.first_line, @1.first_column);
    }
;

OpcAsignacion
    :AsignacionVariable
    {
        $$ = $1;
    }
    |IncreDecre
    {
        $$= $1;
    }
;

SwitchSt
    : 'SWITCH' '(' Expr ')' '{' ListaCasos '}' 
    {
        $$ = new Switch($3, $6, @1.first_line, @1.first_column);
    }
;

ListaCasos
    : ListaCasos Caso 
    {
        $1.push($2);
        $$ = $1;
    }
    |Caso 
    {
        $$=[$1];
    }
;

Caso
    : 'CASE' Expr ':' Statement
    {
        $$ = new Caso($2, $4, @1.first_line, @1.first_column);
    }
    | 'DEFAULT' ':' Statement
    {
        $$ = new Caso(null, $3, @1.first_line, @1.first_column);
    }
    | 'CASE' Expr ':' Instrucciones
    {
        $$ = new Caso($2, $4, @1.first_line, @1.first_column);
    }
    | 'DEFAULT' ':' Instrucciones
    {
        $$ = new Caso(null, $3, @1.first_line, @1.first_column);
    }
;

IncreDecre
    : ID '++'
    {   
        $$ = new IncreDecre('incre', new Acceso($1, @1.first_line, @1.first_column), @1.first_line, @1.first_column);
    }
    |ID '--'
    {
        $$ = new IncreDecre('decre', new Acceso($1, @1.first_line, @1.first_column), @1.first_line, @1.first_column);
    }
;

Statement
    : '{' Instrucciones '}' 
    {
        $$ = new Statement($2, @1.first_line, @1.first_column);
    }
    | '{' '}' 
    {
        $$ = new Statement(new Array(), @1.first_line, @1.first_column);
    }
;

ListaDeclaraciones
    :ListaDeclaraciones ',' ElementoDeclaracion
    {
        $1.push($3);
        $$ = $1;
    }
    |ElementoDeclaracion
    {
        $$=[$1];
    }
;

ElementoDeclaracion
    :ID ':' TipoNormal '=' Expr
    {
        $$ = new ElementoDeclaracion(TipoDeclaracion.ID_TIPO_VALOR,$1,$3,'',$5);
    }
    |ID ':' TipoNormal
    {
        $$ = new ElementoDeclaracion(TipoDeclaracion.ID_TIPO,$1,$3,'',null);
    }
    |ID '=' Expr
    {
        $$ = new ElementoDeclaracion(TipoDeclaracion.ID_VALOR,$1,'',null,$3);
    }
    |ID
    {
        $$ = new ElementoDeclaracion(TipoDeclaracion.ID,$1, null, '',null);
    }
    |ID ':' ID
    {
        $$ = new ElementoDeclaracion(TipoDeclaracion.ID_TIPO,$1, Tipo.TYPE, $3, null);
    }
    |ID ':' ID '=' '{' ListaValoresTipo '}'
    {
        $$ =  new ElementoDeclaracion(TipoDeclaracion.ID_TIPO_VALOR, $1, Tipo.TYPE, $3, $6);
    }

    |ID ':' ID '=' Expr
    {
        $$ =  new ElementoDeclaracion(TipoDeclaracion.ID_TIPO_VALOR, $1, Tipo.TYPE, $3, $5);
        /*
        new Literal('null', @1.first_line, @1.first_column,4)
        */
    }
    
;


ListaValoresTipo
    :ListaValoresTipo ',' ValorType
    {
        $1.push($3);
        $$ = $1;
    }
    |ValorType
    {
        $$=[$1];
    }
;

ValorType
    :ID ':' Expr
    {
        $$={id:$1, valor:$3};
    }
    |ID ':' '{' ListaValoresTipo '}'
    {
        $$ = {id:$1, valor:$4}
    }
;

TipoNormal
    :'TIPOSTRING'
    {
        $$=Tipo.STRING;
    }
    |'TIPOBOOLEAN'
    {
        $$=Tipo.BOOLEAN;
    }
    |'TIPONUMBER'
    {
        $$=Tipo.NUMBER;
    }
;

DefinicionTypes
    : 'TYPE' ID '=' '{' ListaDefiniciones '}'
    {
        $$ = new DeclaracionType($2, $5, @1.first_line, @1.first_column);
    }
;

ListaDefiniciones
    : ListaDefiniciones ',' DefinicionAtributo
    {
        $1.push($3);
        $$=$1;
    }
    |DefinicionAtributo
    {
        $$=[$1];
    }
;

DefinicionAtributo
    :ID ':' ID
    {
        $$ = new ElementoDeclaracion(TipoDeclaracion.ID_TIPO,$1,Tipo.TYPE,$3,null);
    }
    |ID ':' TipoNormal
    {
        $$ = new ElementoDeclaracion(TipoDeclaracion.ID_TIPO,$1,$3,'',null);
    }
;

DeclaracionArreglos
    :ListaDimensiones '=' '[' ValoresArreglo ']'
    {
        $$=new DeclaracionArreglo($1, $4, @1.first_line,@1.first_column);
    }
    |ListaDimensiones '=' '[' ListaExpr ']'
    {
        $$=new DeclaracionArreglo($1,$4, @1.first_line,@1.first_column);
    }
    |ListaDimensiones '=' '['']'
    {
        $$=new DeclaracionArreglo($1,[],@1.first_line,@1.first_column);
    }
    |ListaDimensiones
    {
        $$=new DeclaracionArreglo($1,[],@1.first_line,@1.first_column);
    }
;

ListaDimensiones
    :ListaDimensiones '[' ']'
    {   
        var s = eval('$$');
        var indice = s.length-1;
        console.log(s[indice-2]);
        $$=new Simbolo(new Arreglo([$1],s[indice -2].valor.tipo), s[indice - 2].id, Tipo.ARRAY, s[indice-2].tipoSimbolo,s[indice-2].valor.tipo.idTipo);
    } 
    |'LET' ID ':' Tipos '[' ']'
    {
        $$=new Simbolo(new Arreglo([], $4), $2, Tipo.ARRAY, $1 ,$4.idTipo);
    }
    |'CONST' ID ':' Tipos '[' ']'
    {
        $$=new Simbolo(new Arreglo([], $4), $2, Tipo.ARRAY, $1 ,$4.idTipo);
    }

;

ValoresArreglo
    :ValoresArreglo ',' ValorArreglo
    {
        $1.push($3);
        $$ = $1;
        
    }
    |ValorArreglo
    {
        $$=[$1];
    }
;

ValorArreglo
    :'[' ListaExpr ']'
    {
        $$=$2;
    }
    |'[' ValoresArreglo ']'
    {   
        $$ = $2;
    }
;

ListaExpr
    :ListaExpr ',' Expr
    {
        $1.push($3);
        $$=$1;
    }
    |Expr
    {
        $$=[$1];
    }
;

Tipos
    :TipoNormal
    {
        $$={tipo:$1, idTipo:''};
    }
    |ID
    {
        $$ = {tipo:Tipo.TYPE, idTipo:$1};
    }
;

Expr
    : Expr '+' Expr
    {
        $$ = new Aritmetica($1, $3, OperacionAritmetica.SUMA, @1.first_line,@1.first_column);
    }       
    | Expr '-' Expr
    {
        $$ = new Aritmetica($1, $3, OperacionAritmetica.RESTA, @1.first_line,@1.first_column);
    }
    | Expr '*' Expr
    { 
        $$ = new Aritmetica($1, $3, OperacionAritmetica.MULTIPLICACION, @1.first_line,@1.first_column);
    }       
    | Expr '/' Expr
    {
        $$ = new Aritmetica($1, $3, OperacionAritmetica.DIVISION, @1.first_line,@1.first_column);
    }
    | Expr '**' Expr
    {
        $$ = new Aritmetica($1, $3, OperacionAritmetica.POTENCIA, @1.first_line,@1.first_column);
    }
    | Expr '%' Expr
    {
        $$ = new Aritmetica($1, $3, OperacionAritmetica.MODULO, @1.first_line,@1.first_column);
    }
    | '-' Expr
    {
        $$ = new Aritmetica($2, $2, OperacionAritmetica.NEGACION, @1.first_line,@1.first_column);
    }
    | Expr '++'
    {
        $$ = new Aritmetica($1, $1, OperacionAritmetica.INCREMENTO, @1.first_line,@1.first_column);
    }
    | Expr '--' 
    {
        $$ = new Aritmetica($1, $1, OperacionAritmetica.DECREMENTO, @1.first_line,@1.first_column);
    }
    | Expr '||' Expr
    {
        $$ = new Relacional($1, $3, OperacionRelacional.OR, @1.first_line,@1.first_column);
    }
    | Expr '&&' Expr
    { 
        $$ = new Relacional($1, $3, OperacionRelacional.AND, @1.first_line,@1.first_column);
    }
    | '!' Expr
    { 
        $$ = new Relacional($2, $2, OperacionRelacional.NOT, @1.first_line,@1.first_column);
    }   
    | Expr '>=' Expr
    {
        $$ = new Relacional($1, $3, OperacionRelacional.MAYORIGUALQUE, @1.first_line,@1.first_column);
    }
    | Expr '<=' Expr
    { 
        $$ = new Relacional($1, $3, OperacionRelacional.MENORIGUALQUE, @1.first_line,@1.first_column);
    }    
    | Expr '>' Expr
    {
        
        $$ = new Relacional($1, $3, OperacionRelacional.MAYORQUE, @1.first_line,@1.first_column);
    }
    | Expr '<' Expr
    {
        $$ = new Relacional($1, $3, OperacionRelacional.MENORQUE, @1.first_line,@1.first_column);
    }
    | Expr '==' Expr
    {
        $$ = new Relacional($1, $3, OperacionRelacional.IGUALACION, @1.first_line,@1.first_column);
    }
    | Expr '!=' Expr
    { 
        $$ = new Relacional($1, $3, OperacionRelacional.DIFERENCIACION, @1.first_line,@1.first_column);
    }
    | F
    {
        
        $$ = $1;
    }
;


F   : '(' Expr ')'
    { 
        $$ = $2;
    }
    | DECIMAL
    { 
        $$ = new Literal($1, @1.first_line, @1.first_column, 0);
    }
    | NUMBER
    { 
        $$ = new Literal($1, @1.first_line, @1.first_column, 1);
    }
    | STRING
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 2);
    }
    | STRING2
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 2);
    }
    | STRING3
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 2);
    }
    | TRUE
    {
        $$ = new Literal(true, @1.first_line, @1.first_column, 3);
        
    }
    | FALSE
    {
        $$ = new Literal(false, @1.first_line, @1.first_column, 3);
    }
    |NuevoAcceso
    {
        $$ = $1;
    }
    |NULL 
    {
        $$ = new Literal($1, @1.first_line, @1.first_column,4);
    }
    |ID '(' ListaExpr ')' 
    {
        $$ =new Llamada($1, $3, @1.first_line, @1.first_column);
    }
    |ID '(' ')' 
    {
        $$ =new Llamada($1, [], @1.first_line, @1.first_column);
    }
    | Expr '?' Expr ':' Expr
    {
        $$=new Ternario($1,$3,$5, @1.first_line, @1.first_column);
    }
    
;

NuevoAcceso
    :Accesos
    {
        $$=$1;
    }
    |Acceso
    {
        $$=$1;
    }
    |ID FuncionArreglo
    {
        $$ = new AccesoArreglo($1,null,null,$2.funcion,$2.valor, @1.first_line, @1.first_column);
    }
;
Acceso
    :ID
    {
        $$ = new Acceso($1, @1.first_line, @1.first_column);
    }
;

Accesos
    :Accesos '.' ID
    {
        $$ = new AccesoTipo($3,'', $1, @1.first_line, @1.first_column);
    }
    |Accesos '[' Expr ']'
    {
        $$ = new AccesoArreglo('',$3,$1,'',null, @1.first_line, @1.first_column);
    }
    |Accesos '[' Expr ']' FuncionArreglo
    {
        $$ = new AccesoArreglo('',$3,$1,$5.funcion,$5.valor, @1.first_line, @1.first_column);
    }
    |ID '.' ID 
    {
        $$ =  new AccesoTipo($1, $3, null, @1.first_line, @1.first_column);
    }
    |ID '[' Expr ']' FuncionArreglo
    {
        $$ = new AccesoArreglo($1,$3,null,$5.funcion,$5.valor, @1.first_line, @1.first_column);
    }
    |ID '[' Expr ']'
    {
        $$ = new AccesoArreglo($1,$3,null,'',null, @1.first_line, @1.first_column);
    }
    
;

FuncionArreglo
    :'POP' '(' ')' 
    {
        $$={funcion:$1, valor:null};
    }
    |'PUSH' '(' Expr ')'
    {
        $$={funcion:$1, valor:$3};
    }
    |'LENGTH'
    {
        $$={funcion:$1, valor:null};
    }
;


AsigIndividual
    :AsigIndividual '[' Expr ']' 
    {
        $$ = new AsignacionIndArreglo('',$3,$1,'',null, @1.first_line, @1.first_column);
    }
    |ID '[' Expr ']'
    {
        $$ = new AsignacionIndArreglo($1,$3,null,'',null, @1.first_line, @1.first_column);
    }
    |AsigIndividual '.' ID 
    {
        $$= new AsignacionIndTipo($3,'',$1,null, @1.first_line, @1.first_column);
    }
    |ID '.' ID
    {
        $$= new AsignacionIndTipo($1,$3,null,null, @1.first_line, @1.first_column);
    }
;

StatementFuncion
    : '{' InstruccionesFuncion '}' 
    {
        $$ = new Statement($2, @1.first_line, @1.first_column);
    }
    | '{' '}' 
    {
        $$ = new Statement(new Array(), @1.first_line, @1.first_column);
    }
;

InstruccionesFuncion
    :InstruccionFuncion InstruccionesFuncionPrima
    {
        //console.log("Que paso");
        var s = eval('$$');
        var indice = s.length - 1;
        if(s[indice]==undefined){
            $$ = [s[indice-1]];
        }else{
            s[indice].unshift(s[indice-1]);
            $$ = s[indice];
        }
        
    }
;
InstruccionesFuncionPrima
    :InstruccionFuncion InstruccionesFuncionPrima
    {
        var s = eval('$$');
        var indice = s.length - 1;
        if(s[indice] != undefined){
            s[indice].unshift(s[indice-1]);
        }else{
            s[indice] = [s[indice-1]];
        }
        $$= s[indice];  
    }
    |
    {
    }
;

InstruccionFuncion
    : Imprimir
    {
        $$=$1;
    }
    |DeclaracionVariable
    {
        $$=$1;
    }
    |AsignacionVariable ';'
    {
        $$=$1;
    }
    |IfSt
    {
        $$=$1;
    }
    |WhileSt
    {
        $$=$1;
    }
    |DoWhileSt
    {
        $$=$1;
    }
    |SwitchSt
    {
        $$=$1;
    }
    |IncreDecre ';'
    {
        $$=$1;
    }
    |DefinicionTypes ';'
    {
        $$=$1;
    }
    |GraficarTs ';'
    {
        $$ =$1;
    }
    |'BREAK' ';'
    {
        $$ =new Break(@1.first_line, @1.first_column);
    }
    |'CONTINUE' ';'
    {
        $$ =new Continue(@1.first_line, @1.first_column);
    }
    |DeclaracionArreglos ';'
    {
        $$=$1;
    }
    |ForNormal 
    {
        $$=$1;
    }
    |ForOf 
    {
        $$=$1;
    }
    |ForIn
    {
        $$=$1;
    }
    |ID  '=' '{' ListaValoresTipo '}' ';'
    {
        $$ =  new AsignacionTipo($1, '', $4, @1.first_line, @1.first_column);
    }
    |ID '(' ListaExpr ')' ';'
    {
        $$ =new Llamada($1, $3, @1.first_line, @1.first_column);
    }
    |ID '('')' ';'
    {
        $$ =new Llamada($1, [], @1.first_line, @1.first_column);
    }
    |AsigIndividual '=' Expr ';'
    {
        var s = eval('$$');
        var indice = s.length-1;
        console.log("------------------------------------------------------------------>");
        console.log(s[indice-3]);
        s[indice-3].expresionNueva = $3;
        $$=$1;
    }
    |'RETURN' Expr ';'
    {
        $$ = new Return($2,@1.first_line, @1.first_column);
    }
    |'RETURN' ';'
    {
        $$ = new Return(new Literal(-1, @1.first_line, @1.first_column, 11),@1.first_line, @1.first_column);
    }
    |error ';'
    {
        error=new Error_(@1.first_line, @1.first_column, 'Sintactico','El caracter: " ' + yytext + ' ",  no se esperaba(Una instruccion no pertenece a la funcion)');
        errores.push(error);
    }
    |error '}'
    {
        error=new Error_(@1.first_line,@1.first_column, 'Sintactico','El caracter: " ' + yytext + ' ",  no se esperaba (Una instruccion no pertenece a la funcion)');
        errores.push(error);
    }
    
;
ForOf
    :'FOR' '(' 'LET' ID 'OF' Expr')' Statement
    {
        $$ =  new ForOf($4,$6,$8, @1.first_line, @1.first_column);
    }
    |'FOR' '(' 'CONST' ID 'OF' Expr')' Statement
    {
        $$ =  new ForOf($4,$6,$8, @1.first_line, @1.first_column);
    }
;

ForIn
    :'FOR' '(' 'LET' ID 'IN' Expr')' Statement
    {
        $$ =  new ForIn($4,$6,$8, @1.first_line, @1.first_column);
    }
    |'FOR' '(' 'CONST' ID 'IN' Expr')' Statement
    {
        $$ =  new ForIn($4,$6,$8, @1.first_line, @1.first_column);
    }
;