chrome.runtime.onInstalled.addListener(function() {

    function RegisterTab() {
        chrome.tabs.query({active:true}, function(tabs) {
            let tab = tabs[0];

            let xhr = new XMLHttpRequest();
            let url = "http://127.0.0.1:8000/api/logs/";
        
            xhr.open("POST", url, true); 
        
            xhr.setRequestHeader("Content-Type", "application/json"); 
        
            xhr.onreadystatechange = function () { 
                if (xhr.readyState === 4) { 
                    console.log('Request sent. Status: '  +xhr.status + '. Response: ' + this.responseText);
                } 
            }; 
        
            let ts = Date.now();
    
            let data = JSON.stringify({ 
                "url": tab.url,
                "browser": "Chrome",
                "start": ts,
                "tab_name": tab.title,
                "background": false,
                "user": "tanya"
            }); 
            console.log("Data: " + data);
        
            xhr.send(data);

        });
    }

    chrome.tabs.onActivated.addListener(function(activeInfo) {
        RegisterTab();
    });
});