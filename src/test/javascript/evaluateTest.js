let assert = require('assert');
let parserFacade = require('../../main-generated/javascript/ParserFacade.js');

describe('Evaluate expression', function () {
    it('should evaluate parenthesis expressions', function (){
        let res = parserFacade.evaluateExpressionCode("(123)", {});
        assert.equal(res, 123);
    });
    it('should evaluate number literal', function (){
        let res = parserFacade.evaluateExpressionCode("123", {});
        assert.equal(res, 123);
    });
    it('should evaluate reference', function (){
        let res = parserFacade.evaluateExpressionCode("xyz", {xyz: 4});
        assert.equal(res, 4);
    });
    it('should evaluate sum', function (){
        let res = parserFacade.evaluateExpressionCode("xyz + 7", {xyz: 4});
        assert.equal(res, 11);
    });
    it('should evaluate sub', function (){
        let res = parserFacade.evaluateExpressionCode("xyz - 7", {xyz: 4});
        assert.equal(res, -3);
    });
    it('should evaluate mul', function (){
        let res = parserFacade.evaluateExpressionCode("xyz * 7", {xyz: 4});
        assert.equal(res, 28);
    });
    it('should evaluate div', function (){
        let res = parserFacade.evaluateExpressionCode("xyz / 7", {xyz: 28});
        assert.equal(res, 4);
    });
    it('should evaluate complex expr 1', function (){
        let res = parserFacade.evaluateExpressionCode("salary * nEmployees + otherExpenses", {salary: 4000, nEmployees: 4, otherExpenses: 1200});
        assert.equal(res, 17200);
    });
    it('should evaluate complex expr 2', function (){
        let res = parserFacade.evaluateExpressionCode("grossProfit * (taxRate / 100)", {grossProfit: 400000, taxRate: 24});
        assert.equal(res, 96000);
    });
});

