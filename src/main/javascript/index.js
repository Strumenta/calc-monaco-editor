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

    function moveToPrevElement(t) {
        console.log("move to prev element");
        window.t = t;
        let elConsidered = $(t).prev();
        do {
            let tag = elConsidered.prop("tagName");
            if (tag == "INPUT") {
                console.log("prev is input");
                elConsidered.focus();
                let el = elConsidered[0];
                if (el != undefined && el.setSelectionRange != null) {
                    el.setSelectionRange(0, 0);
                    let text = elConsidered.val();
                    el.setSelectionRange(text.length, text.length);
                }
                return;
            } else if (tag == "DIV") {
                console.log("prev is div");
                if (elConsidered.find("input").length == 0) {
                    elConsidered = findPrev(elConsidered);
                    console.log("prev IS NOW " + elConsidered[0]);
                } else {
                    console.log("prev is div not empty");
                    return;
                }
            } else if (tag == "SPAN") {
                elConsidered = findPrev(elConsidered);
                console.log("prev IS NOW " + elConsidered[0]);
            } else {
                console.log("prev is unknown " + tag);
                return;
            }
        } while (true);
    }

    function findNext(n) {
        console.log("NEXT WAS " + n[0]);
        if (n.next() == undefined) {
            return undefined;
        } else {
            return n.next();
        }
    }

    function findPrev(n) {
        console.log("PREV WAS " + n[0]);
        if (n.prev() == undefined) {
            return undefined;
        } else {
            return n.prev();
        }
    }

    function moveFocusToStart(next) {
        next.focus();
        let el = next[0];
        if (el != undefined && el.setSelectionRange != null) {
            el.setSelectionRange(0, 0);
        }
    }

    function moveToNextElement(t) {
        console.log("move to next element");
        window.t = t;
        let next = $(t).next();
        if (next.length == 0) {
            moveToNextElement($(t).parent());
            return;
        }
        console.log("NEXT CALCULATED AS " + next.length);
        do {
            let tag = next.prop("tagName");
            if (tag == "INPUT") {
                console.log("  next is input");
                moveFocusToStart(next);
                return;
            } else if (tag == "DIV") {
                console.log("  next is div");
                if (next.find("input").length == 0) {
                    next = findNext(next);
                    console.log("  NEXT IS NOW " + next[0]);
                } else {
                    next = next.find("input").first();
                    console.log("  NEXT IS NOW input child " + next[0] + " "+next.length);
                    console.log(next[0]);
                    moveFocusToStart(next);
                    return;
                }
            } else if (tag == "SPAN") {
                next = findNext(next);
                console.log("  (span) NEXT IS NOW " + next[0]);
            } else {
                console.log("  next is unknown " + tag);
                return;
            }
        } while (true);
    }

    function keyword(text) {
        return "<input class='keyword' value='" + text + "'>";
    }

    function editCell(text) {
        return "<input class='editable' value='" + text + "'>";
    }

    function addField(t) {
        $(t).siblings(".fields").find(".message").hide();
        $(t).siblings(".fields").append(`<div class='field'>${keyword('field')}${editCell('myField')}${keyword('of type')}${editCell('myType')}</div>`)
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
                moveToNextElement(this);
                return true;
            } else if (e.key == "ArrowLeft") {
                e.preventDefault();
                moveToPrevElement(this);
                return true;
            } else if (e.key == "Enter") {
                e.preventDefault();
                tryToAdd(this);
                return true;
            }
        });
        $("input.editable").unbind('keydown');
        $("input.editable").on('keydown', function (e) {
            if (e.key == "ArrowRight") {
                if (this.selectionStart == $(this).val().length) {
                    e.preventDefault();
                    moveToNextElement(this);
                    return true;
                }
            } else if (e.key == "ArrowLeft") {
                if (this.selectionStart == 0) {
                    e.preventDefault();
                    moveToPrevElement(this);
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
    }


});