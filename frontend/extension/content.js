function getProblemName() {
    const h1 = document.querySelector('h1');
    return h1 ? h1.innerText.trim() : null;
}

function getSubmissionResult() {
    const el = document.querySelector('.text-success, .text-red-500');
    return el ? el.innerText.trim() : null;
}

// Watch DOM changes to detect verdict
const observer = new MutationObserver(() => {
    const verdict = getSubmissionResult();
    if (verdict) {
        const name = getProblemName();
        const timestamp = new Date().toISOString();

        if (name && verdict) {
            const data = { name, verdict, timestamp };
            localStorage.setItem('lastProblem', JSON.stringify(data));
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
