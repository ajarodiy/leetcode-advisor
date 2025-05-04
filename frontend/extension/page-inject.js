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
