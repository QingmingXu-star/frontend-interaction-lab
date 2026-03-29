export const state = {
    config: null,
    menuData: [],
    selections: [],
    currentStep: 0
};
export function setConfig(config) {
    state.config = config;
    state.menuData = config.menu || [];
}
export function addSelection(item) {
    state.selections.push(item);
}
export function nextStep() {
    state.currentStep += 1;
}
export function resetOrder() {
    state.selections.length = 0;
    state.currentStep = 0;
}
