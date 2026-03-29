import type { AppConfig, AppState, MenuItem } from "./types.js";

export const state: AppState = {
    config: null,
    menuData: [],
    selections: [],
    currentStep: 0
};

export function setConfig(config: AppConfig): void {
    state.config = config;
    state.menuData = config.menu || [];
}

export function addSelection(item: MenuItem): void {
    state.selections.push(item);
}

export function nextStep(): void {
    state.currentStep += 1;
}

export function resetOrder(): void {
    state.selections.length = 0;
    state.currentStep = 0;
}