const track = document.getElementById('track') as HTMLElement;
const viewport = document.querySelector('.viewport') as HTMLElement;
const colors: string[] = ['yellow', 'blue', 'red'];
const contents: string[] = ['content/content_1.JPG', 'content/content_2.PNG', 'content/content_3.JPG'];

let archWidth  = 0;
let archHeight = 0;
let gap        = 0;
let unitWidth  = 0;

let posX: number          = 0;
let speed: number         = 0;
let targetX: number | null = null;

let liftedUnit: HTMLElement | null                       = null;
let liftTimer:  ReturnType<typeof setTimeout> | null     = null;
let isZooming = false;
let tapSnap   = false; // true when snap was triggered by a single key tap

const TOTAL_UNITS = 15;
const LOOP_SIZE   = 3; // one cycle: yellow / blue / red

const img = new Image();
img.src = 'content/img.webp';

img.onload = (): void => {
    init();
    animate();
};

function init(): void {
    archHeight = window.innerHeight * 0.99;
    archWidth  = archHeight * (img.width / img.height);

    gap       = window.innerWidth * 0.1;
    unitWidth = archWidth + gap;

    // fcTop: fully proportional top offset for filler-corner and third-layer-content.
    // Derived from reference H=900 where fcTop = 1vh + 10px = 19px, archHeight = 891px → 19/891 ≈ 0.02132.
    // archImgTop maintains the invariant: archImgTop - fcTop = archHeight * 0.0393 at all screen sizes.
    const fcTop      = archHeight * 0.02132;
    const archImgTop = fcTop + archHeight * 0.0393;

    track.innerHTML = '';

    for (let i = 0; i < TOTAL_UNITS; i++) {
        const unit = document.createElement('div');
        unit.className  = 'arch-unit';
        unit.style.width = unitWidth + 'px';

        // arch opening clip-path (complement of filler-corner SVG notch)
        // filler-corner viewBox "0 0 100 50", preserveAspectRatio="none"
        // x scale: archWidth/100, y scale: (archHeight/2)/50
        // SVG arc r=35 is scaled up to min-valid r=37.5 (since chord/2=37.5 > 35)
        const fcW  = archWidth;
        const fcH  = archHeight / 2;
        const arcX1 = fcW * 0.15;
        const arcX2 = fcW * 0.90;
        const arcY  = fcH;
        const arcRx = fcW * 0.375;  // 37.5/100 * archWidth
        const arcRy = fcH * 0.75;   // 37.5/50  * (archHeight/2)
        // sweep=1 (CW from left→right) curves upward, matching the filler-corner notch
        // unified container: arch opening at top + rectangular body below, traced as one shape
        const unifiedClip = `path('M ${arcX1} ${arcY} A ${arcRx} ${arcRy} 0 0 1 ${arcX2} ${arcY} L ${arcX2} ${archHeight} L ${arcX1} ${archHeight} Z')`;

        unit.innerHTML = `
            <div class="content-container ${colors[i % 3]}"
                 style="width:${archWidth}px; height:${archHeight}px; clip-path:${unifiedClip};">
                <img src="${contents[i % 3]}" style="width:100%; height:100%; object-fit:cover; display:block;">
            </div>

            <div class="filler-top"></div>
            <div class="filler-side side-l" style="width:${gap / 2 + 1}px; height:${archHeight}px;"></div>
            <div class="filler-side side-r" style="width:${gap / 2 + 1}px; height:${archHeight}px;"></div>
            <div class="filler-corner" style="top:${fcTop}px; width:${archWidth}px; height:${archHeight / 2}px;">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none" width="100%" height="100%">
                    <path d="
                        M 0 0
                        L 100 0
                        L 100 50
                        L 90 50
                        A 35 35 0 0 0 15 50
                        L 0 50
                        Z
                    " fill="#f5f5dc"></path>
                </svg>
            </div>

            <img src="content/img.webp" class="arch-img"
                 style="width:${archWidth}px; height:${archHeight}px; top:${archImgTop}px;">
        `;

        const hitArea = document.createElement('div');
        hitArea.className  = 'arch-hit-area';
        hitArea.style.width = (archWidth * 0.75) + 'px';

        hitArea.addEventListener('mouseenter', () => {
            clearTimeout(liftTimer ?? undefined);
            liftTimer = setTimeout(() => {
                if (Math.abs(speed) > 2) return;
                if (liftedUnit && liftedUnit !== unit) {
                    liftedUnit.classList.remove('arch-unit--lifted');
                }
                unit.classList.add('arch-unit--lifted');
                liftedUnit = unit;
            }, 200);
        });

        hitArea.addEventListener('mouseleave', () => {
            clearTimeout(liftTimer ?? undefined);
            unit.classList.remove('arch-unit--lifted');
            if (liftedUnit === unit) liftedUnit = null;
        });

        hitArea.addEventListener('click', () => {
            const centeredIndex = Math.round((window.innerWidth / 2 - posX - unitWidth / 2) / unitWidth);
            if (i !== centeredIndex) return;
            triggerZoomThrough(unit);
        });

        unit.appendChild(hitArea);
        track.appendChild(unit);
    }

    // center an arch unit on init
    posX    = getSnapX(1);
    targetX = posX;
    applyLoopWrap();
    render();
}

