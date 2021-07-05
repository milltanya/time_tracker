function format(n, l) {
    let s = n.toString()
    while (s.length < l) {
        s = '0' + s;
    }
    return s;
}

function LocalNow() {
    let datetime =  new Date();
    return format(datetime.getFullYear(), 4) + '-' + format(datetime.getMonth() + 1, 2) + '-' + format(datetime.getDate(), 2) + 
        'T' + format(datetime.getHours(), 2) + ':' + format(datetime.getMinutes(), 2) + ':' + format(datetime.getSeconds(), 2);
}


async function RegisterTab() {
    const tabs = await browser.tabs.query({active:true});
    let tab = tabs[0];

    const items = await new Promise((resolve, reject) => {
        browser.storage.local.get(['backendUrl', 'userLoggedIn', 'token'], (items) => {
            if (browser.runtime.lastError) {
                reject(browser.runtime.lastError.message);
            } else {
                resolve(items)
            }
        });
    }).catch((err) => { console.error(err); });
    if (items === undefined) {
        return;
    }

    if (browser.runtime.lastError) {
        console.error('lastError:', browser.runtime.lastError.message);
        return;
    }

    if (!items.userLoggedIn) {
        console.error('Unauthorized');
        return;
    }

    let datetime = LocalNow();
    console.log('datetime: ', datetime);

    const updateResponse = await fetch(items.backendUrl + '/log/setLastLogEndDateTime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + items.token
        },
        body: datetime
    });
    
    if (updateResponse.status === 200) {
        console.log('Log updated successfully');
    } else if (updateResponse.status === 401) {
        console.error('Unauthorized');
        logOut();
        return;
    } else {
        console.debug('Log update failure: ', updateResponse);
    }

    if (!tab.url.startsWith('http://') && !tab.url.startsWith('https://')) {
        return;
    }   

    let data = { 
        "url": tab.url,
        "browser": "Browser",
        "startDateTime": datetime,
        "tabName": tab.title
    }; 
    console.log('data: ', data);

    const addResponse = await fetch(items.backendUrl + '/log/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + items.token
        },
        body: JSON.stringify(data)
    });

    if (addResponse.status === 401) {
        console.error('Unauthorized');
        logOut();
        return;
    } else if (addResponse.status !== 200) {
        console.debug('Log add failure: ', addResponse);
        return;
    }
    console.log('Log added successfully');

    const addResponseBody = await addResponse.json();
    const logId = addResponseBody;
    console.log("logId:", logId);
}



function logIn(email, pass) {
    return new Promise((resolve, reject) => {
        browser.storage.local.get(['backendUrl'], function(items) {
            if (browser.runtime.lastError) {
                console.error('lastError:', browser.runtime.lastError.message);
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
                if (response.status === 200) {
                    response.json().then((response_data) => {
                        browser.storage.local.set({ userLoggedIn: true, token: response_data.userInfo.token }, () => {
                            if (browser.runtime.lastError) {
                                console.error('lastError:', browser.runtime.lastError.message);
                                resolve(1);
                            }
                            browser.tabs.onActivated.addListener(RegisterTab);
                            browser.tabs.onUpdated.addListener(RegisterTab);
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
        browser.storage.local.set({ userLoggedIn: false, token: null }, () => {
            if (browser.runtime.lastError) {
                console.error('lastError:', browser.runtime.lastError.message);
                resolve(1);
            } else {
                console.log('Log out succeessful');
                resolve(0);
            }
        });
    });
}


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'login') {
        logIn(request.email, request.pass).then(sendResponse);
        return true;
    } else if (request.message === 'logout') {
        logOut().then(sendResponse);
        return true;
	} else {
        console.error("Received unexpected message:", request);
    }
});


browser.runtime.onInstalled.addListener((details) => {
    const manifest = browser.runtime.getManifest();
    const backendUrl = manifest.permissions[2].slice(0, -2);
    console.log("backendUrl: ", backendUrl);
    browser.storage.local.set({ backendUrl: backendUrl }, () => {
        if (browser.runtime.lastError) {
            console.error('lastError:', browser.runtime.lastError.message);
        }
    });
    browser.tabs.onActivated.addListener(RegisterTab);
    browser.tabs.onUpdated.addListener(RegisterTab);
});
