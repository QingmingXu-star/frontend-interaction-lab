"use strict";
/* ─────────────────────────────────────────
   时序常量 — 所有动画节奏集中在此调整
───────────────────────────────────────── */
const FLIP_DUR = 1200;
const FLIP_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const T = {
    startDelay: 200,
    phase2Delay: FLIP_DUR + 350,
    cursorMove: 203,
    keyDown: 42,
    keyHold: 54,
    keyGap: 72,
    keyRecover: 72,
    endOutside: 384,
    endArriveSend: 225,
    sendPress: 63,
    cursorFade: 72,
};
const KEEP_KEYS = ['w', 'i', 'o', 'a', 'h', 'm', '?', 'space', 'send', 'delete', 'caps'];
const TYPING_SEQ = [
    { k: 'w', ch: 'W' },
    { k: 'h', ch: 'H' },
    { k: 'o', ch: 'O' },
    { k: 'space', ch: '\u2009\u2009' },
    { k: 'i', ch: 'I' },
    { k: 'space', ch: '\u2009\u2009' },
    { k: 'a', ch: 'A' },
    { k: 'm', ch: 'M' },
    { k: 'space', ch: '\u2009\u2009' },
];
const CURSOR_SVG = `<svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 22" width="18" height="22">
    <path d="M2 1 L2 18 L6 13.5 L8.8 20 L11 19 L8.2 12.5 L14 12.5 Z"
          fill="white" stroke="#1d1d1f" stroke-width="1.4"
          stroke-linejoin="round" stroke-linecap="round"/>
</svg>`;
/* ─────────────────────────────────────────
   Phase 1 — 键盘变换（消失 + FLIP 收缩）
───────────────────────────────────────── */
function startAnimation() {
    const keyboard = document.getElementById('keyboard');
    document.querySelectorAll('.key').forEach(key => {
        var _a;
        if (!KEEP_KEYS.includes((_a = key.dataset['k']) !== null && _a !== void 0 ? _a : '')) {
            setTimeout(() => {
                key.classList.add('vanish');
                setTimeout(() => key.remove(), 700);
            }, Math.random() * 500);
        }
    });
    setTimeout(() => {
        const row2 = document.getElementById('row2');
        const row3 = document.getElementById('row3');
        // First — 记录存活键位置
        const survivors = [
            ...row2.querySelectorAll('.key:not(.vanish)'),
            ...row3.querySelectorAll('.key:not(.vanish)'),
            ...document.querySelectorAll('#row-bottom .key:not(.vanish)'),
        ];
        const firstRects = new Map(survivors.map(k => [k, k.getBoundingClientRect()]));
        // Last — DOM 变更 + 添加收缩态
        [...row3.children].forEach(child => {
            const key = child;
            key.dataset['k'] === 'caps'
                ? row2.insertBefore(key, row2.firstChild)
                : row2.appendChild(key);
        });
        row3.remove();
        keyboard.classList.add('shrunk');
        // Invert — 瞬移回旧位置（无 transition）
        survivors.forEach(key => {
            const first = firstRects.get(key);
            const last = key.getBoundingClientRect();
            const dx = first.left - last.left;
            const dy = first.top - last.top;
            const sx = last.width === 0 ? 1 : first.width / last.width;
            const sy = last.height === 0 ? 1 : first.height / last.height;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 &&
                Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01)
                return;
            key.style.transition = 'none';
            key.style.transformOrigin = '0 0';
            key.style.transform = `translate(${dx}px,${dy}px) scale(${sx},${sy})`;
        });
        keyboard.getBoundingClientRect(); // force reflow
        // Play — 下帧启动 transform 过渡
        requestAnimationFrame(() => {
            survivors.forEach(key => {
                key.style.transition = `transform ${FLIP_DUR}ms ${FLIP_EASE}`;
                key.style.transform = '';
                const cleanup = (e) => {
                    if (e.propertyName !== 'transform')
                        return;
                    key.style.transition = '';
                    key.style.transform = '';
                    key.style.transformOrigin = '';
                    key.removeEventListener('transitionend', cleanup);
                };
                key.addEventListener('transitionend', cleanup);
            });
            setTimeout(startTyping, T.phase2Delay);
        });
    }, 700);
}
/* ─────────────────────────────────────────
   Phase 2 — 鼠标打字
───────────────────────────────────────── */
function startTyping() {
    const output = document.getElementById('output');
    const caret = document.getElementById('out-caret');
    const keyboard = document.getElementById('keyboard');
    const kbRect = keyboard.getBoundingClientRect();
    output.style.top = `${kbRect.top - 68}px`;
    const cursor = document.createElement('div');
    cursor.id = 'type-cursor';
    cursor.innerHTML = CURSOR_SVG;
    document.body.appendChild(cursor);
    const initKey = document.querySelector('[data-k="delete"]');
    const initRect = initKey.getBoundingClientRect();
    cursor.style.left = `${initRect.left + initRect.width / 2 - 2}px`;
    cursor.style.top = `${initRect.top - 50}px`;
    setTimeout(() => {
        cursor.style.opacity = '1';
        output.style.opacity = '1';
        cursor.style.top = `${initRect.top + initRect.height / 2 - 4}px`;
    }, 50);
    let idx = 0;
    function next() {
        if (idx >= TYPING_SEQ.length) {
            sendAfterPause();
            return;
        }
        const { k, ch } = TYPING_SEQ[idx];
        const keyEl = document.querySelector(`[data-k="${k}"]`);
        if (!keyEl) {
            idx++;
            next();
            return;
        }
        const r = keyEl.getBoundingClientRect();
        cursor.style.left = `${r.left + r.width * 0.5 - 2}px`;
        cursor.style.top = `${r.top + r.height * 0.5 - 4}px`;
        setTimeout(() => pressKey(keyEl, ch, () => {
            idx++;
            setTimeout(next, T.keyGap);
        }), T.cursorMove);
    }
    function pressKey(keyEl, ch, onRelease) {
        keyEl.style.transition = 'transform 0.05s ease, box-shadow 0.05s ease, background 0.05s ease';
        keyEl.classList.add('pressed');
        cursor.classList.add('click-anim');
        setTimeout(() => {
            if (ch !== null)
                addChar(output, caret, ch);
            setTimeout(() => {
                keyEl.classList.remove('pressed');
                cursor.classList.remove('click-anim');
                setTimeout(() => { keyEl.style.transition = ''; }, T.keyRecover);
                onRelease();
            }, T.keyHold);
        }, T.keyDown);
    }
    function sendAfterPause() {
        const sendEl = document.querySelector('[data-k="send"]');
        const kb = document.getElementById('keyboard').getBoundingClientRect();
        const sr = sendEl.getBoundingClientRect();
        cursor.style.left = `${kb.right + 72}px`;
        cursor.style.top = `${kb.top + kb.height * 0.45 - 4}px`;
        setTimeout(() => {
            cursor.style.left = `${sr.left + sr.width * 0.5 - 2}px`;
            cursor.style.top = `${sr.top + sr.height * 0.5 - 4}px`;
            setTimeout(() => {
                caret.style.animation = 'none';
                caret.style.opacity = '0';
                pressKey(sendEl, null, () => {
                    setTimeout(() => { cursor.style.opacity = '0'; }, T.cursorFade);
                });
            }, T.endArriveSend);
        }, T.endOutside);
    }
    setTimeout(next, 500);
}
/* ─────────────────────────────────────────
   工具函数
───────────────────────────────────────── */
function addChar(output, caret, ch) {
    const span = document.createElement('span');
    span.className = 'out-char';
    span.textContent = ch;
    output.insertBefore(span, caret);
    requestAnimationFrame(() => requestAnimationFrame(() => span.classList.add('show')));
}
/* ─────────────────────────────────────────
   启动
───────────────────────────────────────── */
setTimeout(startAnimation, T.startDelay);
