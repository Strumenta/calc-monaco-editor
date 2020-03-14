const CalcTokensProvider = require('../../main-generated/javascript/CalcTokensProvider.js');
const ParserFacade = require('../../main-generated/javascript/ParserFacade.js');

if (typeof window === 'undefined') {

} else {
    window.CalcTokensProvider = CalcTokensProvider;
}

console.log("EVAL " + ParserFacade.evaluateExpressionCode("124", {}));



$( document ).ready(function() {
    window.symbolTable = {};
    window.updater = function() {
        $("#inputs .input").each(function () {
            let name = $(this).find(".name").text();
            let value = parseInt($(this).find("input").val());
            window.symbolTable[name] = value;
        });
        $("#calculations .calculation").each(function () {
            let name = $(this).find(".name").text();
            let code = window.editors[name].getValue();
            let value = ParserFacade.evaluateExpressionCode(code, window.symbolTable);
            window.symbolTable[name] = value;
            $(this).find(".result").text("result is " + value);
        });
    }
});