%{
    const { Nodo } = require('../Arbol/Nodo');
    const { cuadro_texto } = require("../Abstracto/Retorno");
    let contenido = "";
    let funcionInterna =[];
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
        //contenido = contenido + $1;
        cuadro_texto.traducir = cuadro_texto.traducir + $1;
        let nuevo = cuadro_texto.traducir;
        return nuevo;
        //return $1;
    } 
;

Instrucciones
    : Instrucciones Instruccion
    {
        $$ = $1+" "+$2;
    }
    |Instruccion
    {
        $$ = $1;
    }
;

Instruccion
    : Imprimir
    {
        $$ = $1+"\n";
    }
    |DeclaracionVariable
    {
        $$ = $1+"\n";
    }
    |AsignacionVariable ';'
    {
        $$ = $1+";\n";
    }
    |IfSt
    {
        $$ = $1;
    }
    |WhileSt
    {
        $$ = $1;
    }
    |DoWhileSt
    {
        $$=$1;
    }
    |SwitchSt
    {
        $$ = $1;
    }
    |IncreDecre ';'
    {
        $$ = $1+";\n";
    }
    |DefinicionTypes ';'
    {
        $$ = $1+";\n";
    }
    |GraficarTs ';'
    {
        $$ = $1+";\n";
    }
    |'BREAK' ';'
    {
        $$ = $1+";\n";
    }
    |'CONTINUE' ';'
    {
        $$ = $1+";\n";
    }
    |DeclaracionArreglos ';'
    {
        $$ = $1 + ";\n";
    }
    |ForNormal 
    {
        $$ = $1;
    }
    |Funcion
    {
        $$=$1;
    }
    |ForOf 
    {
        $$ = $1;
    }
    |ForIn 
    {
        $$ = $1;
    }
    |ID '(' ListaExpr ')' ';'
    {
        $$ = $1+"  ("+$3+");\n";
    }
    |ID '('')' ';'
    {
        $$ = $1+"();\n";
    }
    |ID  '=' '{' ListaValoresTipo '}' ';'
    {
        $$ = $1 + " = {\n"+$4+"\n}\n;";
    }
    |'RETURN' Expr ';'
    {
        $$ = "return "+$2+";\n";
    }
    |'RETURN' ';'
    {
        $$ = "return;\n";
    }
    |AsigIndividual '=' Expr ';'
    {
        $$ = $1+" = "+$3+";\n";
    }
    |AsigIndividual '=' '['']' ';'
    {
        $$ = $1 + " = [];\n";
    }
;

Funcion
    :'FUNCTION' ID '(' ListaParametros ')' ':' TiposFuncion StatementFuncion
    {
        $$ = "function "+$2+"("+$4+"):"+$7+" "+$8;
    }
    |'FUNCTION' ID '(' ListaParametros ')' StatementFuncion
    {
        $$ = "function "+$2+"("+$4+")"+$6;
    }
    |'FUNCTION' ID '(' ')' ':' TiposFuncion StatementFuncion
    {
        $$ = "function "+$2+"():"+$6+" "+$7;
    }
    |'FUNCTION' ID '(' ')' StatementFuncion
    {
        $$ = "function "+$2+"()"+$5;
    }
;

ListaParametros
    :ElementoParametro ListaParametrosPrima
    {
        $$ = $1+$2;
    }
;

ListaParametrosPrima
    : ',' ElementoParametro ListaParametrosPrima
    {
        $$ = ", "+$2+$3; 
    }
    |{
        $$ = "";
    }
;

ElementoParametro
    :ElementoDeclaracion
    {
        $$ = $1;
    }
    |ID ':' Tipos ListaCorh
    {
        $$ = $1+":"+$3+$4;
    }
;

ListaCorh
    :ListaCorh '['']'
    {
        $$=$1+"[]"
    }
    |'['']'
    {
        $$="[]";
    }
;

TiposFuncion
    :TipoNormal
    {
        $$ = $1;
    }
    |'TIPOVOID'
    {
        $$ = $1;
    }
    |ID
    {
        $$ = $1;
    }
    |TipoNormal ListaCorh
    {
        $$ = $1;
    }
;

Imprimir
    :CONSOLELOG '(' ListaExpr ')' ';'
    {
        $$ = "console.log("+$3+");";
    }
;

GraficarTs
    :'GRAFICAR_TS' '(' ')'
    {
        $$ = "graficar_ts()";
    }
;

DeclaracionVariable
    : 'LET' ListaDeclaraciones ';' 
    {
        $$ = "let "+$2+";"
    }
    | 'CONST' ListaDeclaraciones ';'
    {
        $$ = "const "+$2+";"
    }   
