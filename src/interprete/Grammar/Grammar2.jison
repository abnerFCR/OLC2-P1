
%{
    const { Nodo } = require('../Arbol/Nodo');
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
        $$ = new Nodo("Instrucciones");
        $$.add($1);
        $$.add($2);
    }
    |Instruccion
    {
        $$ = new Nodo("Instrucciones",0);
        $$.add($1);
    }
;

Instruccion
    : Imprimir
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |DeclaracionVariable
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |AsignacionVariable ';'
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |IfSt
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |WhileSt
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |DoWhileSt
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |SwitchSt
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |IncreDecre ';'
    {
        $$= new Nodo("Instruccion",0);
        $$.add($1);
    }
    |DefinicionTypes ';'
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |GraficarTs ';'
    {
        $$ = new Nodo("GraficarTs",0);
    }
    |'BREAK' ';'
    {
        $$ = new Nodo("Break",0);
    }
    |'CONTINUE' ';'
    {
        $$ = new Nodo("Continue",0);
    }
    |DeclaracionArreglos ';'
    {
        $$ = new Nodo("Decl. Arreglo",0);
        $$.add($1);
    }
    |ForNormal 
    {
        $$ = new Nodo("For1",0);
        $$.add($1);
    }
    |ForOf 
    {
        $$ = new Nodo("For2",0);
        $$.add($1);
    }
    |ForIn 
    {
        $$ = new Nodo("For3",0);
        $$.add($1);
    }
    |Funcion 
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |ID '(' ListaExpr ')' ';'
    {
        $$ = new Nodo("Llamada",0);
        $$.add(new Nodo($1,0));
        $$.add($3);
    }
    |ID '('')' ';'
    {
        $$ = new Nodo("Llamada",0);
        $$.add(new Nodo($1,0));
    }
    |ID  '=' '{' ListaValoresTipo '}' ';'
    {
        $$ = new Nodo("Asig. Indv",0);
        $$.add(new Nodo($1,0));
        $$.add($4);
    }
    |'RETURN' Expr ';'
    {
        $$ = new Nodo("Return",0);
        $$.add($2);
    }
    |'RETURN' ';'
    {
        $$ = new Nodo("Return",0);
    }
    |AsigIndividual '=' Expr ';'
    {
        $$ = new Nodo("Asig. Indiv.",0);
        $$.add($1);
        $$.add($3);
    }
    |AsigIndividual '=' '['']' ';'
    {
        $$ = new Nodo("Asig. Indiv.",0);
        $$.add($1);
        $$.add(new Nodo("[]",0));
    }
;

Funcion
    :'FUNCTION' ID '(' ListaParametros ')' ':' TiposFuncion StatementFuncion
    {
        $$ = new Nodo("Elem. Decla",0);
        $$.add(new Nodo($2,0));
        $$.add($4);
        $$.add($7);
        $$.add($8);
    }
    |'FUNCTION' ID '(' ListaParametros ')' StatementFuncion
    {
        $$ = new Nodo("Funcion",0);
        $$.add(new Nodo($2,0));
        $$.add($4);
        $$.add($6);
    }
    |'FUNCTION' ID '(' ')' ':' TiposFuncion StatementFuncion
    {
        $$ = new Nodo("Funcion",0);
        $$.add(new Nodo($2,0));
        $$.add($6);
        $$.add($7);
    }
    |'FUNCTION' ID '(' ')' StatementFuncion
    {
        $$ = new Nodo("Funcion",0);
        $$.add(new Nodo($2,0));
        $$.add($5);
    }
;

ListaParametros
    :ElementoParametro ListaParametrosPrima
    {
        $$ = new Nodo("Lista Par.",0);
        $$.add($1);
        $$.add($2);
    }
;

ListaParametrosPrima
    : ',' ElementoParametro ListaParametrosPrima
    {
        $$ = new Nodo("Lista Par. Prima",0);
        $$.add($2);
        $$.add($3); 
    }
    |{
        $$ = new Nodo("Epsilon",0);
    }
;

ElementoParametro
    :ElementoDeclaracion
    {
        $$ = new Nodo("Elemento Parametro",0);
        $$.add($1);
    }
    |ID ':' Tipos ListaCorh
    {
        $$ = new Nodo("Elemento Parametro",0);
        $$.add(new Nodo($1,0));
        $$.add($3);
    }
