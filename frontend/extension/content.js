const API_BASE_URL = "http://localhost:8000"; // Update on deploy

// Selectors
function getVerdictElement() {
    const el = document.querySelector('span[data-e2e-locator="submission-result"]');
    return el ? el.innerText : null;
}

function getProblemTitle() {
    const titleEl = document.querySelector('div.text-title-large a[href^="/problems/"]');
    return titleEl ? titleEl.innerText.trim() : null;
}

function getSlugFromTitle(title) {
    return title?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || null;
}

window.getCurrentProblemInfo = function () {
    const titleEl = document.querySelector('div.text-title-large a[href^="/problems/"]');
    const difficultyEl = document.querySelector('div[class*="text-difficulty-"]');

    const title = titleEl?.innerText?.trim() ?? null;
    const difficulty = difficultyEl?.innerText?.trim() ?? null;

    return {
        title,
        slug: getSlugFromTitle(title),
        difficulty
    };
};

// Extract user code: Try Monaco first, fallback to <code> block after submit
window.getCurrentSolution = function () {
    try {
        // 1. Monaco editor (live editing)
        const model = window.monaco?.editor?.getModels?.()[0];
        const monacoCode = model?.getValue();
        if (monacoCode?.trim()) return monacoCode;

        // 2. Rendered code block after submission
        const renderedBlock = document.querySelector('code.language-python');
        if (renderedBlock) {
            // Collect all nested spans as text
            const spans = Array.from(renderedBlock.querySelectorAll('span'));
            const codeText = spans.map(span => span.textContent).join('').trim();
            if (codeText) return codeText;
        }

        console.warn("⚠️ No code found in Monaco or rendered spans.");
        return null;
    } catch (err) {
        console.error("❌ Error accessing code:", err);
        return null;
    }
};

// Timer
let solvingStart = null;
function startSolvingTimer() {
    if (!solvingStart) {
        solvingStart = Date.now();
        console.log("⏱️ Timer started");
        chrome.storage.local.set({ solvingStart });
    }
}
function getTimeTakenSec() {
    return solvingStart ? Math.floor((Date.now() - solvingStart) / 1000) : null;
}
window.getSolvingTimeInSeconds = getTimeTakenSec;

window.addEventListener("keydown", () => {
    if (document.querySelector(".monaco-editor")) {
        startSolvingTimer();
    }
});

let retryCount = 0;
const MAX_RETRIES = 10;

async function sendProblemAttempt() {
    const { title, slug } = window.getCurrentProblemInfo() || {};
    const code = window.getCurrentSolution();
    const durationSec = window.getSolvingTimeInSeconds?.() ?? null;

    console.log("📦 Attempt data:", { slug, durationSec, code });

    if (!slug || !code || !durationSec) {
        retryCount++;
        if (retryCount < MAX_RETRIES) {
            console.warn("⏳ Retrying — missing problem data", { slug, durationSec, code });
            setTimeout(sendProblemAttempt, 1000);
        } else {
            console.warn("🛑 Gave up after max retries.");
        }
        return;
    }

    const payload = {
        timestamp: new Date().toISOString(),
        durationSec,
        code,
        language: 'python',
        isOptimal: true,
        usedHint: false
    };

    const { uid, token } = await new Promise((resolve) => {
        chrome.storage.local.get(['uid', 'token'], resolve);
    });

    if (!uid || !token) {
        console.warn("User not authenticated.");
        return;
    }

    fetch(`${API_BASE_URL}/submitAttempt/${uid}/${slug}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
    .then((res) => res.json())
    .then((res) => {
        console.log("✅ Logged attempt:", res);

        const msg = "🎉 Great job!";
        const sub = res.isOptimal
            ? "Your solution was optimal!"
            : "Nice work — but there's a cleaner way.";
        const action = res.isOptimal ? undefined : "Click to view a better solution";

        window.postMessage({
            type: "SHOW_FEEDBACK",
            payload: { message: msg, subtext: sub, actionText: action }
        }, "*");
    })
    .catch((err) => console.error("❌ Logging failed:", err));
}

// Mutation observer
let lastStored = "";
let lastLoggedTime = 0;

const observer = new MutationObserver(() => {
    const verdict = getVerdictElement();
    const name = getProblemTitle();
    if (!verdict || !name) return;

    const now = Date.now();
    const signature = `${name}-${verdict}`;

    if (signature !== lastStored && now - lastLoggedTime > 1000) {
        chrome.storage.local.set({
            lastProblem: {
                name,
                status: verdict,
                timestamp: new Date().toISOString()
            }
        });

        lastStored = signature;
        lastLoggedTime = now;
        retryCount = 0; // reset retry tracker
        sendProblemAttempt();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

function startActivityPinger() {
    setInterval(async () => {
        const { uid, token } = await new Promise((resolve) => {
            chrome.storage.local.get(['uid', 'token'], resolve);
        });

        if (!uid || !token) return;

        fetch(`http://localhost:8000/updateActivity/${uid}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(() => {
            console.log("📡 Activity ping sent");
        }).catch(console.error);
    }, 5 * 60 * 1000); // every 5 mins
}

// Start pinging when LeetCode loads
startActivityPinger();
