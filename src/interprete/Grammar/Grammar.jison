 
%{
    const { Aritmetica, OperacionAritmetica } = require('../Expresion/Aritmetica');
    const { Relacional, OperacionRelacional } = require('../Expresion/Relacional');
    const { Acceso } = require('../Expresion/Acceso');
    const { AccesoTipo } = require('../Expresion/AccesoTipo');
    const { Literal} = require('../Expresion/Literal');
    const { Imprimir } =require('../Instrucciones/Imprimir');
    const { GraficarTs } =require('../Instrucciones/GraficarTs');
    const { Break } =require('../Instrucciones/Break');
    const { Continue } =require('../Instrucciones/Continue');
    const { Switch } =require('../Instrucciones/Switch');
    const { If } = require('../Instrucciones/If');
    const { While } = require('../Instrucciones/While');
    const { DoWhile } = require('../Instrucciones/DoWhile');
    const { IncreDecre } = require('../Instrucciones/IncreDecre');
    const { Statement} = require('../Instrucciones/Statement');
    const { Asignacion} = require('../Instrucciones/Asignacion');
    const { Tipo, cuadro_texto } =require("../Abstracto/Retorno");
    const { errores } =require('../Errores/Errores');
    const { Error_ } =require('../Errores/Error');
    const { Declaracion } = require('../Instrucciones/Declaracion');
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
string (\"({escape}|{acceptedquote})*\")

%%
//TODO si falla algo que no se que es quitar el eof
\s+                   /* skip whitespace */ 
"/""/"([^\n])*([\n]|<<EOF>>)                  //console.log("imprime comentario "+yytext);
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] //console.log("imprime comentario Multilinea"+yytext);

//TIPOS DE DATOS / EXPRESIONES REGULARES

{decimal}               return 'DECIMAL'
{number}                return 'NUMBER'
{string}                return 'STRING'


//SIMBOLOS ARITMETICOS, COMA, PUNTOCOMA
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
"."                     return '.'
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
"break"                  return 'BREAK'
"continue"                  return 'CONTINUE'

([a-zA-Z_])[a-zA-Z0-9_ñÑ]*	return 'ID';
<<EOF>>		            return 'EOF'

.  { 
    //cuadro_texto.errores_sintacticos_lexicos='Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column+'\n'; 
    error=new Error_(yylloc.first_line, yylloc.first_column, 'Lexico','El caracter: " ' + yytext + ' ",  no pertenece al lenguaje');
    errores.push(error);
    //console.log(error);
}

/lex

%left '||'
%left '&&'
%left '==', '!='
%left '>=', '<=', '<', '>'
%left '+' '-'
%left '*' '/' '%'
%right '^'
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
    |AsignacionVariable
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
    |error ';'  
    {
        //console.log("Error vino"+yytext+" vino "+ @1.first_line+" "+  @1.first_column, " se esperaba "+ (this.terminals_[symbol] || symbol));
        //console.log($1);
        error = new Error_(@1.first_line, @1.first_column, 'Sintactico', 'Error Sintactico: " ' + $1 + ' ",  no se esperaba');
        errores.push(error);
        $$="asdf";
    }
    |error '}'  
    {
        //console.log("Error vino"+yytext+" vino "+ @1.first_line+" "+  @1.first_column, " se esperaba "+ (this.terminals_[symbol] || symbol));
        //console.log($1);
        error = new Error_(@1.first_line, @1.first_column, 'Sintactico', 'Error Sintactico: " ' + $1 + ' ",  no se esperaba');
        errores.push(error);
        $$="asdf";
    }
;


Imprimir
    : CONSOLELOG '(' Expr ')' ';'
    {
        $$ = new Imprimir($3, @1.first_line, @1.first_column);
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
    : ID '=' Expr ';'
    {
        $$ = new Asignacion($1, $3, @1.first_line, @1.first_column);
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
    |ID ':' ID '=' 'NULL'
    {
        $$ =  new ElementoDeclaracion(TipoDeclaracion.ID_TIPO_VALOR, $1, Tipo.TYPE, $3, new Literal('null', @1.first_line, @1.first_column,4));
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
    :'LET' ID ':' Tipos ListaDimensiones ';'
    {
        $$ = new DeclaracionArreglo($2, $4, $5,null,@1.first_line, @1.first_column);
    }
    |'LET' ID ':' ListaDimensiones ';'
    {
        $$= new DeclaracionArreglo();
    }    
    |'LET' ID '=' ListaDimensiones ';'
    |'LET' ID ':' 'TIPO' ListaDimensiones '=' ValoresArreglo ';'
    |'LET' ID ':' ListaDimensiones '=' ValoresArreglo ';'
    |'LET' ID '=' ValoresArreglo ';'
;

ListaDimensiones
    :ListaDimensiones '[' ']'
    {
        $$=new Simbolo(new Arreglo([$1],), '', Tipo.ARRAY, '');
    } 
    |'LET' ID ':' Tipos '['']'
    {
        $$=new Simbolo(new Arreglo(null, $4), $2, Tipo.ARRAY, 'let');
    }
    |

;

Tipos
    :TipoNormal
    {
        $$=$1;
    }
    |ID
    {
        $$=$1;
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
    | Expr '^' Expr
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
    | TRUE
    {
        $$ = new Literal(true, @1.first_line, @1.first_column, 3);
        
    }
    | FALSE
    {
        $$ = new Literal(false, @1.first_line, @1.first_column, 3);
    }
    | ID
    {
        $$ = new Acceso($1, @1.first_line, @1.first_column);
    }
    |Accesos
    {
        $$ = $1;
    }
    |NULL 
    {
        $$ = new Literal($1, @1.first_line, @1.first_column,4);
    }
;

Accesos
    :Accesos '.' ID
    {
        $$ = new AccesoTipo($3,'', $1, @1.first_line, @1.first_column);
    }
    |Accesos '[' Expr ']'
    {

    }
    |Accesos '.' ID '(' Parametros ')'
    {

    }
    |ID '.' ID 
    {
        $$ =  new AccesoTipo($1, $3, null, @1.first_line, @1.first_column);
    }
    |ID '[' Expr ']'
    {

    }
    |ID '.' ID '(' Parametros ')'
    {

    }
;