;

ListaCorh
    :ListaCorh '['']'
    |'['']'
;

TiposFuncion
    :TipoNormal
    {
        $$ = new Nodo("Tipos Funcion",0);
        $$.add($1);
    }
    |'TIPOVOID'
    {
        $$ = new Nodo("Tipos Funcion",0);
        $$.add(new Nodo("Void",0));
    }
    |ID
    {
        $$ = new Nodo("Tipos Funcion",0);
        $$.add(new Nodo($1,0));;
    }
    |TipoNormal ListaCorh
    {
        $$ = new Nodo("Tipos Funcion",0);
        $$.add(new Nodo("Array",0));
    }
;

Imprimir
    :CONSOLELOG '(' ListaExpr ')' ';'
    {
        $$ = new Nodo("Imprimir",0);
        $$.add($3);
    }
;

GraficarTs
    :'GRAFICAR_TS' '(' ')'
    {
        $$ = new Nodo("Graficarts",0);
    }
;

DeclaracionVariable
    : 'LET' ListaDeclaraciones ';' 
    {
        $$ = new Nodo("Decla. Var.",0);
        $$.add($2);
    }
    | 'CONST' ListaDeclaraciones ';'
    {
        $$ = new Nodo("Decla. Var.",0);
        $$.add($2);
    }   
; 

AsignacionVariable
    : ID '=' Expr 
    {
        $$ = new Nodo("Asig Var.",0);
        $$.add(new Nodo($1,0));
        $$.add($3);
    }
;

IfSt
    : 'IF' '(' Expr ')' Statement ElseSt
    {
        $$ = new Nodo("If",0);
        $$.add($3);
        $$.add($5);
        $$.add($6);
    }
;

ElseSt
    : 'ELSE' Statement
    {
        $$ = new Nodo("Else",0);
        $$.add($2);
    } 
    | 'ELSE' IfSt
    {
        $$ = new Nodo("Else",0);
        $$.add($2);
    }
    | 
    {
        $$ = new Nodo("Epsilon",0);    
    }
;

WhileSt
    : 'WHILE' '(' Expr ')' Statement
    {
        $$ = new Nodo("Elem. Decla",0);
        $$.add($3);
        $$.add($5);
    }
;

DoWhileSt
    : 'DO' Statement 'WHILE' '(' Expr ')' ';'
    {
        $$ = new Nodo("Do While",0);
        $$.add($2);
        $$.add($5);
    }
;

ForNormal
    :'FOR' '(' DeclaracionVariable Expr ';' OpcAsignacion ')' Statement
    {
        $$ = new Nodo("For1",0);
        $$.add($3);
        $$.add($4);
        $$.add($6);
        $$.add($8);
    }
;

OpcAsignacion
    :AsignacionVariable
    {
        $$ = new Nodo("Opc. asig",0);
        $$.add($1);
    }
    |IncreDecre
    {
        $$ = new Nodo("Opc. asig",0);
        $$.add($1);
    }
;

SwitchSt
    : 'SWITCH' '(' Expr ')' '{' ListaCasos '}' 
    {
        $$ = new Nodo("Switch",0);
        $$.add($3);
        $$.add($6);
    }
;

ListaCasos
    : ListaCasos Caso 
    {
        $$ = new Nodo("Lista Casos",0);
        $$.add($1);
        $$.add($2);
    }
    |Caso 
    {
        $$ = new Nodo("Lista Casos",0);
        $$.add($1);
    }
;

Caso
    : 'CASE' Expr ':' Statement
    {
        $$ = new Nodo("Caso",0);
        $$.add($2);
        $$.add($4);
    }
    | 'DEFAULT' ':' Statement
    {
        $$ = new Nodo("Caso",0);
        $$.add(new Nodo("Default",0));
        $$.add($3);
    }
    | 'CASE' Expr ':' Instrucciones
    {
        $$ = new Nodo("Caso",0);
        $$.add($2);
        $$.add($4);
    }
    | 'DEFAULT' ':' Instrucciones
    {
        $$ = new Nodo("Caso",0);
        $$.add(new Nodo("Default",0));
        $$.add($3);
    }
