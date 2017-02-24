/* Utility functions */

/*Summary 
    parameters {http : $http service object,
                file : json file name without the extension,
                callback : callback function}
    returns {JSON data as a single object}*/
 function getJSONData(http,file,callback){
    http.get('jsons/'+file+'.json').success(function(data) {
      // console.log('reading json file:'+file+'.json');
     // alert(JSON.stringify(data.d));
      callback(data.d);
    });
 };
 
 /*Summary 
    parameters {http : $http service object,
                file : json file name without the extension,
                callback : callback function,
                propName: property name you need from the json object
                propVal: property value you need from the json object}
    returns {JSON data as a single object}*/
 function getJSONDataByProperty(http,file,propName,propVal,callback){
    http.get('jsons/'+file+'.json').success(function(data) {
        console.log(data);
      callback(data.d.filter(function( obj ) {
        return obj[propName] == propVal;
      }));
    });
 };

 /*Summary 
    parameters {http : $http service object,
                file : json file name without the extension,
                callback : callback function,
                index: index you need from the json object}
    returns {JSON data as a single object}*/
 function getJSONDataByIndex(http,file,index,callback){
    http.get('jsons/'+file+'.json').success(function(data) {
      // console.log('reading json file:'+file+'.json @ index'+ index);
      callback(data.d[index]);
    });
 };


 /*Summary 
    parameters {id: id of the root object,
                obj: root object}
    returns {a single object}*/
//send the id and root object
//function checks for objects inside root object for id and 
//returns the index of the object with similar id (if one exists)
 function getRootObjectById(id,obj){
    for(i=0;i<obj.length;i++){
      if(obj[i].widgetID == id) return i;
    }
 };

 /*Summary 
    parameters {days: number of days to be reduced from the 'until' parameter(type:int),
                until: the end date}
    returns {the object with since and until time stamps}*/
 function  getBoundaryTimestamps (days,until){
    var secondDate = new Date();
    secondDate.setDate(until.getDate() - days);
    return {
        sinceStamp: Math.floor(secondDate / 1000),
        untilStamp: Math.floor(until / 1000)
    }
 };

 /*Summary
    Sorts an array of objects (note: sorts the original array and returns nothing)

    @arrToSort             array           javascript array of objects
    @strObjParamToSortBy   string          name of obj param to sort by, and an 
    @sortAsc               bool (optional) sort ascending or decending (defaults to true and sorts in ascending order)
    returns                void            because the original array that gets passed in is sorted
*/
function sortArrOfObjectsByParam(arrToSort /* array */, strObjParamToSortBy /* string */, sortAscending /* bool(optional, defaults to true) */) {
    if(sortAscending == undefined) sortAscending = true;  // default to true
    
    if(sortAscending) {
        arrToSort.sort(function (a, b) {
            return a[strObjParamToSortBy] > b[strObjParamToSortBy];
        });
    }
    else {
        arrToSort.sort(function (a, b) {
            return a[strObjParamToSortBy] < b[strObjParamToSortBy];
        });
    }
}

/*Summary
    Get the difference of two days

    @until             date     last date
    @since             date     starting date    
    returns            number   difference of the two dates(if the since date is greater than until returns -1)
*/
function getDateDifference(until,since){
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    if(since > until) return -1;
    else
    return Math.round(Math.abs((until.getTime() - since.getTime())/(oneDay)));
};


function containsObject(obj, list) {
    var x;
    for (x in list) {
        if (list.hasOwnProperty(x) && list[x] === obj) {
            return true;
        }
    }

    return false;
}

/*Summary
    Returns the next character (basically do a character increment)

    @c      string     previous letter  
    returns string     next letter
*/
function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

/*Summary
    Returns only the unique values of the passed array

    @data      array     array with duplicate values in it
    returns array     array with unique values
*/
function uniqueArray(data){
    var uniqueNames = [];
    for(i = 0; i< data.length; i++){    
        if(uniqueNames.indexOf(data[i]) === -1){
            uniqueNames.push(data[i]);        
        }        
    }
    return uniqueNames;
}


function validate(msg, mdToast, scope){

    mdToast.show(
      mdToast.simple()
        .content(msg)
        .position('bottom right')
        .hideDelay(3000)
    );
}



function chunk(arr, size) {
  var newArr = [];
  for (var i=0; i<arr.length; i+=size) {
    newArr.push(arr.slice(i, i+size));
  }
  return newArr;
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

//rounding numbers to given decimal places
function convertDecimals(number, decimal_places) {
    if (typeof number === 'number' && typeof decimal_places === 'number') {
      var denominator    = Math.pow(10, decimal_places),
          rounded_number = Math.round(number * denominator) / denominator;

      return rounded_number;
    } else {
      return number;
    }
  }
  
  	function createuuid() 
	{
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
    }
  
  
 