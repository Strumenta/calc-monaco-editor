let assert = require('assert');
let parserFacade = require('../../main-generated/javascript/ParserFacade.js');

describe('Inputs Visitor tests', function () {
    let inputs = parserFacade.getInputs("input x\ninput y\n");

    it('should return 3 inputs', function() {
        assert.equal(inputs.length, 2);
    });

    it('should have x in position 0 and y in position 1', function() {
        assert.equal(inputs[0].variable, "x");
        assert.equal(inputs[1].variable, "y");
    });

    it('should have empty values', function() {
        assert.equal(inputs[0].value, "");
        assert.equal(inputs[1].value, "");
    });
});

describe('Eval/Expression Calculator Visitor tests', function () {
    let output = parserFacade.calculateExpression("input x\ninput y\nz=x*y\noutput z\n",[{variable: "x",value:1},{variable: "y",value:2}]);

    it('should return 0 errors', function() {
        assert.equal(output.errors.length,0);
    });

    it('should return variables from the output with correct values', function() {
        assert.equal(output.output.length,1);
        assert.equal(output.output[0].variable,'z');
        assert.equal(output.output[0].value,2);
    })
});

describe('Eval/Expression Calculator Visitor error tests', function () {
    let output = parserFacade.calculateExpression("input x\ninput y\nz=x/y\noutput z\n",[{variable: "x",value:1},{variable: "y",value:0}]);
    it('should return division by 0 error', function() {
        assert.equal(output.errors.length,1);
        assert.equal(output.errors[0].message,"Error: Division by 0 error.");
    });

    it('should return division by 0 error', function() {
        output = parserFacade.calculateExpression("input x\ninput y\nz=x/y\noutput z\n",[{variable: "x",value:1},{variable: "y",value:0}]);
        assert.equal(output.errors.length,1);
        assert.equal(output.errors[0].message,"Error: Division by 0 error.");
    });


    it('should return variable not defined error', function() {
        output = parserFacade.calculateExpression("input x\ninput y\nz=x*k\noutput z\n",[{variable: "x",value:1},{variable: "y",value:0}]);
        assert.equal(output.errors.length,1);
        assert.equal(output.errors[0].message,"Error: k is not defined and does not have a value to be calculated");
    });
});