/// <reference path="../../../node_modules/monaco-editor/monaco.d.ts" />

import {CommonTokenStream, InputStream, Token, Parser} from '../../../node_modules/antlr4/src/antlr4/index.node.js'
import { default as error }  from '../../../node_modules/antlr4/src/antlr4/error/index.js'
import CalcLexer from "../../main-generated/javascript/CalcLexer.js"
import CalcParser from "../../main-generated/javascript/CalcParser.js"

class ConsoleErrorListener extends error.ErrorListener<Token> {
    syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
        console.log("ERROR " + msg);
    }
}

export class Error {
    startLine: number;
    endLine: number;
    startCol: number;
    endCol: number;
    message: string;

    constructor(startLine: number, endLine: number, startCol: number, endCol: number, message: string) {
        this.startLine = startLine;
        this.endLine = endLine;
        this.startCol = startCol;
        this.endCol = endCol;
        this.message = message;
    }

}

class CollectorErrorListener extends error.ErrorListener<Token> {

    private errors : Error[] = []

    constructor(errors: Error[]) {
        super()
        this.errors = errors
    }

    syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
        var endColumn = column + 1;
        if (offendingSymbol._text !== null) {
            endColumn = column + offendingSymbol._text.length;
        }
        this.errors.push(new Error(line, line, column, endColumn, msg));
    }

}

export function createLexer(input: string) {
    const chars = new InputStream(input);
    const lexer = new CalcLexer(chars);

    lexer.strictMode = false;

    return lexer;
}

export function getTokens(input: string) : Token[] {
    return createLexer(input).getAllTokens()
}

function createParser(input) {
    const lexer = createLexer(input);

    return createParserFromLexer(lexer);
}

function createParserFromLexer(lexer) {
    const tokens = new CommonTokenStream(lexer);
    return new CalcParser(tokens);
}

function parseTree(input) {
    const parser = createParser(input);

    return parser.compilationUnit();
}

export function parseTreeStr(input) {
    const lexer = createLexer(input);
    lexer.removeErrorListeners();
    lexer.addErrorListener(new ConsoleErrorListener());

    const parser = createParserFromLexer(lexer);
    parser.removeErrorListeners();
    parser.addErrorListener(new ConsoleErrorListener());

    const tree = parser.compilationUnit();

    return tree.toStringTree(parser.ruleNames);
}

function reportMatch(recognizer) {
    this.endErrorCondition(recognizer);
}

function singleTokenDeletion(recognizer) {
    var nextTokenType = recognizer.getTokenStream().LA(2);
    if (recognizer.getTokenStream().LA(1) == CalcParser.NL) {        
        return null;
    }
    var expecting = this.getExpectedTokens(recognizer);
    if (expecting.contains(nextTokenType)) {
        this.reportUnwantedToken(recognizer);
        recognizer.consume(); // simply delete extra token
        // we want to return the token we're actually matching
        var matchedSymbol = recognizer.getCurrentToken();
        this.reportMatch(recognizer); // we know current token is correct
        return matchedSymbol;
    }
    else {
        return null;
    }
}

export function validate(input) : Error[] {
    let errors : Error[] = [];

    const lexer = createLexer(input);
    lexer.removeErrorListeners();
    lexer.addErrorListener(new ConsoleErrorListener());

    const parser = createParserFromLexer(lexer);
    parser.removeErrorListeners();
    parser.addErrorListener(new CollectorErrorListener(errors));
    // there seems to be an issue overloading DefaultErrorStrategy with the current version
    // so we replace directly the needed methods    
    parser._errHandler.singleTokenDeletion = singleTokenDeletion;
    parser._errHandler.reportMatch = reportMatch;

    const tree = parser.compilationUnit();
    return errors;
}
