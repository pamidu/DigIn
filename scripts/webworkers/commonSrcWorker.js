onmessage = function(e) {
   getData(JSON.parse(e.data));
}

function getData(receivedData){
   var paramStr = getParamStr(receivedData.params);
 
   var xhr = new XMLHttpRequest();
   
    xhr.onreadystatechange = function(e) {
      
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {    
                postMessage(xhr.response);

            } else {
                console.error("XHR didn't work: ", xhr.status);
            }
        }
    }
    xhr.ontimeout = function() {
        console.error("request timedout: ", xhr);
    }
    xhr.open(receivedData.webMethod, receivedData.host + receivedData.method + "?" + paramStr, /*async*/ true);
    xhr.send();
};

function getParamStr(paramArr){
   var str = '';
   
   
   for(var i=0;i< paramArr.length; i++){
     
      if(typeof(paramArr[i].value) != 'undefined'){
         str = str + paramArr[i].name + '=' + paramArr[i].value;
         if(i!= paramArr.length-1) str = str + '&';
      }      
   }
   return str;
};