;

IncreDecre
    : ID '++'
    {   
        $$ = new Nodo("Incre Decre",0);
        $$.add(new Nodo($1,0));
        $$.add(new Nodo("++",0));
    }
    |ID '--'
    {
        $$ = new Nodo("Incre Decre",0);
        $$.add(new Nodo($1,0));
        $$.add(new Nodo("--",0));
    }
;

Statement
    : '{' Instrucciones '}' 
    {
        $$ = new Nodo("Statement",0);
        $$.add($2);
    }
    | '{' '}' 
    {
        $$ = new Nodo("Statement",0);
    }
;

ListaDeclaraciones
    :ListaDeclaraciones ',' ElementoDeclaracion
    {
        $$ = new Nodo("Lista Decla.",0);
        $$.add($1);
        $$.add($3);
    }
    |ElementoDeclaracion
    {
        $$ = new Nodo("Lista Decla.",0);
        $$.add($1);
    }
;

ElementoDeclaracion
    :ID ':' TipoNormal '=' Expr
    {
        $$ = new Nodo("Elem. Decla",0);
        $$.add(new Nodo($1,0));
        $$.add($3);
        $$.add($5);
    }
    |ID ':' TipoNormal
    {
        $$ = new Nodo("Elem. Decla",0);
        $$.add(new Nodo($1,0));
        $$.add($3);
    }
    |ID '=' Expr
    {
        $$ = new Nodo("Elem. Decla",0);
        $$.add(new Nodo($1,0));
        $$.add($3);
    }
    |ID
    {
        $$ = new Nodo("Elem. Decla",0);
        $$.add(new Nodo($1,0));
    }
    |ID ':' ID
    {
        $$ = new Nodo("Elem. Decla",0);
        $$.add(new Nodo($1,0));
        $$.add(new Nodo($3,0));
    }
    |ID ':' ID '=' '{' ListaValoresTipo '}'
    {
        $$ = new Nodo("Elem. Decla",0);
        $$.add(new Nodo($1,0));
        $$.add(new Nodo($3,0));
        $$.add($6);
    }
    |ID ':' ID '=' Expr
    {
        $$ = new Nodo("Elem. Decla",0);
        $$.add(new Nodo($1,0));
        $$.add(new Nodo($3,0));
        $$.add($5);
    }
;

ListaValoresTipo
    :ListaValoresTipo ',' ValorType
    {
        $$ = new Nodo("Lista Val. Tipo",0);
        $$.add($1);
        $$.add($3);
    }
    |ValorType
    {
        $$ = new Nodo("Lista Val. Tipo",0);
        $$.add($1);
    }
;

ValorType
    :ID ':' Expr
    {
        $$ = new Nodo("Valor Type",0);
        $$.add(new Nodo($1,0));
        $$.add($3);
    }
    |ID ':' '{' ListaValoresTipo '}'
    {
        $$ = new Nodo("Valor Types",0);
        $$.add(new Nodo($1,0));
        $$.add($4);
    }
;

TipoNormal
    :'TIPOSTRING'
    {
        $$ = new Nodo("Tipo Normal",0);
        $$.add(new Nodo($1,0));
    }
    |'TIPOBOOLEAN'
    {
        $$ = new Nodo("Tipo Normal",0);
        $$.add(new Nodo($1,0));
    }
    |'TIPONUMBER'
    {
        $$ = new Nodo("Tipo Normal",0);
        $$.add(new Nodo($1,0));
    }
;

DefinicionTypes
    : 'TYPE' ID '=' '{' ListaDefiniciones '}'
    {
        $$ = new Nodo("Def. Types",0);
        $$.add(new Nodo($2,0));
        $$.add($5);
    }
;

ListaDefiniciones
    : ListaDefiniciones ',' DefinicionAtributo
    {
        $$ = new Nodo("Lista Def.",0);
        $$.add($1);
        $$.add($3);
    }
    |DefinicionAtributo
    {
        $$ = new Nodo("Lista Def.",0);
        $$.add($1);
    }
;

DefinicionAtributo
    :ID ':' ID
    {
        $$ = new Nodo("Def. Atributo",0);
        $$.add(new Nodo($1,0));
        $$.add(new Nodo($3,0));
    }
    |ID ':' TipoNormal
    {
        $$ = new Nodo("Def. Atributo",0);
        $$.add(new Nodo($1,0));
        $$.add($3);
    }
