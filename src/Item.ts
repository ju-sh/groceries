interface DomElements {
    tr?: {[key: string]: HTMLTableRowElement};
    td?: {[key: string]: HTMLTableCellElement};
    input?: {[key: string]: HTMLInputElement};
    label?: {[key: string]: HTMLLabelElement};

    // Fallback for other tags
    // [tag: string]: { [key: string]: HTMLElement } | undefined;
}

class Item {
    // id: string;
    // name: string;
    // cat: string;
    // qty: number;
    // comment: string;

    constructor(
        public id: string,
        public name: string,
        public cat: string,
        public qty: number = 0,
        public comment: string = ""
    ) {
        this.id = id;
        this.name = name;
        this.cat = cat;
        this.comment = comment;
        this.qty = qty;
    }

    createDOM() {
        const dom: DomElements = {};
        dom.tr = {};
        dom.td = {};
        dom.input = {};
        dom.label = {};

        dom.tr["row"] = document.createElement("tr");
        dom.td["checkbox"] = document.createElement("td");
        dom.input["checkbox"] = document.createElement("input");
        dom.td["name"] = document.createElement("td");
        dom.label["name"] = document.createElement("label");
        dom.td["qty"] = document.createElement("td");
        dom.input["qty"] = document.createElement("input");
        dom.td["comment"] = document.createElement("td");
        dom.input["comment"] = document.createElement("input");
    
        dom.input["checkbox"].type = "checkbox";
        dom.input["checkbox"].id = this.id;
        dom.input["checkbox"].classList.add("checkbox");
      
        dom.label["name"].setAttribute('for', this.id);
        dom.label["name"].textContent = this.name;
        dom.input["comment"].placeholder = "Comment"; 
        dom.input["comment"].type = "text"; 
        dom.input["qty"].type = "number"; 
        // dom.input["qty"].value = this.qty; 
        dom.input["qty"].placeholder = "Qty";
        dom.input["qty"].classList.add("qty");

        dom.td["name"].appendChild(dom.label["name"]);
        dom.td["qty"].appendChild(dom.input["qty"]);
        dom.td["comment"].appendChild(dom.input["comment"]);
        dom.td["checkbox"].appendChild(dom.input["checkbox"]);
        dom.tr["row"].appendChild(dom.td["checkbox"]);
        dom.tr["row"].appendChild(dom.td["name"]);
        dom.tr["row"].appendChild((dom.td["qty"]));
        dom.tr["row"].appendChild(dom.td["comment"]);

        return dom.tr["row"];
    }
}


// // Named exports
// export { fun_name };

// Default export
export default Item;
