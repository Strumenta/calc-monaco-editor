function moveFocusToStart(next) {
    next.focus();
    let el = next[0];
    if (el != undefined && el.setSelectionRange != null) {
        el.setSelectionRange(0, 0);
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
    console.log("move to next element");
    // @ts-ignore
    let next = $(t).next();
    if (next.length == 0) {
        // @ts-ignore
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