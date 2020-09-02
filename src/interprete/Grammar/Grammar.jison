 
%{
    const {Aritmetica, OperacionAritmetica} = require('../Expresion/Aritmetica');
    const {Relacional, OperacionRelacional} = require('../Expresion/Relacional');
    const {Literal} = require('../Expresion/Literal');
    const {Imprimir } =require('../Instrucciones/Imprimir');
%}

%lex
%options case-insensitive
number  [0-9]+
decimal {number}"."{number}
string  (\"[^"]*\")
%%
\s+                   /* skip whitespace */

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

//PALABRAS RESERVADAS
"if"                    return 'IF'
"else"                  return 'ELSE'
"while"                 return 'WHILE'
"print"                 return 'PRINT'
"break"                 return 'BREAK'
"function"              return 'FUNCTION'
"true"                  return 'TRUE'
"false"                 return 'FALSE'
"console.log"           return 'CONSOLELOG'



([a-zA-Z_])[a-zA-Z0-9_ñÑ]*	return 'ID';
<<EOF>>		            return 'EOF'


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
;

Imprimir
    : CONSOLELOG '(' Expr ')' ';'
    {
        $$ = new Imprimir($3, @1.first_line, @1.first_column);
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
    {console.log("Me equivoque");
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
        $$ = new Literal($1.replace(/\"/g,""), @1.first_line, @1.first_column, 2);
    }
    | TRUE
    {
        $$ = new Literal(true, @1.first_line, @1.first_column, 3);
        
    }
    | FALSE
    {
        $$ = new Literal(false, @1.first_line, @1.first_column, 3);
    }
;



/*
| ID{
        $$ = new Access($1, @1.first_line, @1.first_column);
    }
*/