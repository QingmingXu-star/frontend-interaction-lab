import { UI_CLASSES } from "./constants.js";
import { calculateTotal, formatPrice, assertElement } from "./utils.js";
import type { AppConfig, CopyText, Elements, MenuItem, MenuSection } from "./types.js";

export function createElements(): Elements {
    return {
        menuContainer: assertElement(document.getElementById("menu-container"), "menu-container"),
        optionsList: assertElement(document.getElementById("options-list"), "options-list"),
        stepTitle: assertElement(document.getElementById("step-title"), "step-title"),
        toasterStage: assertElement(document.getElementById("toaster-stage"), "toaster-stage"),
        toasterWrapper: assertElement(document.getElementById("toaster-wrapper"), "toaster-wrapper"),
        finalList: assertElement(document.getElementById("final-list"), "final-list"),
        receipt: assertElement(document.getElementById("receipt"), "receipt"),
        receiptHeader: assertElement(document.getElementById("receipt-header"), "receipt-header"),
        receiptFooter: assertElement(document.getElementById("receipt-footer"), "receipt-footer"),
        token: assertElement(document.getElementById("order-token"), "order-token"),
        statusText: assertElement(document.getElementById("status-text"), "status-text")
    };
}

export function renderStaticCopy(elements: Elements, copy: CopyText): void {
    elements.receiptHeader.innerText = copy.receiptTitle;
    elements.receiptFooter.innerText = copy.receiptFooter;
    elements.statusText.innerText = copy.preparing;
}

export function renderStep(
    elements: Elements,
    stepData: MenuSection,
    stepIndex: number,
    stageLabel: string,
    onSelect: (item: MenuItem) => void
): void {
    elements.stepTitle.innerText = `${stageLabel} ${stepIndex + 1}: ${stepData.title}`;
    elements.optionsList.innerHTML = "";
    elements.optionsList.classList.remove(UI_CLASSES.optionLeaving);

    stepData.options.forEach((item, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `block w-full py-4 text-lg text-gray-700 transition-all border border-transparent 
                            hover:text-black hover:bg-white hover:border-gray-200 hover:shadow-sm ${UI_CLASSES.optionEntering}`;
        button.style.animationDelay = `${index * 0.15}s`;
        button.innerText = item.name;
        button.dataset.itemId = item.id;
        button.onclick = () => onSelect(item);
        elements.optionsList.appendChild(button);
    });
}

export function renderReceipt(elements: Elements, selections: MenuItem[], config: AppConfig): void {
    const { currency } = config.settings;
    const { totalLabel } = config.copy;
    const total = calculateTotal(selections);

    elements.finalList.innerHTML = "";

    selections.forEach(item => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center mb-4";
        li.innerHTML = `
            <span class="font-medium">${item.name}</span>
            <span class="flex-grow border-b border-dotted border-gray-300 mx-2 mt-2"></span>
            <span class="font-mono text-gray-500">${formatPrice(item.price, currency)}</span>
        `;
        elements.finalList.appendChild(li);
    });

    const totalLi = document.createElement("li");
    totalLi.className = "flex justify-between items-center mt-6 pt-4 border-t border-gray-800 font-bold";
    totalLi.innerHTML = `
        <span>${totalLabel}</span>
        <span>${formatPrice(total, currency)}</span>
    `;
    elements.finalList.appendChild(totalLi);
}

export function renderError(elements: Elements, message: string): void {
    elements.stepTitle.innerText = message;
    elements.optionsList.innerHTML = "";
}