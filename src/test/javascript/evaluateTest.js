let assert = require('assert');
let parserFacade = require('../../main-generated/javascript/ParserFacade.js');

describe('Evaluate expression', function () {
    it('should evaluate number literal', function (){
        let res = parserFacade.evaluateExpressionCode("123", {});
        assert.equal(res, 123);
    });
});

