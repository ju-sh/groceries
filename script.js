class Item {
    constructor(id, name, cat, qty = 0, comment = "") {
        this.id = id;
        this.name = name;
        this.cat = cat;
        this.comment = comment;
        this.qty = qty;
    }

    createDOM() {
        let row = document.createElement('tr');
        let checkbox_td = document.createElement('td');
        let checkbox_inp = document.createElement('input');
        let name_td = document.createElement('td');
        let name_label = document.createElement('label');
        let qty_td = document.createElement('td');
        let qty_inp = document.createElement('input');
        let comment_td = document.createElement('td');
        let comment_inp = document.createElement('input');
    
        // row.addEventListener('click', handleItemClick);

        checkbox_inp.type = "checkbox";
        if (!isStrEmpty(this.id)) {
            checkbox_inp.id = this.id;
        }
        checkbox_inp.classList.add("checkbox");
        name_label.setAttribute('for', this.id);
        name_label.textContent = this.name;
        comment_inp.placeholder = "Comment"; 
        comment_inp.type = "text"; 
        qty_inp.type = "number"; 
        qty_inp.min = 0; 
        // qty_inp.value = this.qty;
        qty_inp.placeholder = "Qty";
        qty_inp.classList.add("qty");

        name_td.appendChild(name_label);
        qty_td.appendChild(qty_inp);
        comment_td.appendChild(comment_inp);
        checkbox_td.appendChild(checkbox_inp);
        row.appendChild(checkbox_td);
        row.appendChild(name_td);
        row.appendChild(qty_td);
        row.appendChild(comment_td);

        return row;
    }
}

class ListView {
    /*
     * items are like dictionaries indexed by string of category name
     * Value of each entry is an array of items belonging to that category.
     */
    constructor(cats, cats_ctr) {
        this.cats = cats;
        this.cats_ctr = cats_ctr;
    }

    static fromData(data) {
        try {
            // Ctr for each category. To generate ids
            let cats_ctr = {};

            let cats = {};

            for (const cat_data of data) {
                cats_ctr[cat_data.name] = 0;
                cats[cat_data.name] = [];

                for (const item_name of cat_data.items) {
                    let id_val = cat_data.name + "-" + cats_ctr[cat_data.name];
                    cats_ctr[cat_data.name]++;

                    let item = new Item(id_val, item_name, cat_data.name);
                    cats[cat_data.name].push(item);
                }
            }
	    cats_ctr["മറ്റുള്ളവ"] = 0;
	    cats["മറ്റുള്ളവ"] = [];

            return new ListView(cats);

        } catch (error) {
            console.error('Error loading data from json to variable:', error);
        }
    }

    createDOM() {
        let root = document.getElementById("the-table");

        for (let cat in this.cats) {
            let tbody = document.createElement('tbody');
            let heading_tr = document.createElement('tr');
            let heading_td = document.createElement('td');
            heading_td.textContent = cat;
            heading_td.colSpan = 4;
            heading_tr.appendChild(heading_td);
            heading_tr.classList.add("tbody-heading");
            tbody.id = cat;
            tbody.appendChild(heading_tr);
            //console.log(heading_tr);

            for (const item of this.cats[cat]) {
                let itemDOM = item.createDOM();
                tbody.appendChild(itemDOM)
            }
            let spacer_tr = document.createElement('tr');
	    spacer_tr.classList.add("spacer-row");
            tbody.appendChild(spacer_tr);
            root.appendChild(tbody)
        }
        // let other_tbody = document.createElement('tbody');
        // let heading_tr = document.createElement('tr');
        // let heading_td = document.createElement('td');
        //
        // heading_td.textContent = "മറ്റുള്ളവ";
        // heading_td.colSpan = 4;
        // heading_tr.appendChild(heading_td);
        // heading_tr.classList.add("tbody-heading");
        // other_tbody.id = "മറ്റുള്ളവ";
        // other_tbody.appendChild(heading_tr);
        // root.appendChild(other_tbody)

        let form = document.getElementById("the-form");
        let btn_other = document.createElement('button');
	btn_other.innerText = "New item";
	btn_other.id = "btn-new";
	btn_other.type = "button";
	form.appendChild(btn_other);

    }
}
    

