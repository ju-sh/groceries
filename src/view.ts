import Item, { groupItemsByCategory } from "./item";
import { FileData } from "./consts";

interface DomElements {
    table: HTMLTableElement;
    form: HTMLFormElement;
    tbody?: {[key: string]: HTMLTableSectionElement};
    tr?: {[key: string]: HTMLTableRowElement};
    td?: {[key: string]: HTMLTableCellElement};
    button?: {[key: string]: HTMLButtonElement};
}

class View {
    constructor(public items: Item[]) {
        this.items = items;
        // this.cats_ctr = cats_ctr;
        // if("lastModified" in localStorage) {
        //     this.lastModified = localStorage.;
        // }{
        //     this.lastModified = Date.now();
        //     //localStorage.clear();
        // }
    }

    static fromData(data: FileData[]): View {
        // Current cat idx. To generate ids
        // Index 0 is for misc.
        let catIdx = 1;

        // Counters for each category. To generate ids
        // Index corresponds to category
        let ctrs = [0];

        let items = [];
        for (const catData of data) {
            ctrs.push(0);

            for (const itemName of catData.items) {
                let idVal = "c" + catIdx + "-" + "i" + ctrs[catIdx];
                ctrs[catIdx]++;

                let item = new Item(idVal, itemName, catData.category);
                items.push(item);
            }
        }
        return new View(items);
    }

    createDOM() {
        const table = document.getElementById("the-table");
        if (!(table instanceof HTMLTableElement)) {
            console.warn("Could not find 'the-table'. Exiting.");
            return;
        }

        const form = document.getElementById("the-form");
        if (!(form instanceof HTMLFormElement)) {
            console.warn("Could not find 'the-form'. Exiting.");
            return;
        }

        const dom: DomElements = {
            table: table,
            form: form
        };
        dom.tbody = {};
        dom.tr = {};
        dom.td = {};
        dom.button = {};

        const groupedItems: {[category: string]: Item[]} =
        groupItemsByCategory(this.items);

        for (const cat in groupedItems) {
            dom.tbody["tbody"] = document.createElement('tbody');
            dom.tr["heading"] = document.createElement('tr');
            dom.td["heading"] = document.createElement('td');

            dom.td["heading"].textContent = cat;
            dom.td["heading"].colSpan = 4;
            dom.tr["heading"].appendChild(dom.td["heading"]);
            dom.tr["heading"].classList.add("tbody-heading");
            dom.tbody["tbody"].id = cat;
            dom.tbody["tbody"].appendChild(dom.tr["heading"]);

            for (const item of groupedItems[cat]) {
                const itemDOM = item.createDOM();
                dom.tbody["tbody"].appendChild(itemDOM)
            }
            dom.tr["spacer"] = document.createElement('tr');
            dom.tr["spacer"].classList.add("spacer-row");
            dom.tbody["tbody"].appendChild(dom.tr["spacer"]);
            dom.table.appendChild(dom.tbody["tbody"])
        }

        dom.button["new"] = document.createElement("button");
        dom.button["new"].innerText = "New item";
        dom.button["new"].id = "btn-new";
        dom.button["new"].type = "button";
        dom.form.appendChild(dom.button["new"]);
    }
}

export default View;
