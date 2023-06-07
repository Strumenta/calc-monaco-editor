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

     reportUnwantedToken(recognizer: Parser) {
         return super.reportUnwantedToken(recognizer);
     }

    singleTokenDeletion(recognizer: Parser) {
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
        } else {
            return null;
        }
    }
    getExpectedTokens = function(recognizer) {
        return recognizer.getExpectedTokens();
    };

    reportMatch = function(recognizer) {
        this.endErrorCondition(recognizer);
    };

}

export function validate(input) : Error[] {
    let errors : Error[] = [];

    const lexer = createLexer(input);
    lexer.removeErrorListeners();
    lexer.addErrorListener(new ConsoleErrorListener());

    const parser = createParserFromLexer(lexer);
    parser.removeErrorListeners();
    parser.addErrorListener(new CollectorErrorListener(errors));
    parser._errHandler = new CalcErrorStrategy();

    const tree = parser.compilationUnit();

    const scope = []; // ? Should be a Set but can't use it unless typescript targets ES6+

    for (const input of tree.inputs) {

        if (input.ID() === null) continue;

        const inputIdentifier = input.ID().symbol;

        if (scope.some(x => x === inputIdentifier.text)) {
            errors.push(createErrorAt(inputIdentifier, "input already declared"));
        }
        else {
            scope.push(inputIdentifier.text);
        }
    }

    for (const calculation of tree.calcs) {
        validateExpression(calculation.value);

        if (!scope.some(x => x === calculation.target.text)) {
            scope.push(calculation.target.text);
        }
    }

    for (const output of tree.outputs) {

        if (output.ID() === null) continue;

        const outputIdentifier = output.ID().symbol;

        if (outputIdentifier.text === "<missing null>") continue;

        if (!scope.some(x => x === outputIdentifier.text)) {
            errors.push(createErrorAt(outputIdentifier, "undeclared symbol"));
        }
    }

    function validateExpression(expression) {
        if (expression === null || expression.children === null) return;

        for (const child of expression.children) {
            if (child.children) {
                validateExpression(child);
            }
            else if (child.symbol && child.symbol.type == CalcLexer.ID) {

                const symbol = child.symbol;

                if (!scope.some(x => x == symbol.text)) {
                    errors.push(createErrorAt(symbol, "undeclared symbol"));
                }
            }
        }
    }

    return errors;
}

function createErrorAt(node, message) {
    return new Error(node.line, node.line, node.column + 1, node.column + node.stop - node.start + 2, message);
}
