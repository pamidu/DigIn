onmessage = function(e) {
   getData(JSON.parse(e.data));
}

function getData(receivedData){
   console.log(JSON.stringify(receivedData));
   var xhr = new XMLHttpRequest();
   
    xhr.onreadystatechange = function(e) {
        console.log(this);
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                postMessage({res: xhr.response,state: true});
            } else {
                postMessage({res: xhr.response,state: false});
            }
        }else{
            //postMessage({res: null,state: false});
        }
    }
    xhr.ontimeout = function() {
        postMessage({res: null,state: false});
        console.error("request timedout: ", xhr);
    }
    xhr.open(receivedData.method, receivedData.rUrl, /*async*/ true);
    xhr.send();
};
        