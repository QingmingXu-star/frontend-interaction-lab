import { MARGIN_PRESETS, PAPER_SIZES } from "./constants.js";
import type { MenuItem, Settings } from "./types.js";

export function calculateTotal(items: MenuItem[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
}

export function formatPrice(amount: number, currency: string): string {
    return `${currency}${amount}`;
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getPaperSizeValue(paperSize: Settings["paperSize"]): string {
    return PAPER_SIZES[paperSize] || PAPER_SIZES.A4;
}

export function getMarginValue(marginType: Settings["marginType"]): string {
    return MARGIN_PRESETS[marginType] || MARGIN_PRESETS.normal;
}

export function applyReceiptCssVariables(settings: Settings): void {
    const root = document.documentElement;
    root.style.setProperty("--receipt-height", getPaperSizeValue(settings.paperSize));
    root.style.setProperty("--receipt-padding", getMarginValue(settings.marginType));
}

export function assertElement<T extends HTMLElement>(element: T | null, id: string): T {
    if (!element) {
        throw new Error(`缺少必要的 DOM 节点: #${id}`);
    }
    return element;
}