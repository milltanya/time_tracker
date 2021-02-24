chrome.runtime.onInstalled.addListener(function() {
    // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    //     chrome.declarativeContent.onPageChanged.addRules([{
    //         conditions: [new chrome.declarativeContent.PageStateMatcher({
    //             pageUrl: {hostEquals: 'developer.chrome.com'},
    //         })
    //         ],
    //         actions: [new chrome.declarativeContent.ShowPageAction()]
    //     }]);
    // });

    chrome.tabs.onActivated.addListener(function(activeInfo) {
        console.log("tab changed");
        console.log(activeInfo.tabId);
        console.log(activeInfo.windowId);
        // chrome.tabs.query({index: activeInfo.tabId, windowId:activeInfo.windowId}, function(tabs) {
        chrome.tabs.query({active:true}, function(tabs) {
            console.log("got tab info");
            let tab = tabs[0];
            console.log(tabs);
            console.log(tab);
            let tab_url = tab.url;
            console.log(tab_url);

            let xhr = new XMLHttpRequest();
            let url = "http://127.0.0.1:8000/api/logs/";
        
            xhr.open("POST", url, true); 
        
            xhr.setRequestHeader("Content-Type", "application/json"); 
        
            xhr.onreadystatechange = function () { 
                if (xhr.readyState === 4 && xhr.status === 200) { 
                    console.log('Request sent');
                    console.log(this.responseText);
                } 
            }; 
        
    
            let data = JSON.stringify({ 
                "url": tab_url,
                "browser": "Chrome",
                "start": "2021-02-24 21:13:00",
                "end": "2021-02-24 21:19:00",
                "tab_name": "test",
                "background": false,
                "user": "tanya"
            }); 
            console.log(data);
        
            xhr.send(data);

        })

    });
});