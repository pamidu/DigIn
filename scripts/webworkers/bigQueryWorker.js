var parentData = [];

onmessage = function(e) {
    console.log("parent says:"+e.data);
    parentData = e.data.split(",");
   if(JSON.parse(parentData[3]))getQueried(parentData);
    else getNonQueried(parentData);
}
var i = 0;

function getQueried(parentData){
    console.log("web worker calls getQueried");
    postMessage("web worker calls getQueried");
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(e){
            console.log(this);
            if (xhr.readyState === 4){
                if (xhr.status === 200){
                    postMessage(xhr.response);
                    console.log('query response:'+xhr.response);
                } else {
                    console.error("XHR didn't work: ", xhr.status);
                }
            }
        }
    xhr.ontimeout = function (){
            console.error("request timedout: ", xhr);
        }
    xhr.open("post", "http://45.55.83.253:3000/com.duosoftware.com/"+parentData[0]+"?take=20000", /*async*/ true);
    
    xhr.setRequestHeader("securityToken", "securityToken");
    var params = '{"Query" : {"Type" : "Query", "Parameters": '+ JSON.stringify(parentData[1]) +'}}';
    //var params = '{"Query":{"Type":"Query","Parameters":"select * from Inventory1 where Count= 603"}}';
    xhr.send(params);
}

function getNonQueried(parentData) {
    console.log("web worker calls getNonQueried");
    postMessage("web worker calls getNonQueried");
    var xhr = new XMLHttpRequest();
    var fields = parentData[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    fields = fields.replace(/ /g , ",");
        //xhr.timeout = 2000;
        xhr.onreadystatechange = function(e){
            console.log(this);
            if (xhr.readyState === 4){
                if (xhr.status === 200){
                    // debugger;
                     console.log('big query res:'+xhr.response);
                     postMessage(xhr.response);
                    //$response.innerHTML = xhr.response;
                } else {
                    console.error("XHR didn't work: ", xhr.status);
                }
            }
        }
        xhr.ontimeout = function (){
            console.error("request timedout: ", xhr);
        }
        xhr.open("get", "http://104.131.48.155:8080/executeQuery?query=SELECT "+fields+" FROM ["+parentData[1]
            +"."+parentData[2]+"]", /*async*/ true);
        // xhr.open("get", "http://104.131.48.155:8080/executeQuery?query=SELECT * FROM ["+parentData[1]
        //     +"."+parentData[2]+"]", /*async*/ true);
      
        xhr.send();
}


