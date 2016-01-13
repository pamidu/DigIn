var parentData = [];

onmessage = function(e) {
    parentData = e.data.split(",");
    getNonQueried(parentData);
}


function getNonQueried(parentData) {
    console.log("web worker calls getNonQueried");
    postMessage("web worker calls getNonQueried");
    var xhr = new XMLHttpRequest();        
    xhr.onreadystatechange = function(e){
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                 postMessage(xhr.response);
            } else {
                console.error("XHR didn't work: ", xhr.status);
            }
        }
    }
    xhr.ontimeout = function (){
        console.error("request timedout: ", xhr);
    }
    xhr.open("post", "http://45.55.83.253:3000/com.duosoftware.com/"+parentData[0].trim(), /*async*/ true);
    xhr.setRequestHeader("securityToken", "securityToken");
    var params = '{"Special":{"Type":"getSelected","Parameters":"'+parentData[1].trim()+'"}}';
    xhr.send(params);
}


