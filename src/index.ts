import View from "./view";
import { copyToClipboard, createNewItem, displayOutput } from "./utils";
import { jsonPath, FileData } from "./consts";

async function getJSON(
    filename: string = jsonPath
): Promise<FileData[] | undefined> {
    try {
        const response = await fetch(filename);
        if(!response.ok) {
            throw new Error(`Couldn't load json data! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('JSON data obtained');
        return data;
        
    } catch (error) {
        console.error('Error loading data from JSON:', error);
    }
}

async function init() {
    try {
        const data = await getJSON();
        if(!data) {
            console.warn("Could not load data from JSON. Exiting.");
            return;
        }

        const view = View.fromData(data);
        console.log('View obj created');
        console.log(view);

        view.createDOM();
        console.log('View DOM created');
	
        // Make qty mandatory if item is checked
        const table = document.getElementById("the-table");
        if (!(table instanceof HTMLTableElement)) {
            console.warn("Could not find 'the-table'. Exiting.");
            return;
        }
        table.addEventListener('change', (event) => {
            if(!(event.target instanceof HTMLInputElement)) {
                console.warn("Could not find checkbox in event");
                return;
            }
            if (event.target.matches('input[type="checkbox"]')) {
                const row = event.target.closest('tr');
                if(!(row instanceof HTMLTableRowElement)) {
                    console.warn("Could not find row of checked checkbox");
                    return;
                }
                const numberInput = row.querySelector('input[type="number"]');
                if(!(numberInput instanceof HTMLInputElement)) {
                    console.warn("Could not find number input of row for checked checkbox");
                    return;
                }
                numberInput.required = event.target.checked;
            }
        });
	
	// Show modal-box only if form validates
        const form = document.getElementById('the-form');
        if (!(form instanceof HTMLFormElement)) {
            console.warn("Could not find 'the-form'. Exiting.");
            return;
        } else {
            const dialog = document.getElementById("modal-box");
            if (!(dialog instanceof HTMLDialogElement)) {
                console.warn("Could not find dialog.");
                return;
            } else {
                const copyButton = document.getElementById("btn-copy");
                if (!(copyButton instanceof HTMLButtonElement)) {
                    console.warn("Could not find new-item button.");
                    return;
                } else {
                    copyButton.addEventListener("click", () => {
	                copyToClipboard("output");
                    });
                }

                const closeButton = document.getElementById("btn-close-modal");
                if (!(closeButton instanceof HTMLButtonElement)) {
                    console.warn("Could not find close button.");
                    return;
                } else {
                    closeButton.addEventListener("click", () => {
                        dialog.close();
                        console.log("Modal box closed");
                    });
                }
            }
	  
            form.addEventListener('submit', (event) => {
                event.preventDefault();
            
                if (form.checkValidity()) {
                    // Open modal-box if form validates
                    displayOutput();
                    dialog.showModal();
                    console.log("Modal box opened");
                } else {
                    // Enforce validation otherwise
                    form.reportValidity();
                }
            });

            const newItemButton = document.getElementById("btn-new");
            if (!(newItemButton instanceof HTMLButtonElement)) {
                console.warn("Could not find new-item button.");
                return;
            } else {
                newItemButton.addEventListener("click", () => {
                                 	        createNewItem("മറ്റുള്ളവ");
                });
            }
        }

        console.log("Init over");
    } catch (error) {
        console.error('Error using the JSON data:', error);
    }
}

window.addEventListener('DOMContentLoaded', init);
