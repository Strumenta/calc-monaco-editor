const CalcTokensProvider = require('../../main-generated/javascript/CalcTokensProvider.js');
const ParserFacade = require('../../main-generated/javascript/ParserFacade.js');
const Navigation = require('../../main-generated/javascript/Navigation.js');
const autocomplete = require('autocompleter');

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


    $("#inputs .input input").change(function(){
        window.updater();
    });

    $(".collapsible").click(function() {
        $(this).siblings(".section-content").toggleClass("expanded");
    });

    function addType() {
        $("#types").siblings(".empty-message").hide();
        $("#types").append("<div class='type-definition'><input class='keyword' value='type'> <input class='editable' value='My type' required> <input class='keyword' value='{'/>"
            +"<div class='fields'><span class='message'>no fields</span><br><div class='fields-container'></div></div><input class='keyword' value='}'></div>");
        prepareInputs();
        $(".add-field-button").click(function () {
            $(this).siblings(".message").hide();
            console.log("add field");
        });
    }

    $("#add-type-button").click(function () {
        addType();
    });


    $.fn.textWidth = function(_text, _font){
        var textToConsider = _text || this.val();
        if (textToConsider == "") {
            textToConsider = this[0].placeholder;
        }
        var fakeEl = $('<span>').hide().appendTo(document.body).text(textToConsider).css({font: _font || this.css('font'), whiteSpace: "pre"}),
            width = fakeEl.width();
        fakeEl.remove();
        return width;
    };

    $.fn.inputWidthUpdate = function(options) {
        options = $.extend({padding:10,minWidth:0,maxWidth:10000}, options||{});
        $(this).css('width', Math.min(options.maxWidth,Math.max(options.minWidth,$(this).textWidth() + options.padding)));
    };

    $.fn.autoresize = function(options){//resizes elements based on content size.  usage: $('input').autoresize({padding:10,minWidth:0,maxWidth:100});
        $(this).on('input', function() {
            $(this).inputWidthUpdate(options);
        }).trigger('input');
        return this;
    };

    let myAutoresizeOptions = {padding:2,minWidth:10,maxWidth:300};

    function installAutoresize() {
        $("input").autoresize(myAutoresizeOptions);
    }

    function keyword(text) {
        return "<input class='keyword' value='" + text + "'>";
    }

    function editCell(text) {
        return "<input class='editable' value='" + text + "'>";
    }

    function resolvable(text) {
        return "<input class='resolvable' placeholder='" + text + "' value=''>";
    }

    function addField(t) {
        $(t).siblings(".fields").find(".message").hide();
        $(t).siblings(".fields").append(`<div class='field'>${keyword('field')}${editCell('myField')}${keyword('of type')}${resolvable('myType')}</div>`)
        prepareInputs();
    }

    function tryToAdd(t) {
        console.log("ADDING");
        addField(t);
    }

    function prepareInputs() {
        installAutoresize();
        $("input.keyword").unbind('keydown');
        $("input.keyword").on('keydown', function (e) {
            if (e.key == "ArrowRight") {
                e.preventDefault();
                Navigation.moveToNextElement(this);
                return true;
            } else if (e.key == "ArrowLeft") {
                e.preventDefault();
                Navigation.moveToPrevElement(this);
                return true;
            } else if (e.key == "Enter") {
                e.preventDefault();
                tryToAdd(this);
                return true;
            }
            return false;
        });
        $("input.editable").unbind('keydown');
        $("input.editable").on('keydown', function (e) {
            if (e.key == "ArrowRight") {
                if (this.selectionStart == $(this).val().length) {
                    e.preventDefault();
                    Navigation.moveToNextElement(this);
                    return true;
                }
            } else if (e.key == "ArrowLeft") {
                if (this.selectionStart == 0) {
                    e.preventDefault();
                    Navigation.moveToPrevElement(this);
                    return true;
                }
            } else if (e.key == "Enter") {
                e.preventDefault();
                tryToAdd(this);
                return true;
            } else {
                //console.log("K " + e.key);
            }
        });
        console.log("prepareInputs");
        $("input.resolvable").each(function () {
            console.log("install autocomplete");
            installAutocomplete(this, valuesProvider);
        });
    }

    function autocompleteTriggered(input, item) {
        input.value = item.label;
        $(input).inputWidthUpdate(myAutoresizeOptions);
        $(input).attr("selected-id", item.id);
        // $(input).addClass("selection-done");
    }

    function valuesProvider() {
        return [ { label: 'United Kingdom', value: 'UK', id: 'UK' },
            { label: 'United States', value: 'US', id: 'US' }
        ];
    }

    function installAutocomplete(input, valuesProvider) {
        $(input).keyup(function(){
            console.log("keyup autocomplete");
            let text = input.value.toLowerCase();
            console.log("VALUES " + valuesProvider());
            let matched = valuesProvider().filter(n => n.label.toLowerCase() == text);
            console.log("TEXT "+text+" MATCHED " + matched);
            if (matched.length == 1) {
                autocompleteTriggered(input, matched[0]);
            } else {
                $(input).attr("selected-id", null);
                //$(input).removeClass("selection-done");
            }
        });
        autocomplete({
            input: input,
            minLength: 0,
            fetch: function (text, update) {
                text = text.toLowerCase();
                //var suggestions = ["A", "B", "C", "doo", "foo"];
                var suggestions = valuesProvider().filter(n => n.label.toLowerCase().startsWith(text));
                update(suggestions);
            },
            onSelect: function (item) {
                autocompleteTriggered(input, item);
            }
        });
    }


});