// returns posX that centers the unit at `index` in the viewport
function getSnapX(index: number): number {
    const viewportCenter = window.innerWidth / 2;
    const unitCenter     = index * unitWidth + unitWidth / 2;
    return viewportCenter - unitCenter;
}

// finds the nearest snap position to the current posX
function getNearestSnapX(currentX: number): number {
    const viewportCenter = window.innerWidth / 2;
    const approxIndex    = Math.round((viewportCenter - currentX - unitWidth / 2) / unitWidth);
    return getSnapX(approxIndex);
}

// keep posX within one loop cycle so the infinite wrap stays seamless
function applyLoopWrap(): void {
    const resetPoint = unitWidth * LOOP_SIZE;

    while (posX > 0) {
        posX -= resetPoint;
        if (targetX !== null) targetX -= resetPoint;
    }

    while (posX <= -resetPoint) {
        posX += resetPoint;
        if (targetX !== null) targetX += resetPoint;
    }
}

function render(): void {
    track.style.transform = `translateX(${posX}px)`;
}

function triggerZoomThrough(unit: HTMLElement): void {
    isZooming = true;
    speed     = 0;
    targetX   = null;

    const contentEl = unit.querySelector('.content-container') as HTMLElement;
    const imgEl     = contentEl.querySelector('img') as HTMLImageElement;
    const rect      = contentEl.getBoundingClientRect();
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Freeze img at original size so it won't stretch with the expanding container
    imgEl.style.position = 'absolute';
    imgEl.style.width    = rect.width  + 'px';
    imgEl.style.height   = rect.height + 'px';
    imgEl.style.left     = '0';
    imgEl.style.top      = '0';

    // Place content-container as LOWER layer on body
    document.body.appendChild(contentEl);
    Object.assign(contentEl.style, {
        position:   'fixed',
        left:       rect.left + 'px',
        top:        rect.top  + 'px',
        bottom:     'auto',
        width:      rect.width  + 'px',
        height:     rect.height + 'px',
        transform:  'none',
        clipPath:   'none',
        background: '#f5f5dc',
        zIndex:     '1',        // lower layer
    });

    // Recompute arch-opening geometry (same formulas as init)
    const arcX1 = archWidth * 0.15;
    const arcX2 = archWidth * 0.90;
    const arcY  = archHeight / 2;

    // Upper layer — pillar backing masks inside the arch-unit (z-index 2,
    // behind arch-img z4 / filler-corner z3, but above removed content z1).
    // These are the rectangular masks on the lower left/right of the arch
    // pillars. Because they live inside the arch-unit → track → viewport,
    // they zoom together with the arch during the scale animation.
    const makePillarMask = (leftPx: number, widthPx: number): void => {
        const el = document.createElement('div');
        Object.assign(el.style, {
            position:      'absolute',
            left:          leftPx + 'px',
            bottom:        '0',
            width:         widthPx + 'px',
            height:        (archHeight - arcY) + 'px', // lower half only
            background:    '#f5f5dc',
            zIndex:        '2',
            pointerEvents: 'none',
        });
        unit.appendChild(el);
    };

    // In arch-unit coords the content area starts at gap/2 from the left edge
    const contentLeft = gap / 2;
    makePillarMask(contentLeft, arcX1);                        // left pillar
    makePillarMask(contentLeft + arcX2, archWidth - arcX2);    // right pillar

    // Wide side curtains inside viewport — mask adjacent arch units on
    // both sides so only the centered arch's opening is visible.
    const makeSidePanel = (leftPx: number, widthPx: number): void => {
        const el = document.createElement('div');
        Object.assign(el.style, {
            position:      'absolute',
            top:           '0',
            left:          leftPx + 'px',
            width:         widthPx + 'px',
            height:        '100%',
            background:    '#f5f5dc',
            zIndex:        '6',    // above filler-side (z-index 5)
            pointerEvents: 'none',
        });
        viewport.appendChild(el);
    };

    // viewport coords == window coords (viewport is at 0,0, no scroll)
    makeSidePanel(0, rect.left);                                          // left curtain
    makeSidePanel(rect.left + rect.width, w - rect.left - rect.width);   // right curtain

    document.body.style.background = '#f5f5dc';
    viewport.style.position        = 'relative';
    viewport.style.zIndex          = '100';
    viewport.style.background      = 'transparent';

    // Upper layer zooms: arch + side curtains rush toward the viewer
    viewport.classList.add('viewport--zooming');

    // Lower layer: slowly expand container to full screen
    requestAnimationFrame(() => requestAnimationFrame(() => {
        const transition           = 'left 1s ease, top 1s ease, width 1s ease, height 1s ease';
        contentEl.style.transition = transition;
        imgEl.style.transition     = 'left 1s ease, top 1s ease';

        contentEl.style.left   = '0';
        contentEl.style.top    = '0';
        contentEl.style.width  = w + 'px';
        contentEl.style.height = h + 'px';

        // img compensates for container moving left/up, staying visually fixed
        imgEl.style.left = rect.left + 'px';
        imgEl.style.top  = rect.top  + 'px';
    }));
}

