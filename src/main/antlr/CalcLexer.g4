lexer grammar CalcLexer;

channels { WS_CHANNEL }

WS: [ \t]+ -> channel(WS_CHANNEL);
NL: ('\r\n' | '\r' | '\n') -> channel(WS_CHANNEL);

INPUT_KW : 'input' ;
OUTPUT_KW : 'output' ;

NUMBER_LIT : ('0'|[1-9][0-9]*)('.'[0-9]+)?;

ID: [a-zA-Z][a-zA-Z0-9_]* ;

LPAREN : '(' ;
RPAREN : ')' ;
EQUAL : '=' ;
MINUS : '-' ;
PLUS : '+' ;
MUL : '*' ;
DIV : '/' ;

UNRECOGNIZED : . ;
