import Item from "./item.js";
import View from "./view.js";
import { jsonPath, FileData } from "./consts";

interface DomElements {
    tbody: HTMLTableSectionElement;
    tr: HTMLTableRowElement;
    td?: {[key: string]: HTMLTableCellElement};
    input?: {[key: string]: HTMLInputElement};
    label?: HTMLLabelElement;
}

function makeToast(msg: string) {
    // https://github.com/mdn/dom-examples/blob/main/popover-api/toast-popovers/index.js
    const popover = document.createElement("article");
    popover.popover = "manual";
    popover.classList.add("toast");
    popover.textContent = msg;
    document.body.appendChild(popover);

    popover.showPopover();

    // Remove message after 4 seconds
    setTimeout(() => {
        popover.hidePopover();
        popover.remove();
    }, 4000);
}

function copyToClipboard(idVal: string) {
    const textarea = document.getElementById(idVal);
    if (!(textarea instanceof HTMLTextAreaElement)) {
        console.warn("Copy-to-clipboard: Could not find area to copy from! Exiting.");
        return;
    }

    navigator.clipboard.writeText(textarea.value);
    console.log("Copied to clipboard: " + textarea.value);
    makeToast("Copied!");
}

function createNewItem(idVal: string) {
    const tbody = document.getElementById(idVal);
    if (!(tbody instanceof HTMLTableSectionElement)) {
        console.warn("Could not find id to add more items. Exiting.");
        return;
    }

    const dom: DomElements = {
        tbody: tbody,
        tr: document.createElement("tr")
    };
    dom.td = {};
    dom.input = {};

    dom.td["checkbox"] = document.createElement("td");
    dom.input["checkbox"] = document.createElement("input");
    dom.td["name"] = document.createElement("td");
    dom.label = document.createElement("label");
    dom.input["name"] = document.createElement("input");
    dom.td["qty"] = document.createElement("td");
    dom.input["qty"] = document.createElement("input");
    dom.td["comment"] = document.createElement("td");
    dom.input["comment"] = document.createElement("input");

    dom.input["checkbox"].classList.add("checkbox");
    dom.input["checkbox"].type = "checkbox";
    dom.input["checkbox"].checked = true;
    // name_label.setAttribute('for', this.id);
    // name_label.textContent = this.name;
    dom.input["name"].type = "text"; 
    dom.input["name"].placeholder = "Name"; 
    dom.input["comment"].placeholder = "Comment"; 
    dom.input["comment"].type = "text"; 
    dom.input["qty"].type = "number"; 
    dom.input["qty"].min = "0"; 
    // qty_inp.value = this.qty;
    dom.input["qty"].placeholder = "Qty";
    dom.input["qty"].classList.add("qty");

    dom.label.appendChild(dom.input["name"]);
    dom.td["name"].appendChild(dom.label);
    dom.td["qty"].appendChild(dom.input["qty"]);
    dom.td["comment"].appendChild(dom.input["comment"]);
    dom.td["checkbox"].appendChild(dom.input["checkbox"]);
    dom.tr.appendChild(dom.td["checkbox"]);
    dom.tr.appendChild(dom.td["name"]);
    dom.tr.appendChild(dom.td["qty"]);
    dom.tr.appendChild(dom.td["comment"]);

    // let item = new Item("", "", "മറ്റുള്ളവ", "");
    // let itemDOM = item.createDOM();
    dom.tbody.appendChild(dom.tr);
}

function displayOutput() {
    const textarea = document.getElementById("output");
    if (!(textarea instanceof HTMLTextAreaElement)) {
        console.warn("Could not find area to display output! Exiting.");
        return;
    }
    textarea.value = "";
    console.log("Deleted current output");

    const checkedRows = [...document.querySelectorAll('tr:has(td input[type="checkbox"]:checked)')];
    console.log("Collected checked rows");
    
    const items = [];
    for (const row of checkedRows) {
        const label = row.querySelector("label");
        if (!(label instanceof HTMLLabelElement)) {
	    console.warn("Could not find label tag for an item. Skipping.");
            continue;
	}

        let name = label.innerText;
	if(isStrEmpty(name)) {
            //name = row.querySelector("label > input[type='text']").value;
	    const input = row.querySelector("td:nth-child(2) label > input[type='text']");
            if (!(input instanceof HTMLInputElement)) {
               console.warn("Could not find input tag for an item. Skipping.");
               continue;
            }
            name = input.value;
        } 
	console.log("Name: " + name);

        const qtyInp = row.querySelector("input[type='number']");
        if (!(qtyInp instanceof HTMLInputElement)) {
           console.warn("Could not find input tag for qty. Skipping.");
           continue;
        }
        const qty = qtyInp.value;

        //let comment = row.querySelector("input[type='text']").value;
        const commentInp = row.querySelector("td:nth-child(4) input[type='text']");
        if (!(commentInp instanceof HTMLInputElement)) {
           console.warn("Could not find input tag for comment. Skipping.");
           continue;
        }
        const comment = commentInp.value;
	const item = new Item(row.id, name, "", qty, comment);
	items.push(item);
    }

    // let textarea = document.createElement('textarea');
    // textarea.value = "";
    // textarea.readOnly = true;
    for (const item of items) {
	let line = " - " + item.name + ": " + item.qty;
        if (!isStrEmpty(item.comment)) {
            line += " (" + item.comment + ")";
	}     
	line += "\n";
        textarea.value += line;
        // // let li = document.createElement('li');
        // textarea.value += " - " + item.name + ": " + item.qty;
        // if (!(item.comment.trim() === "")) {
        //     li.textContent += " (" + item.comment + ")";
	// }     
        // root.appendChild(li);
    }
    console.log("Output added to dialog DOM");
}

function isStrEmpty(str: string): boolean {
    return (str.trim() === "");
}


export { copyToClipboard, createNewItem, displayOutput };
