onmessage = function(e) {
	console.log("parent says:"+e.data);

}
var i = 0;

function timedCount() {
    postMessage("web worker calls");
    var xhr = new XMLHttpRequest();
        //xhr.timeout = 2000;
        xhr.onreadystatechange = function(e){
            console.log(this);
            if (xhr.readyState === 4){
                if (xhr.status === 200){
                    // debugger;
                     //console.log(xhr.response);
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
        xhr.open("post", "http://104.236.68.121:3000/com.duosoftware.com/Inventory1", /*async*/ true);
         
   // xhr.setRequestHeader("Access-Control-Allow-Headers", "securityToken,log,Content-Type");
    //xhr.setRequestHeader("Access-Control-Allow-Credentials","true");
    //xhr.setRequestHeader("Access-Control-Allow-Methods ","GET,POST,PUT,DELETE");
    xhr.setRequestHeader("securityToken", "securityToken");
    var params = '{"Special":{"Type":"getSelected","Parameters":" Store Count"}}';
    //xhr.setRequestHeader("log", "log");
    //xhr.setRequestHeader();
        // xhr.responseType = "text";
        xhr.send(params);
}

timedCount();
