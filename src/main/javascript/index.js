import * as monaco from 'monaco-editor';

import * as calcTokensProvider from '../../main-generated/javascript/main/typescript/CalcTokensProvider.js';
import * as parserFacade from '../../main-generated/javascript/main/typescript/ParserFacade.js';
if (typeof window === 'undefined') {

} else {
    window.CalcTokensProvider = calcTokensProvider;
    window.ParserFacade = parserFacade;
}

monaco.languages.register({ id: 'calc' });

monaco.languages.setTokensProvider('calc', new calcTokensProvider.CalcTokensProvider());

let literalFg = '3b8737';
let idFg = '344482';
let symbolsFg = '000000';
let keywordFg = '7132a8';
let errorFg = 'ff0000';

monaco.editor.defineTheme('myCoolTheme', {
    base: 'vs',
    inherit: false,
    colors: {
    },
    rules: [
        { token: 'number_lit.calc',   foreground: literalFg },

        { token: 'id.calc',           foreground: idFg,       fontStyle: 'italic' },

        { token: 'lparen.calc',       foreground: symbolsFg },
        { token: 'rparen.calc',       foreground: symbolsFg },

        { token: 'equal.calc',        foreground: symbolsFg },
        { token: 'minus.calc',        foreground: symbolsFg },
        { token: 'plus.calc',         foreground: symbolsFg },
        { token: 'div.calc',          foreground: symbolsFg },
        { token: 'mul.calc',          foreground: symbolsFg },

        { token: 'input_kw.calc',     foreground: keywordFg,  fontStyle: 'bold' },
        { token: 'output_kw.calc',    foreground: keywordFg,  fontStyle: 'bold' },

        { token: 'unrecognized.calc', foreground: errorFg }
    ]
});

let editor = monaco.editor.create(editorBox, {
    value: [
        'input salary',
        'input nEmployees',
        'input revenues',
        'input otherExpenses',
        'input taxRate',
        '',
        'totalExpenses = salary * nEmployees + otherExpenses',
        'grossProfit = revenues - totalExpenses',
        'totalTaxes = grossProfit * (taxRate / 100)',
        'profit = profit - totalTaxes',
        '',
        'output totalTaxes',
        'output profit',
        ''
    ].join('\n'),
    language: 'calc',
    theme: 'myCoolTheme'
});
editor.onDidChangeModelContent(function (e) {
    let code = editor.getValue()
    let syntaxErrors = parserFacade.validate(code);
    let monacoErrors = [];
    for (let e of syntaxErrors) {
        monacoErrors.push({
            startLineNumber: e.startLine,
            startColumn: e.startCol,
            endLineNumber: e.endLine,
            endColumn: e.endCol,
            message: e.message,
            severity: monaco.MarkerSeverity.Error
        });
    };
    window.syntaxErrors = syntaxErrors;
    let model = monaco.editor.getModels()[0];
    monaco.editor.setModelMarkers(model, "owner", monacoErrors);
});