;

DeclaracionArreglos
    :ListaDimensiones '=' '[' ValoresArreglo ']'
    {
        $$ = new Nodo("Decla. Arreglos",0);
        $$.add($1);
        $$.add($4);
    }
    |ListaDimensiones '=' '[' ListaExpr ']'
    {
        $$ = new Nodo("Decla. Arreglos",0);
        $$.add($1);
        $$.add($4);
    }
    |ListaDimensiones '=' '['']'
    {
        $$ = new Nodo("Decla. Arreglos",0);
        $$.add($1);
    }
    |ListaDimensiones
    {
        $$ = new Nodo("Decla. Arreglos",0);
        $$.add($1);
    }
;

ListaDimensiones
    :ListaDimensiones '[' ']'
    {   
        $$ = new Nodo("Lista Dim.",0);
        $$.add($1);
    } 
    |'LET' ID ':' Tipos '[' ']'
    {
        $$ = new Nodo("Lista Dim.",0);
        $$.add(new Nodo($2,0));
        $$.add($4);
    }
    |'CONST' ID ':' Tipos '[' ']'
    {
        $$ = new Nodo("Lista Dim.",0);
        $$.add(new Nodo($2,0));
        $$.add($4);
    }

;

ValoresArreglo
    :ValoresArreglo ',' ValorArreglo
    {
        $$ = new Nodo("Valores Arreglo",0);
        $$.add($1);
        $$.add($3);
        
    }
    |ValorArreglo
    {
        $$ = new Nodo("Valores Arreglo",0);
        $$.add($1);
    }
;

ValorArreglo
    :'[' ListaExpr ']'
    {
        $$ = new Nodo("Valor Arreglo",0);
        $$.add($2);
    }
    |'[' ValoresArreglo ']'
    {   
        $$ = new Nodo("Valor Arreglo",0);
        $$.add($2);
    }
;

ListaExpr
    :ListaExpr ',' Expr
    {
        $$ = new Nodo("Lista Expr",0);
        $$.add($1);
        $$.add($3);
    }
    |Expr
    {
        $$ = new Nodo("Lista Expr",0);
        $$.add($1);
    }
;

Tipos
    :TipoNormal
    {
        $$ = new Nodo("Tipos",0);
        $$.add($1);
    }
    |ID
    {
        $$ = new Nodo("Tipos",0);
        $$.add(new Nodo($1,0));
    }
;

Expr
    : Expr '+' Expr
    {
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("+",0));
        $$.add($3);
    }       
    | Expr '-' Expr
    {
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("-",0));
        $$.add($3);
    }
    | Expr '*' Expr
    { 
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("*",0));
        $$.add($3);
    }       
    | Expr '/' Expr
    {
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("/",0));
        $$.add($3);
    }
    | Expr '**' Expr
    {
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("**",0));
        $$.add($3);
    }
    | Expr '%' Expr
    {
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("%",0));
        $$.add($3);
    }
    | '-' Expr
    {
        $$ = new Nodo("E",0);
        $$.add(new Nodo("-",0));
        $$.add($2);
    }
    | Expr '++'
    {
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("++",0));
    }
    | Expr '--' 
    {
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("--",0));
    }
    | Expr '||' Expr
    {
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("||",0));
        $$.add($3);
    }
    | Expr '&&' Expr
    { 
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("&&",0));
        $$.add($3);
    }
    | '!' Expr
    { 
        $$ = new Nodo("E",0);
        $$.add(new Nodo("!",0));
        $$.add($2);
    }   
    | Expr '>=' Expr
    {
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo(">=",0));
        $$.add($3);
    }
    | Expr '<=' Expr
    { 
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("<=",0));
        $$.add($3);
    }    
    | Expr '>' Expr
    {
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo(">",0));
        $$.add($3);
    }
    | Expr '<' Expr
    {
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("<",0));
        $$.add($3);
    }
    | Expr '==' Expr
    {
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("==",0));
        $$.add($3);
    }
    | Expr '!=' Expr
    { 
        $$ = new Nodo("E",0);
        $$.add($1);
        $$.add(new Nodo("!=",0));
        $$.add($3);
    }
    | F
    {
        $$ = new Nodo("F",0);
        $$.add($1);
    }
