let changeColor = document.getElementById('changeColor');

changeColor.onclick = function(element) {
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
        "url": "http://test.url",
        "browser": "Chrome",
        "start": "2021-02-24 21:13:00",
        "end": "2021-02-24 21:19:00",
        "tab_name": "test",
        "background": false,
        "user": "tanya"
    }); 
    console.log(data);

    xhr.send(data);
};
