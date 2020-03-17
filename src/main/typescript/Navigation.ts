function moveFocusToStart(next) {
    next.focus();
    let el = next[0];
    if (el != undefined && el.setSelectionRange != null) {
        el.setSelectionRange(0, 0);
    }
}

function moveFocusToEnd(next) {
    next.focus();
    let el = next[0];
    if (el != undefined && el.setSelectionRange != null) {
        let text = next.val();
        el.setSelectionRange(text.length, text.length);
    }
}

function findNext(n) {
    console.log("NEXT WAS " + n[0]);
    if (n.next() == undefined) {
        return undefined;
    } else {
        return n.next();
    }
}

export function moveToNextElement(t) {
    //console.log("move to next element");
    // @ts-ignore
    let next = $(t).next();
    if (next.length == 0) {
        // @ts-ignore
        //console.log("no next brother, moving up to parent", $(t).parent());
        // @ts-ignore
        var parent = $(t).parent();
        if ((parent).hasClass("editor")) {
            // cannot move outside the editor;
            // @ts-ignore
            window.errorSound.play();
            return false;
        }
        // @ts-ignore
        moveToNextElement($(t).parent());
        return;
    }
    //console.log("NEXT CALCULATED AS " + next.length);
    do {
        let tag = next.prop("tagName");
        if (tag == "INPUT") {
            console.log("  next is input");
            moveFocusToStart(next);
            return;
        } else if (tag == "DIV") {
            //console.log("  next is div");
            if (next.find("input").length == 0) {
                next = findNext(next);
                //console.log("  NEXT IS NOW " + next[0]);
            } else {
                next = next.find("input").first();
                //console.log("  NEXT IS NOW input child " + next[0] + " "+next.length);
                //console.log(next[0]);
                moveFocusToStart(next);
                return;
            }
        } else if (tag == "SPAN") {
            next = findNext(next);
            //console.log("  (span) NEXT IS NOW " + next[0]);
        } else {
            //console.log("  next is unknown " + tag);
            return;
        }
    } while (true);
}

export function moveToPrevElement(t) {
    //console.log("move to prev element");
    // @ts-ignore
    let elConsidered = $(t).prev();

    do {
        if (elConsidered.length == 0) {
            // @ts-ignore
            moveToPrevElement($(t).parent());
            return;
        }
        let tag = elConsidered.prop("tagName");
        if (tag == "INPUT") {
            //console.log("prev is input");
            moveFocusToEnd(elConsidered);
            return;
        } else if (tag == "DIV") {
            //console.log("prev is div");
            if (elConsidered.find("input").length == 0) {
                elConsidered = findPrev(elConsidered);
                //console.log("prev IS NOW " + elConsidered[0]);
            } else {
                elConsidered = elConsidered.find("input").last();
                //console.log("  PREV IS NOW input child " + elConsidered[0] + " "+elConsidered.length);
                //console.log(elConsidered[0]);
                moveFocusToEnd(elConsidered);
                return;
            }
        } else if (tag == "SPAN") {
            elConsidered = findPrev(elConsidered);
            //console.log("prev IS NOW " + elConsidered[0]);
        } else if (tag == "BR") {
            elConsidered = elConsidered.prev();
        } else {
            //console.log("prev is unknown " + tag);
            // @ts-ignore
            window.errorSound.play();
            return;
        }
    } while (true);
}


function findPrev(n) {
    console.log("PREV WAS " + n[0]);
    if (n.prev() == undefined) {
        return undefined;
    } else {
        return n.prev();
    }
}