; 

AsignacionVariable
    : ID '=' Expr 
    {
        $$ = $1+" = "+$3;
    }
;

IfSt
    : 'IF' '(' Expr ')' Statement ElseSt
    {
        $$ = "if("+$3+")"+$5+$6;
    }
;

ElseSt
    : 'ELSE' Statement
    {
        $$ = "else "+$2;
    } 
    | 'ELSE' IfSt
    {
        $$ = "else "+$2;
    }
    | 
    {
        $$ = "";    
    }
;

WhileSt
    : 'WHILE' '(' Expr ')' Statement
    {
        $$ = "while("+$3+")"+$5;
    }
;

DoWhileSt
    : 'DO' Statement 'WHILE' '(' Expr ')' ';'
    {
        $$ = "do"+$2+"while("+$5+");\n";
    }
;

ForNormal
    :'FOR' '(' DeclaracionVariable Expr ';' OpcAsignacion ')' Statement
    {
        $$ = "for("+$3+" "+$4+"; "+$6+")"+$8;
    }
;

OpcAsignacion
    :AsignacionVariable
    {
        $$ = $1;
    }
    |IncreDecre
    {
        $$ = $1;
    }
;

SwitchSt
    : 'SWITCH' '(' Expr ')' '{' ListaCasos '}' 
    {
        $$ = "switch("+$3+"){\n"+$6+"\n}\n";
    }
;

ListaCasos
    : ListaCasos Caso 
    {
        $$ = $1+" "+$2;
    }
    |Caso 
    {
        $$ = $1;
    }
;

Caso
    : 'CASE' Expr ':' Statement
    {
        $$ = "case "+$2+":"+$4;
    }
    | 'DEFAULT' ':' Statement
    {
        $$ = "default:" +$3;
    }
    | 'CASE' Expr ':' Instrucciones
    {
        $$ = "case "+$2+":"+$4;
    }
    | 'DEFAULT' ':' Instrucciones
    {
        $$ = "default:" +$3;
    }
;

IncreDecre
    : ID '++'
    {   
        $$ = $1+"++";
    }
    |ID '--'
    {
        $$=$1+"--";
    }
;

Statement
    : '{' Instrucciones '}' 
    {
        $$ = "{\n"+$2+"\n}\n";
    }
    | '{' '}' 
    {
        $$ = "{ }\n";
    }
;

ListaDeclaraciones
    :ListaDeclaraciones ',' ElementoDeclaracion
    {
        $$ = $1+", "+$3;
    }
    |ElementoDeclaracion
    {
        $$ = $1;
    }
;

ElementoDeclaracion
    :ID ':' TipoNormal '=' Expr
    {
        $$ = $1 + ":"+$3+" = "+$5;
    }
    |ID ':' TipoNormal
    {
        $$ = $1+" : "+$3;
    }
    |ID '=' Expr
    {
        $$ = $1 +"="+$3;
    }
    |ID
    {
        $$ = $1;
    }
    |ID ':' ID
    {
        $$ = $1+":"+$3;
    }
    |ID ':' ID '=' '{' ListaValoresTipo '}'
    {
        $$ = $1 + ":"+$3+" = {\n"+$6+"\n}\n";
    }
    |ID ':' ID '=' Expr
    {
        $$ = $1 + ":"+$3+"="+$5;
    }
;

ListaValoresTipo
    :ListaValoresTipo ',' ValorType
    {
        $$ = $1+", "+$3;
    }
    |ValorType
    {
        $$ = $1;
    }
;

ValorType
    :ID ':' Expr
    {
        $$ = $1+":"+$3;
    }
    |ID ':' '{' ListaValoresTipo '}'
    {
        $$ = $1+" : {\n"+$4+"\n}\n";
    }
;

TipoNormal
    :'TIPOSTRING'
    {
        $$ = $1;
    }
    |'TIPOBOOLEAN'
    {
        $$ = $1;
    }
    |'TIPONUMBER'
    {
        $$ = $1;
    }
;

DefinicionTypes
    : 'TYPE' ID '=' '{' ListaDefiniciones '}'
    {
        $$ = "type "+$2+" = {\n"+$5+"\n}\n";
    }
;

ListaDefiniciones
    : ListaDefiniciones ',' DefinicionAtributo
    {
        $$ = $1+", "+$3;
    }
    |DefinicionAtributo
    {
        $$ = $1;
    }
;

