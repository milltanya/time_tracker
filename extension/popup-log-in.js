document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;

    if (email && pass) {
        return fetch('http://localhost:8080/auth/signin', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'email': email, 
                'password': pass
            })
        }).then((response) => {
            console.log('Log in statuse code: ', response.status);
            if (response.status === 200) {
                response.json().then((data) => { 
                    console.log('Request body: ',  data);
                    chrome.storage.local.set({ userLoggedIn: true, token: data.userInfo.token });
                    console.log('Log in succeessful');
                    window.location.replace('./popup-log-out.html');
                });
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