document.querySelector('button').addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'logout' },
        function (response) {
            if (response === 0) {
               window.location.replace('./popup-log-in.html');
            }
        }
    );
});
