let assert = require('assert');
let parserFacade = require('../../main-generated/javascript/ParserFacade.js');

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
    iterate over errors
    for (var e in )
    checkError(
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
    let input = "o = i + \n";
    let errors = parserFacade.validate(input);
    describe('should have recognize missing operand', function () {
        it('should have 1 error', function (){
            assert.equal(errors.length, 1);
        });
        checkError(errors[0], new parserFacade.Error(1, 1, 8, 9, "mismatched input '\\n' expecting {NUMBER_LIT, ID, '(', '-'}"))
    });
    it('should have recognize extra operator', function () {
        let input = "o = i +* 2 \n";
        let errors = parserFacade.validate(input);
        assert.equal(errors.length, 1);
        var e = errors[0];
        assert.equal(e.startLine, 1);
        assert.equal(e.endLine, 1);
        assert.equal(e.startCol, 7);
        assert.equal(e.endCol, 8);
        assert.equal(e.message, "extraneous input '*' expecting {NUMBER_LIT, ID, '(', '-'}");
    });
});

describe('Validation of simple errors in small scripts', function () {
    it('should have recognize missing operand', function () {
        let input = "input i\no = i + \noutput o\n";
        let errors = parserFacade.validate(input);
        assert.equal(errors.length, 1);
        var e = errors[0];
        assert.equal(e.startLine, 2);
        assert.equal(e.endLine, 2);
        assert.equal(e.startCol, 8);
        assert.equal(e.endCol, 9);
        assert.equal(e.message, "mismatched input '\\n' expecting {NUMBER_LIT, ID, '(', '-'}");
    });
    it('should have recognize extra operator', function () {
        let input = "input i\no = i +* 2 \noutput o\n";
        let errors = parserFacade.validate(input);
        assert.equal(errors.length, 1);
        var e = errors[0];
        assert.equal(e.startLine, 2);
        assert.equal(e.endLine, 2);
        assert.equal(e.startCol, 7);
        assert.equal(e.endCol, 8);
        assert.equal(e.message, "extraneous input '*' expecting {NUMBER_LIT, ID, '(', '-'}");
    });
});

describe('Validation of examples being edited', function () {
    it('deleting number from division', function () {
        let input = "input a\n" +
            "b = a * 2\n" +
            "c = (a - b) / \n" +
            "output c\n";
        let errors = parserFacade.validate(input);
        assert.equal(errors.length, 1);
        var e = errors[0];
        assert.equal(e.startLine, 3);
        assert.equal(e.endLine, 3);
        assert.equal(e.startCol, 14);
        assert.equal(e.endCol, 15);
        assert.equal(e.message, "mismatched input '\\n' expecting {NUMBER_LIT, ID, '(', '-'}");
    });
    it('adding plus to expression', function () {
        let input = "input a\n" +
            "b = a * 2 +\n" +
            "c = (a - b) / 3\n" +
            "output c\n";
        let errors = parserFacade.validate(input);
        assert.equal(errors.length, 1);
        var e = errors[0];
        assert.equal(e.startLine, 2);
        assert.equal(e.endLine, 2);
        assert.equal(e.startCol, 11);
        assert.equal(e.endCol, 12);
        assert.equal(e.message, "mismatched input '\\n' expecting {NUMBER_LIT, ID, '(', '-'}");
    });
});