;


F   : '(' Expr ')'
    { 
        $$ = new Nodo("F", 0);
        $$.add($2);
    }
    | DECIMAL
    { 
        $$ = new Nodo("Decimal", 0);
        $$.add(new Nodo($1,0));
    }
    | NUMBER
    { 
        $$ = new Nodo("Numero", 0);
        $$.add(new Nodo($1,0));
    }
    | STRING
    {
        $$ = new Nodo("String", 0);
        $$.add(new Nodo($1.slice(1,-1),0));
    }
    | STRING2
    {
        $$ = new Nodo("String", 0);
        $$.add(new Nodo($1.slice(1,-1),0));
    }
    | STRING3
    {
        $$ = new Nodo("String", 0);
        $$.add(new Nodo($1.slice(1,-1),0));
    }
    | TRUE
    {
        $$ = new Nodo("True", 0);
    }
    | FALSE
    {
        $$ = new Nodo("False", 0);
    }
    |NuevoAcceso
    {
        $$ = new Nodo("Nuevo Acceso",0);
        $$.add($1);
    }
    |NULL 
    {
        $$ = new Nodo("Null",0);
    }
    |ID '(' ListaExpr ')' 
    {
        $$ = new Nodo("Llamada",0);
        $$.add(new Nodo($1,0));
        $$.add($3);
    }
    |ID '(' ')' 
    {
        $$ = new Nodo("Llamada", 0);
        $$.add(new Nodo($1,0));
    }
    | Expr '?' Expr ':' Expr
    {
        $$ = new Nodo("F",0);
        $$.add($1);
        $$.add($3);
        $$.add($5);
    }
    
;

NuevoAcceso
    :Accesos
    {
        $$ = new Nodo("Nuevo Acceso",0);
        $$.add($1);
    }
    |Acceso
    {
        $$ = new Nodo("Nuevo Acceso",0);
        $$.add($1);
    }
    |ID FuncionArreglo
    {
        $$ = new Nodo("Nuevo Acceso",0);
        $$.add(new Nodo($1,0));
        $$.add($2);
    }
;

Acceso
    :ID
    {
        $$ = new Nodo("Acceso",0);
        $$.add(new Nodo($1,0));
    }
;

Accesos
    :Accesos '.' ID
    {
        $$ = new Nodo("Accesos",0);
        $$.add($1);
        $$.add(new Nodo($3,0));
    }
    |Accesos '[' Expr ']'
    {
        $$ = new Nodo("Accesos",0);
        $$.add($1);
        $$.add($3);
    }
    |Accesos '[' Expr ']' FuncionArreglo
    {
        $$ = new Nodo("Accesos",0);
        $$.add($1);
        $$.add($3);
        $$.add($5);
    }
    |ID '.' ID 
    {
        $$ = new Nodo("Accesos",0);
        $$.add(new Nodo($1,0));
        $$.add(new Nodo($3,0));
    }
    |ID '[' Expr ']' FuncionArreglo
    {
        $$ = new Nodo("Accesos",0);
        $$.add(new Nodo($1,0));
        $$.add($3);
        $$.add($5);
    }
    |ID '[' Expr ']'
    {
        $$ = new Nodo("Accesos",0);
        $$.add(new Nodo($1,0));
        $$.add($3);
    }
    
;

FuncionArreglo
    :'POP' '(' ')' 
    {
        $$ = new Nodo("Pop",0);
    }
    |'PUSH' '(' Expr ')'
    {
        $$ = new Nodo("Push",0);
        $$.add($3);
    }
    |'LENGTH'
    {
        $$ = new Nodo("Length",0);
    }
;


AsigIndividual
    :AsigIndividual '[' Expr ']' 
    {
        $$ = new Nodo("Asg. Ind.",0);
        $$.add($1);
        $$.add($3);
    }
    |ID '[' Expr ']'
    {
        $$ = new Nodo("Asg. Ind.",0);
        $$.add($1);
        $$.add($3);
    }
    |AsigIndividual '.' ID 
    {
        $$ = new Nodo("Asg. Ind.",0);
        $$.add($1);
        $$.add(new Nodo($3,0));
    }
    |ID '.' ID
    {
        $$ = new Nodo("Asg. Ind.",0);
        $$.add(new Nodo($1,0));
        $$.add(new Nodo($3,0));
    }
