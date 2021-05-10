document.querySelector('button').addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'logout' }, (response) => {
        if (response === 0) {
            window.location.replace('./popup-log-in.html');
        }
    });
});
