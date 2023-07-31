import assert from 'assert';
import * as parserFacade from '../../main/typescript/ParserFacade.js';
import CalcLexer from '../../main-generated/typescript/CalcLexer.js';

function checkToken(tokens, index, typeName, column, text) {
    it('should have ' + typeName + ' in position ' + index, function () {
        assert.equal(tokens[index].type, CalcLexer[typeName]);
        assert.equal(tokens[index].column, column);
        assert.equal(tokens[index].text, text);
    });
}

function checkError(actualError, expectedError) {
    it('should have startLine ' + expectedError.startLine, function () {
        assert.equal(actualError.startLine, expectedError.startLine);
    });
    it('should have endLine ' + expectedError.endLine, function () {
        assert.equal(actualError.endLine, expectedError.endLine);
    });
    it('should have startCol ' + expectedError.startCol, function () {
        assert.equal(actualError.startCol, expectedError.startCol);
    });
    it('should have endCol ' + expectedError.endCol, function () {
        assert.equal(actualError.endCol, expectedError.endCol);
    });
    it('should have message ' + expectedError.message, function () {
        assert.equal(actualError.message, expectedError.message);
    });
}

function checkErrors(actualErrors, expectedErrors) {
    it('should have ' + expectedErrors.length  + ' error(s)', function (){
        assert.equal(actualErrors.length, expectedErrors.length);
    });
    var i;
    for (i = 0; i < expectedErrors.length; i++) {
        checkError(actualErrors[i], expectedErrors[i]);
    }
}

function parseAndCheckErrors(input, expectedErrors) {
    let errors = parserFacade.validate(input);
    checkErrors(errors, expectedErrors);
}

describe('Basic parsing of empty file', function () {
    assert.equal(parserFacade.parseTreeStr(""), "(compilationUnit <EOF>)")
});

describe('Basic parsing of single input definition', function () {
    assert.equal(parserFacade.parseTreeStr("input a\n"), "(compilationUnit (input input a (eol \\n)) <EOF>)")
});

describe('Basic parsing of single output definition', function () {
    assert.equal(parserFacade.parseTreeStr("output a\n"), "(compilationUnit (output output a (eol \\n)) <EOF>)")
});

describe('Basic parsing of single calculation', function () {
    assert.equal(parserFacade.parseTreeStr("a = b + 1\n"), "(compilationUnit (calc a = (expression (expression b) + (expression 1)) (eol \\n)) <EOF>)")
});

describe('Basic parsing of simple script', function () {
    assert.equal(parserFacade.parseTreeStr("input i\no = i + 1\noutput o\n"), "(compilationUnit (input input i (eol \\n)) (calc o = (expression (expression i) + (expression 1)) (eol \\n)) (output output o (eol \\n)) <EOF>)")
});

describe('Validation of simple errors on single lines', function () {
    describe('should have recognize missing operand', function () {
        parseAndCheckErrors("o = i + \n", [
            new parserFacade.Error(1, 1, 8, 9, "mismatched input '\\n' expecting {NUMBER_LIT, ID, '(', '-'}")
        ]);
    });
    describe('should have recognize extra operator', function () {
        parseAndCheckErrors("o = i +* 2 \n", [
            new parserFacade.Error(1, 1, 7, 8, "extraneous input '*' expecting {NUMBER_LIT, ID, '(', '-'}")
        ]);
    });
});

describe('Validation of simple errors in small scripts', function () {
    describe('should have recognize missing operand', function () {
        let input = "input i\no = i + \noutput o\n";
        parseAndCheckErrors(input, [
            new parserFacade.Error(2, 2, 8, 9, "mismatched input '\\n' expecting {NUMBER_LIT, ID, '(', '-'}")
        ]);
    });
    describe('should have recognize extra operator', function () {
        let input = "input i\no = i +* 2 \noutput o\n";
        parseAndCheckErrors(input, [
            new parserFacade.Error(2, 2, 7, 8, "extraneous input '*' expecting {NUMBER_LIT, ID, '(', '-'}")
        ]);
    });
});

describe('Validation of examples being edited', function () {
    describe('deleting number from division', function () {
        let input = "input a\n" +
            "b = a * 2\n" +
            "c = (a - b) / \n" +
            "output c\n";
        parseAndCheckErrors(input, [
            new parserFacade.Error(3, 3, 14, 15, "mismatched input '\\n' expecting {NUMBER_LIT, ID, '(', '-'}")
        ]);
    });
    describe('deleting number from multiplication', function () {
        let input = "input a\n" +
            "b = a * \n" +
            "c = (a - b) / 3\n" +
            "output c\n";
        parseAndCheckErrors(input, [
            new parserFacade.Error(2, 2, 8, 9, "mismatched input '\\n' expecting {NUMBER_LIT, ID, '(', '-'}")
        ]);
    });
    describe('adding plus to expression', function () {
        let input = "input a\n" +
            "b = a * 2 +\n" +
            "c = (a - b) / 3\n" +
            "output c\n";
        parseAndCheckErrors(input, [
            new parserFacade.Error(2, 2, 11, 12, "mismatched input '\\n' expecting {NUMBER_LIT, ID, '(', '-'}")
        ]);
    });
});

describe('Unrecognized tokens cause errors', function () {
    describe('extra dollor before identifier', function () {
        let input = "input a\n" +
            "$b = a * 2\n" +
            "c = (a - b) / 3\n" +
            "output c\n";
        parseAndCheckErrors(input, [
            new parserFacade.Error(2, 2, 0, 1, "extraneous input '$' expecting {<EOF>, 'input', 'output', ID}")
        ]);
    });
});
