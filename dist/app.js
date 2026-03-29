import { ANIMATION_TIMINGS } from "./constants.js";
import { state, setConfig, addSelection, nextStep } from "./state.js";
import { applyReceiptCssVariables, sleep } from "./utils.js";
import { createElements, renderStaticCopy, renderStep, renderReceipt, renderError } from "./renderer.js";
import { showToasterStage, markOptionsLeaving, playSelectionSequence, playToasterTransition, showReceipt } from "./animations.js";
const elements = createElements();
async function fetchConfig() {
    const response = await fetch("./data.json");
    if (!response.ok) {
        throw new Error(`无法找到 data.json，错误代码: ${response.status}`);
    }
    const text = await response.text();
    if (!text) {
        throw new Error("data.json 文件是空的！");
    }
    return JSON.parse(text);
}
function loadCurrentStep() {
    const stepData = state.menuData[state.currentStep];
    renderStep(elements, stepData, state.currentStep, state.config.copy.stageLabel, handleSelect);
}
async function handleSelect(item) {
    addSelection(item);
    markOptionsLeaving(elements);
    await sleep(ANIMATION_TIMINGS.optionLeave);
    nextStep();
    if (state.currentStep < state.menuData.length) {
        loadCurrentStep();
        return;
    }
    await finishOrder();
}
async function finishOrder() {
    showToasterStage(elements);
    await playSelectionSequence(elements, state.selections);
    await playToasterTransition(elements);
    renderReceipt(elements, state.selections, state.config);
    showReceipt(elements);
    elements.statusText.innerText = state.config.copy.completed;
}
async function init() {
    try {
        const config = await fetchConfig();
        setConfig(config);
        applyReceiptCssVariables(config.settings);
        renderStaticCopy(elements, config.copy);
        loadCurrentStep();
    }
    catch (error) {
        console.error("加载数据失败:", error);
        const message = error instanceof Error ? error.message : "未知错误";
        const prefix = state.config?.copy?.loadErrorPrefix || "加载失败: ";
        renderError(elements, `${prefix}${message}`);
    }
}
void init();
