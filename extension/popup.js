chrome.storage.local.get(['userLoggedIn', 'user_info'],
    function (response) {
        if (response.userLoggedIn === undefined) {
            window.location.replace('./popup-log-in.html');
        } else if (response.userLoggedIn === false) {
            window.location.replace('./popup-log-in.html');
        } else if (response.userLoggedIn === true){
            window.location.replace('./popup-log-out.html');
        } else {
            console.log('userLoggedIn: ',  response.userLoggedIn);
        }
    }
);
