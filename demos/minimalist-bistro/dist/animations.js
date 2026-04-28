import { ANIMATION_TIMINGS, UI_CLASSES } from "./constants.js";
import { sleep } from "./utils.js";
export async function animateToken(elements, itemName) {
    elements.token.classList.remove(UI_CLASSES.tokenVisible, UI_CLASSES.tokenDropping);
    elements.token.innerText = itemName;
    elements.token.offsetHeight;
    elements.token.classList.add(UI_CLASSES.tokenVisible);
    await sleep(ANIMATION_TIMINGS.tokenFadeInBuffer);
    elements.token.classList.remove(UI_CLASSES.tokenVisible);
    elements.token.classList.add(UI_CLASSES.tokenDropping);
    await sleep(ANIMATION_TIMINGS.tokenDropDuration);
}
export async function playToasterTransition(elements) {
    elements.toasterWrapper.classList.add(UI_CLASSES.toasterShifted);
    await sleep(ANIMATION_TIMINGS.toasterShift);
}
export function showReceipt(elements) {
    elements.receipt.classList.remove(UI_CLASSES.receiptHidden);
    elements.receipt.classList.add(UI_CLASSES.receiptRising);
}
export function showToasterStage(elements) {
    elements.menuContainer.classList.add("hidden");
    elements.toasterStage.classList.add(UI_CLASSES.toasterStageVisible);
}
export function markOptionsLeaving(elements) {
    elements.optionsList.classList.add(UI_CLASSES.optionLeaving);
}
export async function playSelectionSequence(elements, selections) {
    for (let i = 0; i < selections.length; i++) {
        await animateToken(elements, selections[i].name);
        if (i < selections.length - 1) {
            await sleep(ANIMATION_TIMINGS.tokenGap);
        }
    }
}