function animate(): void {
    if (isZooming) { requestAnimationFrame(animate); return; }

    if (targetX !== null) {
        // snapping phase
        const diff = targetX - posX;
        posX += diff * (tapSnap ? 0.07 : 0.18);

        if (Math.abs(diff) < 0.5) {
            posX    = targetX;
            targetX = null;
            tapSnap = false;
        }
    } else {
        // momentum phase
        posX  += speed;
        speed *= 0.92;

        // trigger snap when speed is negligible
        if (Math.abs(speed) < 0.15) {
            speed   = 0;
            targetX = getNearestSnapX(posX);
        }
    }

    applyLoopWrap();
    render();
    requestAnimationFrame(animate);
}

window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

    if (!e.repeat) {
        // single tap: slow snap to adjacent unit
        const viewportCenter = window.innerWidth / 2;
        const currentIndex   = Math.round((viewportCenter - posX - unitWidth / 2) / unitWidth);
        const delta          = e.key === 'ArrowRight' ? 1 : -1;
        targetX = getSnapX(currentIndex + delta);
        tapSnap = true;
    } else {
        // held: continuous scroll
        targetX = null;
        tapSnap = false;
        if (e.key === 'ArrowRight') speed -= 5;
        if (e.key === 'ArrowLeft')  speed += 5;
    }
});

window.addEventListener('resize', () => {
    init();
});
