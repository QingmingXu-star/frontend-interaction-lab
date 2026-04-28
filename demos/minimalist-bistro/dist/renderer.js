import { UI_CLASSES } from "./constants.js";
import { calculateTotal, formatPrice, assertElement } from "./utils.js";
export function createElements() {
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
export function renderStaticCopy(elements, copy) {
    elements.receiptHeader.innerText = copy.receiptTitle;
    elements.receiptFooter.innerText = copy.receiptFooter;
    elements.statusText.innerText = copy.preparing;
}
export function renderStep(elements, stepData, stepIndex, stageLabel, onSelect) {
    elements.stepTitle.innerText = `${stageLabel} ${stepIndex + 1}: ${stepData.title}`;
    elements.optionsList.innerHTML = "";
    elements.optionsList.classList.remove(UI_CLASSES.optionLeaving);
    stepData.options.forEach((item, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `menu-option-btn ${UI_CLASSES.optionEntering}`;
        button.style.animationDelay = `${index * 0.15}s`;
        button.innerText = item.name;
        button.dataset.itemId = item.id;
        button.onclick = () => onSelect(item);
        elements.optionsList.appendChild(button);
    });
}
export function renderReceipt(elements, selections, config) {
    const { currency } = config.settings;
    const { totalLabel } = config.copy;
    const total = calculateTotal(selections);
    elements.finalList.innerHTML = "";
    selections.forEach(item => {
        const li = document.createElement("li");
        li.className = "receipt-item";
        li.innerHTML = `
            <span class="receipt-item__name">${item.name}</span>
            <span class="receipt-item__dots"></span>
            <span class="receipt-item__price">${formatPrice(item.price, currency)}</span>
        `;
        elements.finalList.appendChild(li);
    });
    const totalLi = document.createElement("li");
    totalLi.className = "receipt-total";
    totalLi.innerHTML = `
        <span>${totalLabel}</span>
        <span>${formatPrice(total, currency)}</span>
    `;
    elements.finalList.appendChild(totalLi);
}
export function renderError(elements, message) {
    elements.stepTitle.innerText = message;
    elements.optionsList.innerHTML = "";
}
