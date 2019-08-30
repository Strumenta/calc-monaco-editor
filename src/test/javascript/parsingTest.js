let assert = require('assert');
let parserFacade = require('../../main-generated/javascript/ParserFacade.js');

function checkToken(tokens, index, typeName, column, text) {
    it('should have ' + typeName + ' in position ' + index, function () {
        assert.equal(tokens[index].type, CalcLexer[typeName]);
        assert.equal(tokens[index].column, column);
        assert.equal(tokens[index].text, text);
    });
}

describe('Basic parsing of empty file', function () {
    assert.equal(parserFacade.parseTreeStr(""), "(compilationUnit <EOF>)")
});

describe('Basic parsing of single input definition', function () {
    assert.equal(parserFacade.parseTreeStr("input a"), "(compilationUnit (input input a) <EOF>)")
});

describe('Basic parsing of single output definition', function () {
    assert.equal(parserFacade.parseTreeStr("output a"), "(compilationUnit (output output a) <EOF>)")
});

describe('Basic parsing of single calculation', function () {
    assert.equal(parserFacade.parseTreeStr("a = b + 1"), "(compilationUnit (calc a = (expression (expression b) + (expression 1))) <EOF>)")
});

describe('Basic parsing of simple script', function () {
    assert.equal(parserFacade.parseTreeStr("input i\no = i + 1\noutput o"), "(compilationUnit (input input i) (calc o = (expression (expression i) + (expression 1))) (output output o) <EOF>)")
});


