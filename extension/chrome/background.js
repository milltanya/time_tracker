function GetPageMetas() {
    var metas = document.getElementsByTagName('meta'); 
    var metaArr = [];

    if (metas.length > 0) {
        for (var i=0; i<metas.length; i++) { 
            var name = metas[i].getAttribute("name");
            var property = metas[i].getAttribute("property");
            var content = metas[i].getAttribute("content");
            
            metaArr.push({name, property, content});
        } 
    }

    return metaArr;
}


function RegisterTab() {
    chrome.tabs.query({active:true}, function(tabs) {
        let tab = tabs[0];

        chrome.storage.local.get(['backendUrl', 'userLoggedIn', 'token'], function(items) {
            if (chrome.runtime.lastError) {
                console.error('lastError:', chrome.runtime.lastError.message);
                return;
            }
            if (items.userLoggedIn) {
                let datetime =  new Date().toISOString();
                console.log('datetime: ', datetime);

                fetch(items.backendUrl + '/log/setLastLogEndDateTime', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + items.token
                    },
                    body: datetime
                }).then((response) => {
                    if (response.status == 200) {
                        console.log('Log updated successfully');
                    } else if (response.status == 401) {
                        console.error('Unauthorized');
                        logOut();
                    } else {
                        console.error('Log update failure: ', response);
                    }
                }).then((response) => {
                    if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
                        let data = { 
                            "url": tab.url,
                            "browser": "Chrome",
                            "startDateTime": datetime,
                            "tabName": tab.title,
                            "background": false
                        }; 
                        console.log('data: ', data);
    
                        fetch(items.backendUrl + '/log/add', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + items.token
                            },
                            body: JSON.stringify(data)
                        }).then((response) => {
                            if (response.status == 200) {
                                console.log('Log added successfully');
                                response.json().then((logId) => {
                                    console.log("logId:", logId)
                                    chrome.scripting.executeScript({
                                        function: GetPageMetas,
                                        target: {
                                            allFrames: true,
                                            tabId: tab.id
                                        }
                                    }).then((injectionResults) => {
                                        if (chrome.runtime.lastError) {
                                            console.error('lastError:', chrome.runtime.lastError.message);
                                        }

                                        metaArr = []
                                        for (const frameResult of injectionResults) {
                                            for (const meta of frameResult.result) {
                                                metaArr.push({
                                                    name: meta.name, 
                                                    property: meta.property, 
                                                    content: meta.content
                                                });
                                            }
                                        }

                                        data = {
                                            logId: logId,
                                            metas: metaArr
                                        };
                                        console.log("Meta Data:", data);
                                        fetch(items.backendUrl + '/log/setMetas', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': 'Bearer ' + items.token
                                            },
                                            body: JSON.stringify(data)
                                        }).then((response) => {
                                            if (response.status == 200) {
                                                console.log('Meta added successfully');
                                            } else if (response.status == 401) {
                                                console.error('Unauthorized');
                                                logOut();
                                            } else {
                                                console.error('Meta add failure: ', response);
                                            }
                                        });
                                    });
                                })
                            } else if (response.status == 401) {
                                console.error('Unauthorized');
                                logOut();
                            } else {
                                console.error('Log add failure: ', response);
                            }
                        })
                    }
                });
            } else {
                console.error('Unauthorized');
                logOut();
            }
        })
    })
}



function logIn(email, pass) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['backendUrl'], function(items) {
            if (chrome.runtime.lastError) {
                console.error('lastError:', chrome.runtime.lastError.message);
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
                        chrome.storage.local.set({ userLoggedIn: true, token: response_data.userInfo.token }, () => {
                            if (chrome.runtime.lastError) {
                                console.error('lastError:', chrome.runtime.lastError.message);
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
        chrome.storage.local.set({ userLoggedIn: false, token: null }, () => {
            if (chrome.runtime.lastError) {
                console.error('lastError:', chrome.runtime.lastError.message);
                resolve(1);
            } else {
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
	} else {
        console.error("Received unexpected message:", request);
    }
});

chrome.runtime.onInstalled.addListener((details) => {
    const manifest = chrome.runtime.getManifest();
    const backendUrl = manifest.host_permissions[0].slice(0, -2);
    console.log("backendUrl: ", backendUrl);
    chrome.storage.local.set({ backendUrl: backendUrl }, () => {
        if (chrome.runtime.lastError) {
            console.error('lastError:', chrome.runtime.lastError.message);
        }
    });
    chrome.storage.local.get(['userLoggedIn'], function(response) {
        if (chrome.runtime.lastError) {
            console.error('lastError:', chrome.runtime.lastError.message);
        }
        if (response.userLoggedIn) {
            chrome.tabs.onActivated.addListener(RegisterTab);
            chrome.tabs.onUpdated.addListener(RegisterTab);
        };
    });
});