DefinicionAtributo
    :ID ':' ID
    {
        $$ = $1+":"+$3;
    }
    |ID ':' TipoNormal
    {
        $$ = $1+":"+$3;
    }
;

DeclaracionArreglos
    :ListaDimensiones '=' '[' ValoresArreglo ']'
    {
        $$ = $1+"= ["+$4+"]";
    }
    |ListaDimensiones '=' '[' ListaExpr ']'
    {
        $$ = $1+"= ["+$4+"]";
    }
    |ListaDimensiones '=' '['']'
    {
        $$ = $1+" = []";
    }
    |ListaDimensiones
    {
        $$ = $1;
    }
;

ListaDimensiones
    :ListaDimensiones '[' ']'
    {   
        $$ = $1+"[]";
    } 
    |'LET' ID ':' Tipos '[' ']'
    {
        $$ = "let "+$2+":"+$4+"[]";
    }
    |'CONST' ID ':' Tipos '[' ']'
    {
        $$ = "const "+$2+":"+$4+"[]";
    }

;

ValoresArreglo
    :ValoresArreglo ',' ValorArreglo
    {
        $$ = $1 + ", " +$3;
        
    }
    |ValorArreglo
    {
        $$ = $1;
    }
;

ValorArreglo
    :'[' ListaExpr ']'
    {
        $$ = "["+$2+"]";
    }
    |'[' ValoresArreglo ']'
    {   
        $$ = "["+$2+"]";
    }
;

ListaExpr
    :ListaExpr ',' Expr
    {
        $$ = $1 +", "+$3;
    }
    |Expr
    {
        $$ = $1;
    }
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
        $$ = $1 + "+" +$3;
    }       
    | Expr '-' Expr
    {
        $$ = $1 + "-" +$3;
    }
    | Expr '*' Expr
    { 
        $$ = $1 + "*" +$3;
    }       
    | Expr '/' Expr
    {
        $$ = $1 + "/" +$3;
    }
    | Expr '**' Expr
    {
        $$ = $1 + "**" +$3;
    }
    | Expr '%' Expr
    {
        $$ = $1 + "%" +$3;
    }
    | '-' Expr
    {
        $$ = "-" +$2;
    }
    | Expr '++'
    {
        $$ = $1 + "++";
    }
    | Expr '--' 
    {
        $$ = $1 + "--";
    }
    | Expr '||' Expr
    {
        $$ = $1 + "||" +$3;
    }
    | Expr '&&' Expr
    { 
        $$ = $1 + "&&" +$3;
    }
    | '!' Expr
    { 
        $$ = "!" +$2;
    }   
    | Expr '>=' Expr
    {
        $$ = $1 + ">=" +$3;
    }
    | Expr '<=' Expr
    { 
        $$ = $1 + "<=" +$3;
    }    
    | Expr '>' Expr
    {
        $$ = $1 + ">" +$3;
    }
    | Expr '<' Expr
    {
        $$ = $1 + "<" +$3;
    }
    | Expr '==' Expr
    {
        $$ = $1 + "==" +$3;
    }
    | Expr '!=' Expr
    { 
        $$ = $1 + "!=" +$3;
    }
    | F
    {
        $$ = $1;
    }
;


F   : '(' Expr ')'
    { 
        $$ = "("+$2+")";
    }
    | DECIMAL
    { 
        $$ = $1;
    }
    | NUMBER
    { 
        $$ = $1;
    }
    | STRING
    {
        $$ = $1;
    }
    | STRING2
    {
        $$ = $1;
    }
    | STRING3
    {
        $$ = $1;
    }
    | TRUE
    {
        $$ = $1;
    }
    | FALSE
    {
        $$ = $1;
    }
    |NuevoAcceso
    {
        $$ = $1;
    }
    |NULL 
    {
        $$ = $1;
    }
    |ID '(' ListaExpr ')' 
    {
        $$ = $1+"("+$3+")";
    }
    |ID '(' ')' 
    {
        $$ = $1+'()';
    }
    | Expr '?' Expr ':' Expr
    {
        $$ = $1 + "?" + $3 + ":" + $5;
    }
    
;

NuevoAcceso
    :Accesos
    {
        $$ = $1;
    }
    |Acceso
    {
        $$ = $1;
    }
    |ID FuncionArreglo
    {
        $$ = $1 + $2;
    }
;

Acceso
    :ID
    {
        $$ = $1;
    }
;

