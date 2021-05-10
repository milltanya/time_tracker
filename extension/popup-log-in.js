document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;

    if (email && pass) {
        chrome.runtime.sendMessage({
            'message': 'login',
            'email': email,
            'pass': pass
        }, (response) => {
            if (response === 0) {
                window.location.replace('./popup-log-out.html');
            } else {
                document.querySelector('#email').placeholder = "Enter an email.";
                document.querySelector('#password').placeholder = "Enter a password.";
            }
        })
        
    } else {
        document.querySelector('#email').placeholder = "Enter an email.";
        document.querySelector('#password').placeholder = "Enter a password.";
    }
});
