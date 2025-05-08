console.log("🧠 page-inject.js loaded!");

(function () {
    window.getCurrentProblemInfo = () => {
        const titleEl = document.querySelector('div.text-title-large a[href^="/problems/"]')
        const difficultyEl = document.querySelector('div[class*="text-difficulty-"]');

        const title = titleEl?.innerText?.trim();
        const url = window.location.href;
        const slug = url.split('/problems/')[1]?.split('/')[0];
        const difficulty = difficultyEl?.innerText?.trim();

        const info = { title, slug, url, difficulty };
        return info;
    };

    window.getCurrentSolution = () => {
        const editor = document.querySelector('.monaco-editor');
        if (!editor) {
            console.log("⚠️ [Injected] Monaco editor not found yet.");
            return null;
        }

        const model = monaco.editor.getModels()[0];
        const code = model?.getValue();

        return code;
    };
})();

let solvingStart = null;

function startSolvingTimer() {
    if (!solvingStart) {
        solvingStart = Date.now();
        console.log("⏱️ Timer started!");
        chrome.storage.local.set({ solvingStart: solvingStart });
    }
}

function getTimeTakenSec() {
    return solvingStart ? Math.floor((Date.now() - solvingStart) / 1000) : null;
}

window.addEventListener("keydown", (e) => {
    if (document.querySelector(".monaco-editor")) {
        startSolvingTimer();
    }
});

window.getSolvingTimeInSeconds = getTimeTakenSec;

(function () {
    const rootId = "leetcode-react-feedback-root";

    if (!document.getElementById(rootId)) {
        const container = document.createElement("div");
        container.id = rootId;
        container.style.position = "fixed";
        container.style.bottom = "0";
        container.style.right = "0";
        container.style.zIndex = "999999";
        document.body.appendChild(container);
    }
})();

const script = document.createElement("script");
script.src = chrome.runtime.getURL("feedback.bundle.js");
document.body.appendChild(script);
