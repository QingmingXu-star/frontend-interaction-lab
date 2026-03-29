export type PaperSize = "A4" | "A3" | "B5" | "Envelope" | "Square";
export type MarginType = "normal" | "narrow" | "wide" | "moderate";

export interface Settings {
    paperSize: PaperSize;
    marginType: MarginType;
    currency: string;
}

export interface CopyText {
    stageLabel: string;
    receiptTitle: string;
    receiptFooter: string;
    totalLabel: string;
    preparing: string;
    completed: string;
    loadErrorPrefix: string;
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
}

export interface MenuSection {
    title: string;
    options: MenuItem[];
}

export interface AppConfig {
    settings: Settings;
    copy: CopyText;
    menu: MenuSection[];
}

export interface AppState {
    config: AppConfig | null;
    menuData: MenuSection[];
    selections: MenuItem[];
    currentStep: number;
}

export interface Elements {
    menuContainer: HTMLElement;
    optionsList: HTMLElement;
    stepTitle: HTMLElement;
    toasterStage: HTMLElement;
    toasterWrapper: HTMLElement;
    finalList: HTMLElement;
    receipt: HTMLElement;
    receiptHeader: HTMLElement;
    receiptFooter: HTMLElement;
    token: HTMLElement;
    statusText: HTMLElement;
}