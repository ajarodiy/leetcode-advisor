console.log("LeetCode Advisor content script loaded");

function getProblemName() {
    const h1 = document.querySelector('h1');
    let name = h1 ? h1.innerText.trim() : null;

    // Backup: Try to get it from URL
    if (!name) {
        const parts = window.location.pathname.split('/');
        const slug = parts[2]; // leetcode.com/problems/[slug]/
        name = slug ? slug.replace(/-/g, ' ') : null;
    }

    console.log("🔍 Problem name detected:", name);
    return name;
}

function getSubmissionResult() {
    const el = document.querySelector('[data-e2e-locator="submission-result"]');
    const result = el ? el.textContent.trim() : null;
    console.log("📬 Submission result detected:", result);
    return result;
}

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

            console.log("✅ Stored to chrome.storage:", data);
            chrome.storage.local.set({ lastProblem: data });

            lastStored = signature;
            lastLoggedTime = now;
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
