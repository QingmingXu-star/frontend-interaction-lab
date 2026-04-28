import type { MarginType, PaperSize } from "./types.js";

export const PAPER_SIZES: Record<PaperSize, string> = {
    A4: "61.8vh",
    A3: "85vh",
    B5: "50vh",
    Envelope: "30vh",
    Square: "40vh"
};

export const MARGIN_PRESETS: Record<MarginType, string> = {
    normal: "2.5rem 2rem",
    narrow: "1.5rem 1rem",
    wide: "4rem 3rem",
    moderate: "2.5rem 3.5rem"
};

export const ANIMATION_TIMINGS = {
    optionLeave: 550,
    tokenFadeInBuffer: 500,
    tokenDropDuration: 300,
    tokenGap: 200,
    toasterShift: 1300
} as const;

export const UI_CLASSES = {
    optionEntering: "is-entering",
    optionLeaving: "is-leaving",
    receiptHidden: "is-hidden",
    receiptRising: "receipt-paper--rising",
    toasterShifted: "toaster-wrapper--shifted",
    toasterStageVisible: "toaster-stage--visible",
    tokenVisible: "token--visible",
    tokenDropping: "token--dropping"
} as const;