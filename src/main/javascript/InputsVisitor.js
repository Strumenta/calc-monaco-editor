// Generated from CalcParser.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');
// This class defines a partial visitor fot the inputs for a parse tree produced by CalcParser.

function InputsVisitor() {
    antlr4.tree.ParseTreeVisitor.call(this);
    return this;
}

InputsVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
InputsVisitor.prototype.constructor = InputsVisitor;

// Visit a parse tree produced by CalcParser#compilationUnit.
InputsVisitor.prototype.visitCompilationUnit = function(ctx) {
    let r = []
    for (let i = 0; i < ctx.inputs.length; i++) {
        r.push({variable:this.visitInput(ctx.inputs[i]),value:""});
    }
    return r;
};

// Visit a parse tree produced by CalcParser#input.
InputsVisitor.prototype.visitInput = function(ctx) {
    return ctx.getChild(1).getText();
};

exports.InputsVisitor = InputsVisitor;