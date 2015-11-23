var parentData = [];
var url = "";
onmessage = function(e) {
    console.log("parent says:" + e.data);
    parentData = e.data.split(",");
    console.log("parent data is:" + parentData);
    if (parentData[4] == "Hierarchy") {
        url = parentData[5];
        getHierarchy(parentData);  
    } else if (parentData[3] == true) {
        getQueried(parentData);
    } else {
        url = parentData[4];
        getNonQueried(parentData);
    }
}
var i = 0;
1

function getQueried(parentData) {
    console.log("web worker calls getQueried");
    postMessage("web worker calls getQueried");
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(e) {
        console.log(this);
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
    xhr.open("post", "http://45.55.83.253:3000/com.duosoftware.com/" + parentData[0] + "?take=20000", /*async*/ true);

    xhr.setRequestHeader("securityToken", "securityToken");
    var params = '{"Query" : {"Type" : "Query", "Parameters": ' + JSON.stringify(parentData[1]) + '}}';
    //var params = '{"Query":{"Type":"Query","Parameters":"select * from Inventory1 where Count= 603"}}';
    xhr.send(params);
}

function getHierarchy(parentData) {
    console.log("web worker calls getQueried");
    postMessage("web worker calls getQueried");
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(e) {
        console.log(this);
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


    var id = Math.floor((Math.random() * 100) + 1);
    xhr.open("get", url + "hierarchicalsummary?h=" + parentData[1]+ "," + parentData[2] + "," +  parentData[3] + "&tablename=[" +parentData[0]  + "]&id="+id, /*async*/ true);

    xhr.setRequestHeader("securityToken", "securityToken");
    var params = '{"Query" : {"Type" : "Query", "Parameters": ' + JSON.stringify(parentData[1]) + '}}';
    //var params = '{"Query":{"Type":"Query","Parameters":"select * from Inventory1 where Count= 603"}}';
    xhr.send(params);
}

function getNonQueried(parentData) {
    console.log("web worker calls getNonQueried");
    postMessage("web worker calls getNonQueried");
    var xhr = new XMLHttpRequest();
    var fields = parentData[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    fields = fields.replace(/ /g, ",");
    //xhr.timeout = 2000;
    xhr.onreadystatechange = function(e) {
        console.log(this);
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // debugger;
                console.log("Get data result for hierarchy:");
                console.log(xhr.response);
                postMessage(xhr.response);

                //$response.innerHTML = xhr.response;
            } else {
                console.error("XHR didn't work: ", xhr.status);
            }
        }
    }
    xhr.ontimeout = function() {
        console.error("request timedout: ", xhr);
    }

    http: //104.131.48.155:8080/gethighestlevel?tablename=[digin_hnb.hnb_claims]&type=DemoHNB_claim&levels=[%27vehicle_usage%27,%27vehicle_class%27,%27vehicle_type%27]&plvl=All

        var passObjects = parentData[0];
    string = passObjects.split(" ");
    finalstring = "";
    var stringArray = new Array();

    for (var i = 1; i < string.length - 1; i++) {

        finalstring += "'" + string[i] + "',";
    }
    finalstring = finalstring.replace(/,\s*$/, "");
    xhr.open("get", url + "gethighestlevel?tablename=[" + parentData[1] + "." + parentData[2] + "]&id=1=" + "&levels=" + "[" + finalstring + "]" + "&plvl=All", /*async*/ true);
    // xhr.open("get", "http://104.131.48.155:8080/executeQuery?query=SELECT * FROM ["+parentData[1]
    //     +"."+parentData[2]+"]", /*async*/ true);

    xhr.send();
}


