// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*

document.querySelector('#record').addEventListener('click', function() {
    chrome.devtools.network.getHAR(function(HAR){
        var arr = [];
        var base_url = "http://portalcomercial.qa.labchile.cl:8888";
        HAR.entries.forEach(function(har){
            if(har.response.content.mimeType === 'application/json'){
                var data = {};
                data.name = har.request.startedDateTime.toString();
                data.path = har.request.url.replace(base_url,'');
                //data.response = har.response.content.text ? JSON.parse(har.response.content.text) : {};
                har.request.getContent(function(body){
                    data.response = JSON.parse(body);
                    arr.push(data);
                });
            }
        });
        //document.getElementById('weasel-container').innerHTML = JSON.stringify(HAR);
        //var myBlob = new Blob([JSON.stringify(arr)], {type : "application/json"});
        var myBlob = new Blob([JSON.stringify(HAR)], {type : "text/plain"});
        var url = window.URL.createObjectURL(myBlob);
        document.getElementById('downloadlink').download = document.getElementById('nameServices').value + '.json';
        document.getElementById('downloadlink').href = url;
        document.getElementById('downloadlink').click();
    });
    /*chrome.devtools.network.onRequestFinished.addListener(function(request) {
        request.getContent(function(body){
            parsed = JSON.parse(body);
            document.getElementById('weasel-container').innerHTML = "REQUEST: " + JSON.stringify(request) + "RESPONSE:" + JSON.stringify(parsed);
        });
    });*/
}, false);

document.querySelector('#executescript').addEventListener('click', function() {
    sendObjectToInspectedPage({action: "code", content: "console.log('Inline script executed')"});
}, false);

document.querySelector('#insertscript').addEventListener('click', function() {
    sendObjectToInspectedPage({action: "script", content: "inserted-script.js"});
}, false);

document.querySelector('#insertmessagebutton').addEventListener('click', function() {
    sendObjectToInspectedPage({action: "code", content: "document.body.innerHTML='<button>Send message to DevTools</button>'"});
    sendObjectToInspectedPage({action: "script", content: "messageback-script.js"});
}, false);