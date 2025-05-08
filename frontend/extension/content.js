// Centralized backend URL
const API_BASE_URL = "http://localhost:8000"; // change this when deploying

function getVerdictElement() {
    const el = document.querySelector("div.text-sm.font-medium.text-label-1");
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
        slug: title?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") ?? null,
        difficulty
    };
};

// Expose user code to window
window.getCurrentSolution = function () {
    const model = window.monaco?.editor?.getModels?.()[0];
    return model?.getValue() ?? null;
};

// Solving timer logic
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

// Start timer on code edit
window.addEventListener("keydown", () => {
    if (document.querySelector(".monaco-editor")) {
        startSolvingTimer();
    }
});

// Send attempt data to backend
async function sendProblemAttempt() {
    const { title, slug } = window.getCurrentProblemInfo() || {};
    const code = window.getCurrentSolution();
    const durationSec = window.getSolvingTimeInSeconds?.() ?? null;

    if (!slug || !code || !durationSec) {
        console.warn("Missing problem data. Skipping log.");
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
    
        chrome.runtime.sendMessage({
            type: "SHOW_FEEDBACK",
            payload: {
                message: msg,
                subtext: sub,
                actionText: action
            }
        });
    })
    .catch((err) => console.error("❌ Logging failed:", err));
}

// Mutation observer to watch for verdicts
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

        sendProblemAttempt();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
