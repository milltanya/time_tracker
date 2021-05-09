function RegisterTab() {
    chrome.tabs.query({active:true}, function(tabs) {
        let tab = tabs[0];

        if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
            chrome.storage.local.get(['backendUrl', 'userLoggedIn', 'token'], function(items) {
                if (items.userLoggedIn) {
                    let data = JSON.stringify({ 
                        "url": tab.url,
                        "browser": "Chrome",
                        "startDateTime": new Date().toISOString(),
                        "tabName": tab.title,
                        "background": false
                    }); 
                    console.log('data: ', data);

                    fetch(items.backendUrl + '/log/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + items.token
                        },
                        body: data
                    }).then((response) => {
                        if (response.status == 200) {
                            console.log('Log added successfully');
                        } else if (response.status == 401) {
                            console.error('Unauthorized');
                            logOut();
                        } else {
                            console.error('Log add failure: ', response);
                        }
                    })
                } else {
                    console.error('Unauthorized');
                    logOut();
                }
            })
        }
    })
}



function logIn(email, pass) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['backendUrl'], function(items) {
            if (chrome.runtime.lastError) {
                console.error('lastError:', chrome.runtime.lastError);
                resolve(1);
            }
            fetch(items.backendUrl + '/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'email': email,
                    'password': pass
                })
            }).then((response) => {
                console.log("Fetch response: ", response);
                if (response.status === 200) {
                    response.json().then((response_data) => {
                        console.log("Fetch response data: ", response_data);
                        chrome.storage.local.set({ userLoggedIn: true, token: response_data.userInfo.token }, () => {
                            if (chrome.runtime.lastError) {
                                console.error('lastError:', chrome.runtime.lastError);
                                resolve(1);
                            }
                            chrome.tabs.onActivated.addListener(RegisterTab);
                            chrome.tabs.onUpdated.addListener(RegisterTab);
                            console.log('Log in succeessful');
                            resolve(0);
                        });
                    });
                } else {
                    return 1;
                }

            });
        });
    });
}

function logOut() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ userLoggedIn: false, token: "" }, () => {
            if (chrome.runtime.lastError) {
                console.error('lastError:', chrome.runtime.lastError);
                resolve(1);
            } else {
                chrome.tabs.onActivated.removeListener(RegisterTab);
                chrome.tabs.onUpdated.removeListener(RegisterTab);
                console.log('Log out succeessful');
                resolve(0);
            }
        });
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'login') {
        logIn(request.email, request.pass).then(sendResponse);
        return true;
    } else if (request.message === 'logout') {
        logOut().then(sendResponse);
        return true;
    } 
});

chrome.runtime.onInstalled.addListener((details) => {
    const manifest = chrome.runtime.getManifest();
    const backendUrl = manifest.host_permissions[0].slice(0, -2);
    console.log("backendUrl: ", backendUrl);
    chrome.storage.local.set({ backendUrl: backendUrl });
    if (chrome.runtime.lastError) {
        console.error('lastError:', chrome.runtime.lastError);
        return 1;
    }
    chrome.storage.local.get(['userLoggedIn'], function(response) {
        if (response.userLoggedIn) {
            chrome.tabs.onActivated.addListener(RegisterTab);
            chrome.tabs.onUpdated.addListener(RegisterTab);
        };
    });
});
