routerApp.service('CommonDataSrc', function($objectstore,$http,Digin_Engine_API_Namespace) {
   var dataObj = null;
   var dataSrc = null;
   var dataTable = null;

   return {
      getProperty: function() {
         return dataObj;
      },
      setProperty: function(value) {
         dataObj = value;
      },
      getTables: function(src, callback) {
         getJSONDataByProperty($http,'pythonServices','name',src,function(data){
            var requestObj = data[0].getTables;
            console.log(JSON.stringify(requestObj));
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(e) {
               console.log(this);
               if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                     console.log('query response:' + JSON.parse(xhr.response));
                     var res = JSON.parse(xhr.response);
                     dataSrc = src;
                     callback(res);
                  } else {
                     console.error("XHR didn't work: ", xhr.status);
                  }
               }
            }
            xhr.ontimeout = function() {
               console.error("request timedout: ", xhr);
            }
            xhr.open(requestObj.method, requestObj.host + requestObj.request +"?"+requestObj.params[0]+"="+Digin_Engine_API_Namespace, /*async*/ true);
            xhr.send();
         });

      },
      getFields: function(tbl, callback) {
         //var fieldData = (tbl.split(':')[1]).split('.');
         getJSONDataByProperty($http,'pythonServices','name',dataSrc,function(data){
            var requestObj = data[0].getFields;
            console.log(JSON.stringify(requestObj));
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(e) {
               console.log(this);
               if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                     console.log('query response:' + JSON.parse(xhr.response));
                     var res = JSON.parse(xhr.response);
                     callback(res);
                  } else {
                     console.error("XHR didn't work: ", xhr.status);
                  }
               }
            }
            xhr.ontimeout = function() {
               console.error("request timedout: ", xhr);
            }
            xhr.open(requestObj.method, requestObj.host + requestObj.request +"?"
                + requestObj.params[0] + "="+Digin_Engine_API_Namespace+"&&" + requestObj.params[1] + "="+ tbl, /*async*/ true);
            xhr.send();
         });
      }
   };
});