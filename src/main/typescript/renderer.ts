// @ts-ignore
const hparser = require('html2hscript');

export function render(node, cb) {
    console.log("Rendering " + node);
    let html = "<div class='type-definition'><input class='keyword' value='type'> <input class='editable' value='My type' required> <input class='keyword' value='{'/>"
         +"<div class='fields'><span class='message'>no fields</span><br><div class='fields-container'></div></div><input class='keyword' value='}'></div>";
    hparser(html, function(err, hscript) {
        console.log("HSCRIPT IN RENDER");
        console.log(hscript);
        cb(hscript);
    });
}
