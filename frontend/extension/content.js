console.log("LeetCode Advisor content script loaded");

const script = document.createElement('script');
script.src = chrome.runtime.getURL('page-inject.js');
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

function getProblemName() {
    const h1 = document.querySelector('h1');
    let name = h1 ? h1.innerText.trim() : null;

    // Backup: Try to get it from URL
    if (!name) {
        const parts = window.location.pathname.split('/');
        const slug = parts[2]; // leetcode.com/problems/[slug]/
        name = slug ? slug.replace(/-/g, ' ') : null;
    }

    return name;
}

function getSubmissionResult() {
    const el = document.querySelector('[data-e2e-locator="submission-result"]');
    const result = el ? el.textContent.trim() : null;
    return result;
}

const getCurrentProblemInfo = () => {
    const title = document.querySelector('.css-v3d350')?.innerText;
    const url = window.location.href;
    const slug = url.split('/problems/')[1]?.split('/')[0];
    const difficulty = document.querySelector('[diff]')?.innerText;

    const info = { title, slug, url, difficulty };
    return info;
};

const getCurrentSolution = () => {
    const editor = document.querySelector('.monaco-editor');
    if (!editor) {
        console.log("⚠️ Monaco editor not found yet.");
        return null;
    }
    const model = monaco.editor.getModels()[0];
    const code = model?.getValue();

    return code;
};

let lastStored = null;
let lastLoggedTime = 0;
const THROTTLE_MS = 2000;

// Watch DOM changes to detect verdict
const observer = new MutationObserver(() => {
    const now = Date.now();

    // throttle the handler
    if (now - lastLoggedTime < THROTTLE_MS) return;

    const verdict = getSubmissionResult();
    const name = getProblemName();

    if (verdict && name) {
        const signature = `${name}-${verdict}`;
        if (signature !== lastStored) {
            const timestamp = new Date().toISOString();
            const data = { name, status: verdict, timestamp };

            chrome.storage.local.set({ lastProblem: data });

            lastStored = signature;
            lastLoggedTime = now;
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
window.getCurrentProblemInfo = getCurrentProblemInfo;
window.getCurrentSolution = getCurrentSolution;