;

StatementFuncion
    : '{' InstruccionesFuncion '}' 
    {
        $$ = new Nodo("Statement Func.",0);
        $$.add($2);
    }
    | '{' '}' 
    {
        $$ = new Nodo("Epsilon",0);
    }
;

InstruccionesFuncion
    :InstruccionFuncion InstruccionesFuncionPrima
    {
        $$ = new Nodo("Inst. Funcion");
        $$.add($1);
        $$.add($2);
    }
;
InstruccionesFuncionPrima
    :InstruccionFuncion InstruccionesFuncionPrima
    {
        $$ = new Nodo("Instr. Funcion Prima",0);
        $$.add($1); 
        $$.add($2); 
    }
    |
    {
        $$ = new Nodo("Epsilon",0);
    }
;

InstruccionFuncion
    : Imprimir
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |DeclaracionVariable
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |AsignacionVariable ';'
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |IfSt
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |WhileSt
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |DoWhileSt
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |SwitchSt
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |IncreDecre ';'
    {
        $$= new Nodo("Instruccion",0);
        $$.add($1);
    }
    |DefinicionTypes ';'
    {
        $$ = new Nodo("Instruccion",0);
        $$.add($1);
    }
    |GraficarTs ';'
    {
        $$ = new Nodo("GraficarTs",0);
    }
    |'BREAK' ';'
    {
        $$ = new Nodo("Break",0);
    }
    |'CONTINUE' ';'
    {
        $$ = new Nodo("Continue",0);
    }
    |DeclaracionArreglos ';'
    {
        $$ = new Nodo("Decl. Arreglo",0);
        $$.add($1);
    }
    |ForNormal 
    {
        $$ = new Nodo("For1",0);
        $$.add($1);
    }
    |ForOf 
    {
        $$ = new Nodo("For2",0);
        $$.add($1);
    }
    |ForIn 
    {
        $$ = new Nodo("For3",0);
        $$.add($1);
    }
    |ID '(' ListaExpr ')' ';'
    {
        $$ = new Nodo("Llamada",0);
        $$.add(new Nodo($1,0));
        $$.add($3);
    }
    |ID '('')' ';'
    {
        $$ = new Nodo("Llamada",0);
        $$.add(new Nodo($1,0));
    }
    |ID  '=' '{' ListaValoresTipo '}' ';'
    {
        $$ = new Nodo("Asig. Indv",0);
        $$.add(new Nodo($1,0));
        $$.add($4);
    }
    |'RETURN' Expr ';'
    {
        $$ = new Nodo("Return",0);
        $$.add($2);
    }
    |'RETURN' ';'
    {
        $$ = new Nodo("Return",0);
    }
    |AsigIndividual '=' Expr ';'
    {
        $$ = new Nodo("Asig. Indiv.",0);
        $$.add($1);
        $$.add($3);
    }
    |AsigIndividual '=' '['']' ';'
    {
        $$ = new Nodo("Asig. Indiv.",0);
        $$.add($1);
        $$.add(new Nodo("[]",0));
    }
;

ForOf
    :'FOR' '(' 'LET' ID 'OF' Expr')' Statement
    {
        $$ = new Nodo("ForOf",0);
        $$.add(new Nodo($4,0));
        $$.add($6);
        $$.add($8);
    }
    |'FOR' '(' 'CONST' ID 'OF' Expr')' Statement
    {
        $$ = new Nodo("ForOf",0);
        $$.add(new Nodo($4,0));
        $$.add($6);
        $$.add($8);
    }
;

ForIn
    :'FOR' '(' 'LET' ID 'IN' Expr')' Statement
    {
        $$ = new Nodo("ForOf",0);
        $$.add(new Nodo($4,0));
        $$.add($6);
        $$.add($8);
    }
    |'FOR' '(' 'CONST' ID 'IN' Expr')' Statement
    {
        $$ = new Nodo("ForOf",0);
        $$.add(new Nodo($4,0));
        $$.add($6);
        $$.add($8);
    }
; 


