import { MARGIN_PRESETS, PAPER_SIZES } from "./constants.js";
export function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}
export function formatPrice(amount, currency) {
    return `${currency}${amount}`;
}
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function getPaperSizeValue(paperSize) {
    return PAPER_SIZES[paperSize] || PAPER_SIZES.A4;
}
export function getMarginValue(marginType) {
    return MARGIN_PRESETS[marginType] || MARGIN_PRESETS.normal;
}
export function applyReceiptCssVariables(settings) {
    const root = document.documentElement;
    root.style.setProperty("--receipt-height", getPaperSizeValue(settings.paperSize));
    root.style.setProperty("--receipt-padding", getMarginValue(settings.marginType));
}
export function assertElement(element, id) {
    if (!element) {
        throw new Error(`缺少必要的 DOM 节点: #${id}`);
    }
    return element;
}
