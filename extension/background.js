function RegisterTab() {
    chrome.tabs.query({active:true}, function(tabs) {
        let tab = tabs[0];

        if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
            chrome.storage.local.get(['userLoggedIn', 'token'], function(response) {
                if (response.userLoggedIn) {
                    let data = JSON.stringify({ 
                        "url": tab.url,
                        "browser": "Chrome",
                        "startDateTime": new Date().toISOString(),
                        "tabName": tab.title,
                        "background": false
                    }); 
                    console.info('token: ', 'Bearer ' + response.token);
                    console.info('data: ', data);

                    fetch('http://localhost:8080/log/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + response.token
                        },
                        body: data
                    }).then((response) => {
                        if (response.status == 200) {
                            console.log('Log added successfully: ', response);
                        } else if (response.status == 401) {
                            console.error('Unauthorized');
                            chrome.storage.local.set({ userLoggedIn: false, token: "" });
                        } else {
                            console.error('Log add failure: ', response);
                        }
                    })
                } else {
                    console.error('Unauthorized');
                }
            })
        }
    })
}
  
  
chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.onActivated.addListener(RegisterTab);
    chrome.tabs.onUpdated.addListener(RegisterTab);
});
