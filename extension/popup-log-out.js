document.querySelector('button').addEventListener('click', () => {
    try {
        chrome.storage.local.set({ userLoggedIn: false, token: "" });
        window.location.replace('./popup-log-in.html');
    } catch {
        window.location.replace('./popup-log-out.html');
    }
});