async function getJSON(filename = "data.json") {
    try {
        const response = await fetch(filename);
        if(!response.ok) {
            throw new Error(`Couldn't load json data! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('JSON data obtained');
        return data.categories;
        
    } catch (error) {
        console.error('Error loading data from JSON:', error);
    }
}

async function init() {
    try {
        let data = await getJSON();

        let data_obj = ListView.fromData(data);
        console.log('ListView obj created');
        console.log(data_obj);

        data_obj.createDOM();
        console.log('ListView DOM created');
	
        // Make qty mandatory if item is checked
        const table = document.getElementById("the-table");
        table.addEventListener('change', (event) => {
            if (event.target.matches('input[type="checkbox"]')) {
                const row = event.target.closest('tr');
                const numberInput = row.querySelector('input[type="number"]');
                numberInput.required = event.target.checked;
            }
        });
	
	// Show modal-box only if form validates
        const form = document.getElementById('the-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
        
            if (form.checkValidity()) {
	        // Open modal-box if form validates
                displayOutput(data_obj.cats);
                dialog.showModal();
                console.log("Modal box opened");
            } else {
                // Enforce validation otherwise
                form.reportValidity();
            }
        });

        const dialog = document.getElementById("modal-box");
        const closeButton = document.getElementById("btn-close-modal");
    
        closeButton.addEventListener("click", () => {
            dialog.close();
            console.log("Modal box closed");
        });

        const newItemButton = document.getElementById("btn-new");
        newItemButton.addEventListener("click", () => {
	    createNewItem();
        });

        const copyButton = document.getElementById("btn-copy");
        copyButton.addEventListener("click", () => {
	    copyToClipboard();
        });
        console.log("Init over");


    } catch (error) {
        console.error('Error using the JSON data:', error);
    }
}

function makeToast(msg) {
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

function copyToClipboard() {
    const textarea = document.getElementById("output");
    navigator.clipboard.writeText(textarea.value);
    console.log("Copied to clipboard: " + textarea.value);
    makeToast("Copied!");
}

function createNewItem() {
    const other_tbody = document.getElementById("മറ്റുള്ളവ");

    let row = document.createElement('tr');
    let checkbox_td = document.createElement('td');
    let checkbox_inp = document.createElement('input');
    let name_td = document.createElement('td');
    let name_label = document.createElement('label');
    let name_inp = document.createElement('input');
    let qty_td = document.createElement('td');
    let qty_inp = document.createElement('input');
    let comment_td = document.createElement('td');
    let comment_inp = document.createElement('input');

    checkbox_inp.classList.add("checkbox");
    checkbox_inp.type = "checkbox";
    checkbox_inp.checked = true;
    // name_label.setAttribute('for', this.id);
    // name_label.textContent = this.name;
    name_inp.type = "text"; 
    name_inp.placeholder = "Name"; 
    comment_inp.placeholder = "Comment"; 
    comment_inp.type = "text"; 
    qty_inp.type = "number"; 
    qty_inp.min = 0; 
    // qty_inp.value = this.qty;
    qty_inp.placeholder = "Qty";
    qty_inp.classList.add("qty");

    name_label.appendChild(name_inp);
    name_td.appendChild(name_label);
    qty_td.appendChild(qty_inp);
    comment_td.appendChild(comment_inp);
    checkbox_td.appendChild(checkbox_inp);
    row.appendChild(checkbox_td);
    row.appendChild(name_td);
    row.appendChild(qty_td);
    row.appendChild(comment_td);
    

    // let item = new Item("", "", "മറ്റുള്ളവ", "");
    // let itemDOM = item.createDOM();
    other_tbody.appendChild(row);
}

function displayOutput() {
    let textarea = document.getElementById("output");
    
    textarea.value = "";
    console.log("Deleted current output");

    let checkedRows = [...document.querySelectorAll('tr:has(td input[type="checkbox"]:checked)')];
    console.log("Collected checked rows");
    
    let items = [];
    for (const row of checkedRows) {
        let name = row.querySelector("label").innerText;
	if(isStrEmpty(name)) {
            //name = row.querySelector("label > input[type='text']").value;
            name = row.querySelector("td:nth-child(2) label > input[type='text']").value;
	    console.log("Name: " + name);
        } 
        let qty = row.querySelector("input[type='number']").value;
        //let comment = row.querySelector("input[type='text']").value;
        let comment = row.querySelector("td:nth-child(4) input[type='text']").value;
	let item = new Item(row.id, name, "", qty, comment);
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

function isStrEmpty(str) {
    return (str.trim() === "");
}

window.addEventListener('DOMContentLoaded', init);