Accesos
    :Accesos '.' ID
    {
        $$ = $1+"."+$3;
    }
    |Accesos '[' Expr ']'
    {
        $$ = $1 + "["+$3+"]";
    }
    |Accesos '[' Expr ']' FuncionArreglo
    {
        $$ = $1 + "["+$3+"]"+$5;
    }
    |ID '.' ID 
    {
        $$ = $1 + "."+$3;
    }
    |ID '[' Expr ']' FuncionArreglo
    {
        $$ = $1 + "["+$3+"]"+$5;
    }
    |ID '[' Expr ']'
    {
        $$ = $1 + "["+$3+"]";
    }
    
;

FuncionArreglo
    :'POP' '(' ')' 
    {
        $$ = ".pop()";
    }
    |'PUSH' '(' Expr ')'
    {
        $$ = ".push("+$3+")";
    }
    |'LENGTH'
    {
        $$ = ".length";
    }
;


AsigIndividual
    :AsigIndividual '[' Expr ']' 
    {
        $$ = $1 + "["+$3+"]";
    }
    |ID '[' Expr ']'
    {
        $$ = $1 + "["+$3+"]";
    }
    |AsigIndividual '.' ID 
    {
        $$ = $1 + "."+$3;
    }
    |ID '.' ID
    {
        $$ = $1 + "."+$3;
    }
;

StatementFuncion
    : '{' InstruccionesFuncion '}' 
    {
        $$ = "\n{\n"+$2+"\n}\n";
    }
    | '{' '}' 
    {
        $$ = "{ }";
    }
;

InstruccionesFuncion
    :InstruccionFuncion InstruccionesFuncionPrima
    {
        $$ = $1 + "\n"+$2;
    }
;
InstruccionesFuncionPrima
    :InstruccionFuncion InstruccionesFuncionPrima
    {
        $$ = $1 + "\n" +$2; 
    }
    |
    {
        $$ = "";
    }
;

InstruccionFuncion
    : Imprimir
    {
        $$ = $1;
    }
    |DeclaracionVariable
    {
        $$ = $1;
    }
    |AsignacionVariable ';'
    {
        $$ = $1+";\n";
    }
    |IfSt
    {
        $$ = $1;
    }
    |WhileSt
    {
        $$ = $1;
    }
    |DoWhileSt
    {
        $$=$1;
    }
    |SwitchSt
    {
        $$ = $1;
    }
    |IncreDecre ';'
    {
        $$ = $1+";\n";
    }
    |DefinicionTypes ';'
    {
        $$ = $1+";\n";
    }
    |GraficarTs ';'
    {
        $$ = $1+";\n";
    }
    |'BREAK' ';'
    {
        $$ = $1+";\n";
    }
    |'CONTINUE' ';'
    {
        $$ = $1+";\n";
    }
    |DeclaracionArreglos ';'
    {
        $$ = $1 + ";\n";
    }
    |ForNormal 
    {
        $$ = $1;
    }
    |ForOf 
    {
        $$ = $1;
    }
    |ForIn 
    {
        $$ = $1;
    }
    |ID '(' ListaExpr ')' ';'
    {
        $$ = $1+"  ("+$3+");\n";
    }
    |ID '('')' ';'
    {
        $$ = $1+"();\n";
    }
    |ID  '=' '{' ListaValoresTipo '}' ';'
    {
        $$ = $1 + " = {\n"+$4+"\n}\n;";
    }
    |'RETURN' Expr ';'
    {
        $$ = "return "+$2+";\n";
    }
    |'RETURN' ';'
    {
        $$ = "return;\n";
    }
    |AsigIndividual '=' Expr ';'
    {
        $$ = $1+" = "+$3+";\n";
    }
    |AsigIndividual '=' '['']' ';'
    {
        $$ = $1 + " = [];\n";
    }
    |Funcion
    {   
        //contenido = contenido +$1+"\n";
        cuadro_texto.traducir = cuadro_texto.traducir+$1+"\n";
        $$ = "";
        //$$=$1;
    }
;

ForOf
    :'FOR' '(' 'LET' ID 'OF' Expr')' Statement
    {
        $$ = "for(const " +$4 + " of "+$6+" )"+$8;
    }
    |'FOR' '(' 'CONST' ID 'OF' Expr')' Statement
    {
        $$ = "for(const " +$4 + " of "+$6+" )"+$8;
    }
;

ForIn
    :'FOR' '(' 'LET' ID 'IN' Expr')' Statement
    {
        $$ = "for(let " +$4 + " in "+$6+" )"+$8;
    }
    |'FOR' '(' 'CONST' ID 'IN' Expr')' Statement
    {
        $$ = "for(const " +$4 + " in "+$6+" )"+$8;
    }
; 