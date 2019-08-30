parser grammar CalcParser;

options { tokenVocab=CalcLexer; }

compilationUnit:
    (inputs+=input)*
    (calcs+=calc)*
    (outputs+=output)*
    EOF
    ;

input:
	INPUT_KW ID
    ;

output:
    OUTPUT_KW ID
    ;

calc:
	target=ID EQUAL value=expression
	;

expression:
	NUMBER_LIT
	| ID
	| LPAREN expression RPAREN
	| expression operator=(MUL|DIV) expression
	| expression operator=(MINUS|PLUS) expression
	| MINUS expression
	;
	    