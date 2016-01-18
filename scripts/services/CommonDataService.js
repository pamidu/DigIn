routerApp.service('CommonDataSrc', function ($objectstore, $http, Digin_Engine_API_Namespace) {
    var dataObj = null;
    var dataSrc = null;
    var dataTable = null;

    /*  data source strategy begin  */

    /* Strategy1 begin */
    var DataSource = function () {
        this.source = "";
    };

    DataSource.prototype = {
        setSource: function (src) {
            this.source = src;
        },

        getTables: function (src, callback) {
            this.source.getTables(src, callback);
        },

        getFields: function (tbl, callback) {
            this.source.getFields(tbl, callback);
        }
    };

    var DUOSTORE = function () {
        this.getTables = function (src, callback) {
            var client = $objectstore.getClient("com.duosoftware.com", " ");

            client.getClasses("com.duosoftware.com");

            //classes retrieved
            client.onGetMany(function (data) {
                if (data.length > 0) callback(data);
                else console.log('There are no classes present');
            });

            //error getting classes from the index
            client.onError(function (data) {
                console.log('Error getting classes');
            });
        }

        this.getFields = function (tbl, callback) {
            var client1 = $objectstore.getClient("com.duosoftware.com", tbl);
            client1.getFields("com.duosoftware.com", tbl);

            //class's fields retrieved
            client1.onGetMany(function (data) {
                if (data.length > 0) {
                    callback(data);
                } else console.log('There are no fields present in the class');
            });

            //error getting fields from the class
            client1.onError(function (data) {
                console.log('Error getting fields');
            });
        }
    };

    var PYTHON = function () {
        this.getTables = function (src, callback) {
            getJSONDataByProperty($http, 'pythonServices', 'name', 'Python', function (data) {
                alert(data[0]);
                var requestObj = data[0].getTables;
                var namespace = localStorage.getItem('srcNamespace');
                console.log(JSON.stringify(requestObj));
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function (e) {
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
                xhr.ontimeout = function () {
                    console.error("request timedout: ", xhr);
                }
                xhr.open(requestObj.method, requestObj.host + requestObj.request + "?" + requestObj.params[0] + "=" + namespace + "&" + requestObj.params[1] + "=" + src, /*async*/ true);
                xhr.send();
            });
        }

        this.getFields = function (tbl, callback) {
            //var fieldData = (tbl.split(':')[1]).split('.');
            getJSONDataByProperty($http, 'pythonServices', 'name', 'Python', function (data) {
                var requestObj = data[0].getFields;
                var namespace = localStorage.getItem('srcNamespace');
                console.log(JSON.stringify(requestObj));
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function (e) {
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
                xhr.ontimeout = function () {
                    console.error("request timedout: ", xhr);
                }
                xhr.open(requestObj.method, requestObj.host + requestObj.request + "?"
                    + requestObj.params[0] + "=" + namespace + "&&" + requestObj.params[1] + "=" + tbl + "&" + requestObj.params[2] + "=" + dataSrc, /*async*/ true);
                xhr.send();
            });
        }
    };

    return {
        getTables: function (src, callback) {
            if (src != 'DuoStore') var dSrc = eval('new PYTHON();');
            else var dSrc = eval('new ' + src.toUpperCase() + '();');
            this.dataSrcObj = new DataSource();
            this.dataSrcObj.setSource(dSrc);
            this.dataSrcObj.getTables(src, callback);
        },
        getFields: function (tbl, callback) {
            this.dataSrcObj.getFields(tbl, callback);
        }
    };


});