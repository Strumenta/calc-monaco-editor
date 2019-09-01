/// <reference path="../../../node_modules/monaco-editor/monaco.d.ts" />

import {CommonTokenStream, InputStream, Token, error, Parser} from '../../../node_modules/antlr4/index.js'
import {DefaultErrorStrategy} from '../../../node_modules/antlr4/error/ErrorStrategy.js'
import {CalcLexer} from "../../main-generated/javascript/CalcLexer.js"
import {CalcParser} from "../../main-generated/javascript/CalcParser.js"

class ConsoleErrorListener extends error.ErrorListener {
    syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
        console.log("ERROR " + msg);
    }
}

class Error {
    startLine: number
    endLine: number
    startCol: number
    endCol: number
    message: string

    constructor(startLine: number, endLine: number, startCol: number, endCol: number, message: string) {
        this.startLine = startLine;
        this.endLine = endLine;
        this.startCol = startCol;
        this.endCol = endCol;
        this.message = message;
    }

}

class CollectorErrorListener extends error.ErrorListener {

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

export function createLexer(input: String) {
    const chars = new InputStream(input);
    const lexer = new CalcLexer(chars);

    lexer.strictMode = false;

    return lexer;
}

export function getTokens(input: String) : Token[] {
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

class CalcErrorStrategy extends DefaultErrorStrategy {

//     // private base = error.ErrorStrategy.DefaultErrorStrategy
//
// // {
// // public EventErrorStrategy() : base()
// //     { }
// //
    sync(recognizer: Parser) {
        //console.log("sync " + recognizer);
        for (var k in recognizer) {
            //console.log(k);
        }
        if (CalcParser.RULE_expression == recognizer._ctx.ruleIndex) {
            var s = recognizer._interp.atn.states[recognizer.state];
            var la = -2;
            do {
                la = recognizer.getTokenStream().LA(1);
                recognizer.consume();
            } while (la != CalcParser.EOF && la != CalcParser.NL)
            //console.log("LA " + la);
        } else {
            super.sync(recognizer, error);
        }
        //console.log(recognizer._ctx.ruleIndex);
        //CalcParser.rule

    }
//
//      // match(ttype) {
//      //
//      // }
//
//     reportMatch(recognizer: Parser) {
//
//     }
//
//     inErrorRecoveryMode(recognizer: Parser) {
//
//     }
//
//     reportError(recognizer: Parser, error) {
//         error.DefaultErrorStrategy.reportError(recognizer, error)
//     }
//
//     recover(recognizer: Parser, error: any) {
//         console.log("Recover " + error + ", " + recognizer);
//         for (var k in error) {
//             //console.log(k);
//         }
//         console.log("CTX " + error.ctx);
//         console.log("input " + error.input);
//         console.log("getExpectedTokens " + error.getExpectedTokens());
//         console.log("offendingState " + error.offendingState);
//         console.log("offendingToken " + error.offendingToken);
//         super.recover(recognizer, error);
//     }

}

export function validate(input) : Error[] {
    let errors : Error[] = []

    const lexer = createLexer(input);
    lexer.removeErrorListeners();
    lexer.addErrorListener(new ConsoleErrorListener());

    const parser = createParserFromLexer(lexer);
    parser.removeErrorListeners();
    parser.addErrorListener(new CollectorErrorListener(errors));
    // for (var k in parser) {
    //     console.log(k);
    // }
    parser._errHandler = new CalcErrorStrategy();

    const tree = parser.compilationUnit();
    return errors;
}
