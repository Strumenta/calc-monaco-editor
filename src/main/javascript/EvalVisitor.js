// Generated from CalcParser.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');
var CalcParser = require('../../main-generated/javascript/CalcParser').CalcParser;
// This class defines a complete generic visitor for a parse tree produced by CalcParser.

let variablesMapping;
let errors=[];
function EvalVisitor() {
    antlr4.tree.ParseTreeVisitor.call(this);
    return this;
}

EvalVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
EvalVisitor.prototype.constructor = EvalVisitor;

// Visit a parse tree produced by CalcParser#compilationUnit.
EvalVisitor.prototype.visitCompilationUnit = function(ctx,variables) {
    // stores the variable values to be evaluated
    variablesMapping=variables;
    errors=[];
    // stores the output values to be printed in the html
    let outputVariables={};
    // visit all calc nodes
    for (let i = 0; i < ctx.calcs.length; i++) {
        this.visitCalc(ctx.calcs[i])
    }
    // visit all output nodes
    for (let i = 0; i < ctx.outputs.length; i++) {
        outputVariables[this.visitOutput(ctx.outputs[i])]=true;
    }
    // filter variables for the ones to be showed in the output, for easier handling in the html
    variablesMapping = variablesMapping.filter(elem=> outputVariables[elem.variable] && outputVariables[elem.variable]===true);
    return {output:variablesMapping,errors:errors};
};

// Visit a parse tree produced by CalcParser#output.
EvalVisitor.prototype.visitOutput = function(ctx) {
    // Only return the variable name
    return ctx.getChild(1).getText();
};


// Visit a parse tree produced by CalcParser#calc.
EvalVisitor.prototype.visitCalc = function(ctx) {
    // Get the current variable name being analyzed
    let variable=ctx.target.text;
    // evaluate the current expression
    let calculatedExpr = this.visitExpression(ctx.value);
    let found=false;
    // Look for the value in the variablesMapping to update or to add for use in next calcs
    for (let i = 0; i <variablesMapping.length ; i++) {
        if(variablesMapping[i].variable==variable){
            let temp ={variable:variable,value:parseInt(calculatedExpr)}
            variablesMapping[i]=temp;
            found=true;
            break;
        }
    }
    if(!found){
        variablesMapping.push({variable:variable,value:parseInt(calculatedExpr)});
    }
    return variablesMapping;
};


// Visit a parse tree produced by CalcParser#expression.
EvalVisitor.prototype.visitExpression = function(ctx) {
    if (ctx.NUMBER_LIT() && ctx.NUMBER_LIT().getText()) {
        return parseInt(ctx.getText());
    } else if (ctx.ID() && ctx.ID().getText()) {
        const variable=ctx.getText();
        // In case the variable is not defined we assume 0
        let r= undefined;
        // get the value for the variable to calculate the expression
        for (let i = 0; i <variablesMapping.length ; i++) {
            if(variablesMapping[i].variable==variable){
                r = parseInt(variablesMapping[i].value);
            }
        }
        if(r===undefined){
            errors.push({message:"Error: "+variable + " is not defined and does not have a value to be calculated"});
            // Just catching the error without interrupting the expression calculation
            r=0;
        }
        return r;
    } else if (ctx.LPAREN() && ctx.LPAREN().getText()) {
        return this.visitExpression(ctx.expression(0));
    } else if (ctx.MINUS() && ctx.MINUS().getText() && !ctx.expression(1)) {
        return -this.visitExpression(ctx.expression(0));
    } else if (ctx.operator && ctx.operator.type === CalcParser.MUL) {
        return this.visitExpression(ctx.expression(0)) * this.visitExpression(ctx.expression(1));
    } else if (ctx.operator && ctx.operator.type === CalcParser.DIV) {
        const divisor = this.visitExpression(ctx.expression(1));
        // Just catching the error without interrupting the expression calculation
        if (divisor === 0) {
            errors.push({message:"Error: Division by 0 error."});
        }
        return this.visitExpression(ctx.expression(0)) / divisor;
    } else if (ctx.operator && ctx.operator.type === CalcParser.PLUS) {
        return this.visitExpression(ctx.expression(0)) + this.visitExpression(ctx.expression(1));
    } else if (ctx.operator && ctx.operator.type === CalcParser.MINUS) {
        return this.visitExpression(ctx.expression(0)) - this.visitExpression(ctx.expression(1));
    }
};

exports.EvalVisitor = EvalVisitor;