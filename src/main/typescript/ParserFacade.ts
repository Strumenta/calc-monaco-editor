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
         console.log("sync " + recognizer);
//         for (var k in recognizer) {
//             //console.log(k);
//         }
         console.log("  rule: " + recognizer._ctx.ruleIndex);
         console.log("  next token: " + recognizer.getTokenStream().LA(1));
//         if (CalcParser.RULE_expression == recognizer._ctx.ruleIndex) {
//             var s = recognizer._interp.atn.states[recognizer.state];
//             var la = -2;
//             do {
//                 la = recognizer.getTokenStream().LA(1);
//                 recognizer.consume();
//             } while (la != CalcParser.EOF && la != CalcParser.NL)
//             //console.log("LA " + la);
//         } else {
//             super.sync(recognizer, error);
//         }
//         //console.log(recognizer._ctx.ruleIndex);
//         //CalcParser.rule
         return super.sync(recognizer);
     }

     reportUnwantedToken(recognizer: Parser) {
         console.log("reportUnwantedToken");
         console.log("  rule: " + recognizer._ctx.ruleIndex);
         console.log("  deleting " + recognizer.getTokenStream().LA(1));
         console.log("  to get to " + recognizer.getTokenStream().LA(2));
         return super.reportUnwantedToken(recognizer);
     }

    reportMissingToken(recognizer: Parser) {
        console.log("reportMissingToken");
        return super.reportMissingToken(recognizer);
    }
    recoverInline(recognizer: Parser) {
        console.log("recoverInline");
        return super.recoverInline(recognizer);
    }
    singleTokenInsertion(recognizer: Parser) {
        console.log("singleTokenInsertion");
        console.log("  rule: " + recognizer._ctx.ruleIndex);
        console.log("  next token: " + recognizer.getTokenStream().LA(1));
        let res = super.singleTokenInsertion(recognizer);
        if (res != null) {
            console.log("singleTokenInsertion");
            console.log("  rule: " + recognizer._ctx.ruleIndex);
            console.log("  next token: " + recognizer.getTokenStream().LA(1));
            console.log("  singleTokenInsertion res: " + res);
        }
        return res;
    }
    singleTokenDeletion(recognizer: Parser) {
        // let res = super.singleTokenDeletion(recognizer);
        // if (res != null) {
        //     console.log("singleTokenDeletion");
        //     console.log("  rule: " + recognizer._ctx.ruleIndex);
        //     console.log("  next token: " + recognizer.getTokenStream().LA(1));
        //     console.log("  singleTokenDeletion res: " + res);
        // }
        // return res;
        var nextTokenType = recognizer.getTokenStream().LA(2);
        if (recognizer.getTokenStream().LA(1) == CalcParser.NL) {
            return null;
        }
        var expecting = this.getExpectedTokens(recognizer);
        if (expecting.contains(nextTokenType)) {
            this.reportUnwantedToken(recognizer);
            // print("recoverFromMismatchedToken deleting " \
            // + str(recognizer.getTokenStream().LT(1)) \
            // + " since " + str(recognizer.getTokenStream().LT(2)) \
            // + " is what we want", file=sys.stderr)
            recognizer.consume(); // simply delete extra token
            // we want to return the token we're actually matching
            var matchedSymbol = recognizer.getCurrentToken();
            this.reportMatch(recognizer); // we know current token is correct
                console.log("singleTokenDeletion");
                console.log("  rule: " + recognizer._ctx.ruleIndex);
                console.log("  next token: " + recognizer.getTokenStream().LA(1));
                console.log("  singleTokenDeletion res: " + matchedSymbol);
            return matchedSymbol;
        } else {
            return null;
        }
    }
    getExpectedTokens = function(recognizer) {
        return recognizer.getExpectedTokens();
    };
    getMissingSymbol(recognizer: Parser) {
        console.log("getMissingSymbol");
        return super.getMissingSymbol(recognizer);
    }
    getErrorRecoverySet(recognizer: Parser) {
        console.log("getErrorRecoverySet");
        return super.getErrorRecoverySet(recognizer);
    }
    reportMatch = function(recognizer) {
        this.endErrorCondition(recognizer);
    };

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
     recover(recognizer: Parser, error: any) {
         console.log("Recover " + error + ", " + recognizer);
         console.log("  rule: " + recognizer._ctx.ruleIndex);
         console.log("  next token: " + recognizer.getTokenStream().LA(1));
//         for (var k in error) {
//             //console.log(k);
//         }
//         console.log("CTX " + error.ctx);
//         console.log("input " + error.input);
//         console.log("getExpectedTokens " + error.getExpectedTokens());
//         console.log("offendingState " + error.offendingState);
//         console.log("offendingToken " + error.offendingToken);
        return super.recover(recognizer, error);
     }

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
