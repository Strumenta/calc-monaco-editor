/// <reference path="../../../node_modules/monaco-editor/monaco.d.ts" />

import {InputStream, Token} from '../../../node_modules/antlr4/index.js'
import {CalcLexer} from "../../main-generated/javascript/CalcLexer.js"

function createLexer(input: String) {
    const chars = new InputStream(input);
    const lexer = new CalcLexer(chars);

    lexer.strictMode = false;

    return lexer;
}

export function getTokens(input: String) : Token[] {
    return createLexer(input).getAllTokens()
}
