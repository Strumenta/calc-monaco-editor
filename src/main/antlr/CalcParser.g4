parser grammar CalcParser;

options { tokenVocab=CalcLexer; }

compilationUnit:
    (inputs+=input)*
    (calcs+=calc)*
    (outputs+=output)*
    EOF
    ;

eol:
    NL
    ;

input:
	INPUT_KW ID eol
    ;

output:
    OUTPUT_KW ID eol
    ;

calc:
	target=ID EQUAL value=expression eol
	;

expression:
	NUMBER_LIT #numberLitExpr
	| ID #refExpr
	| LPAREN expression RPAREN #parensExpr
	| expression operator=(MUL|DIV) expression #arithmeticExpr
	| expression operator=(MINUS|PLUS) expression #arithmeticExpr
	| MINUS expression #unaryMinusExpr
	;
	    