function RegisterTab() {
    chrome.tabs.query({active:true}, function(tabs) {
        let tab = tabs[0];

        chrome.storage.local.get(['userLoggedIn', 'token'], function(response) {

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
                if (response.status !== 200) {
                    console.error('Log add failure: ', response);
                } else {
                    console.log('Log added successfully: ', response);
                }
            })
        })
    })
}
  
  
chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.onActivated.addListener(RegisterTab);
    chrome.tabs.onUpdated.addListener(RegisterTab);
});
