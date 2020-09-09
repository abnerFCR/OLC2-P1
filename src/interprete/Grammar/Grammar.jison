 
%{
    const { Aritmetica, OperacionAritmetica} = require('../Expresion/Aritmetica');
    const { Relacional, OperacionRelacional} = require('../Expresion/Relacional');
    const { Acceso} = require('../Expresion/Acceso');
    const { Literal} = require('../Expresion/Literal');
    const { Imprimir } =require('../Instrucciones/Imprimir');
    const { Switch } =require('../Instrucciones/Switch');
    const { If } = require('../Instrucciones/If');
    const { While } = require('../Instrucciones/While');
    const { DoWhile } = require('../Instrucciones/DoWhile');
    const { Statement} = require('../Instrucciones/Statement');
    const { Asignacion} = require('../Instrucciones/Asignacion');
    const { Tipo, cuadro_texto } =require("../Abstracto/Retorno");
    const { errores } =require('../Errores/Errores');
    const { Error_ } =require('../Errores/Error');
    const { Declaracion } = require('../Instrucciones/Declaracion');
    const { ElementoDeclaracion, TipoDeclaracion } = require('../Util/ElementoDeclaracion');
    const { Caso } = require('../Util/Caso');
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

//PALABRAS RESERVADAS
"if"                    return 'IF'
"else"                  return 'ELSE'
"while"                 return 'WHILE'
"true"                  return 'TRUE'
"false"                 return 'FALSE'
"console.log"           return 'CONSOLELOG'
"do"                    return 'DO'
"let"                   return 'LET'
"const"                 return 'CONST'
"number"                return 'TIPONUMBER'
"string"                return 'TIPOSTRING'
"boolean"               return 'TIPOBOOLEAN'
"switch"                return 'SWITCH'
"case"                  return 'CASE'
"default"               return 'DEFAULT'

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
    |error ';'  
    {
        //console.log("Error vino"+yytext+" vino "+ @1.first_line+" "+  @1.first_column, " se esperaba "+ (this.terminals_[symbol] || symbol));
        console.log("->>>>MARCANDO ERROR SINTACTICO");
        error = new Error_(@1.first_line, @1.first_column, 'Sintactico', 'Error Sintactico: " ' + yytext + ' ",  no se esperaba');
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


Statement
    : '{' Instrucciones '}' 
    {
        $$ = new Statement($2, @1.first_line, @1.first_column);
    }
    | '{' '}' {
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
        $$ = new ElementoDeclaracion(TipoDeclaracion.ID_TIPO_VALOR,$1,$3,$5);
    }
    |ID ':' TipoNormal
    {
        $$ = new ElementoDeclaracion(TipoDeclaracion.ID_TIPO,$1,$3,null);
    }
    |ID '=' Expr
    {
        $$ = new ElementoDeclaracion(TipoDeclaracion.ID_VALOR,$1,null,$3);
    }
    |ID
    {
        $$ = new ElementoDeclaracion(TipoDeclaracion.ID,$1, null, null);
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
    | ID{
        $$ = new Acceso($1, @1.first_line, @1.first_column);
    };
