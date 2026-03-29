import { ANIMATION_TIMINGS, UI_CLASSES } from "./constants.js";
import { sleep } from "./utils.js";
import type { Elements, MenuItem } from "./types.js";

export async function animateToken(elements: Elements, itemName: string): Promise<void> {
    elements.token.style.transition = "none";
    elements.token.style.opacity = "0";
    elements.token.style.transform = "translate(-50%, 0px)";
    elements.token.innerText = itemName;

    elements.token.offsetHeight;

    elements.token.style.transition = "opacity 0.3s ease-out";
    elements.token.style.opacity = "1";
    await sleep(ANIMATION_TIMINGS.tokenFadeInBuffer);

    elements.token.style.transition = "all 0.6s cubic-bezier(0.5, 0, 0.7, 0.4)";
    elements.token.style.opacity = "0";
    elements.token.style.transform = "translate(-50%, 50px)";

    await sleep(ANIMATION_TIMINGS.tokenDropDuration);
}

export async function playToasterTransition(elements: Elements): Promise<void> {
    elements.toasterWrapper.classList.add(UI_CLASSES.toasterShifted);
    await sleep(ANIMATION_TIMINGS.toasterShift);
}

export function showReceipt(elements: Elements): void {
    elements.receipt.classList.remove(UI_CLASSES.receiptHidden);
    elements.receipt.classList.add(UI_CLASSES.receiptRising);
}

export function showToasterStage(elements: Elements): void {
    elements.menuContainer.classList.add("hidden");
    elements.toasterStage.style.display = "flex";
}

export function markOptionsLeaving(elements: Elements): void {
    elements.optionsList.classList.add(UI_CLASSES.optionLeaving);
}

export async function playSelectionSequence(elements: Elements, selections: MenuItem[]): Promise<void> {
    for (let i = 0; i < selections.length; i++) {
        await animateToken(elements, selections[i].name);
        if (i < selections.length - 1) {
            await sleep(ANIMATION_TIMINGS.tokenGap);
        }
    }
}