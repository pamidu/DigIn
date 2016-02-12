'use strict';
(function(dsh) {
    function getHost() {
        var host = window.location.hostname;

        if (host.indexOf("localhost") != -1 || host.indexOf("127.0.0.1") != -1) host = "104.131.48.155";
        return host;
    }
    dsh.factory('$diginengine', function($diginurls, $servicehelpers) {
        function DiginEngineClient(_dsid, _db) {
            var dataSetId = _dsid;
            var database = _db;

            return {
                getTables: function(cb) {
                    $servicehelpers.httpSend("get", function(data, status) {
                        cb(data, status);
                    }, $diginurls.diginengine + "/GetTables?dataSetName=" + dataSetId + "&db=" + database);
                },
                getFields: function(tbl, cb) {
                    $servicehelpers.httpSend("get", function(data, status) {
                        cb(data, status);
                    }, $diginurls.diginengine + "/GetFields?dataSetName=" + dataSetId + "&tableName=" + tbl + "&db=" + database);
                },
                getHighestLevel: function(tbl, fieldstr, cb) {
                    if (database == "BigQuery") {
                        $servicehelpers.httpSend("get", function(data, status) {
                            cb(data, status);
                        }, $diginurls.diginengine + "/gethighestlevel?tablename=[" + dataSetId + "." + tbl + "]&id=1&levels=[" + fieldstr + "]&plvl=All&db=" + database);


                    }
                    if (database == "MSSQL") {

                        $servicehelpers.httpSend("get", function(data, status) {
                            cb(data, status);
                        }, $diginurls.diginengine + "/gethighestlevel?tablename=" + tbl + "&id=1&levels=[" + fieldstr + "]&plvl=All&db=" + database);
                    }

                },
                getAggData: function(tbl, agg, aggf, cb, gb, con) {
                    if (database == "BigQuery") {
                        var wSrc = "scripts/webworkers/webWorker.js";
                        var params = "tablenames={1:%27" + tbl + " %27}&db=" + database + "&agg={%27" + agg + "%27:%27" + aggf + "%27}" + "&cons=&order_by={}";
                    }
                    if (database == "MSSQL") {
                        if (gb === undefined) {
                            var wSrc = "scripts/webworkers/webWorker.js";
                            var params = "tablenames={1:%27" + tbl + "%27}&db=" + database + "&group_by={}&agg={%27" + aggf + "%27:%27" + agg + "%27}" + "&cons=&order_by={}";
                        } else {
                            var wSrc = "scripts/webworkers/webWorker.js";
                            var params = "tablenames={1:%27" + tbl + "%27}&db=" + database + "&group_by={%27" + gb + "%27:1}&agg={%27" + aggf + "%27:%27" + agg + "%27}" + "&cons=&order_by={}";
                        }

                    }

                    // if (gb) params += "&group_by={'" + gb + "':1}";
                    if (con) params += "&cons=" + con;
                    var reqUrl = $diginurls.diginengine + "/aggregatefields?" + params;
                    var wData = {
                        rUrl: reqUrl,
                        method: "get"
                    };
                    $servicehelpers.sendWorker(wSrc, wData, function(data, status) {
                        cb(data, status);
                    });

                },

                getExecQuery: function(qStr, cb) {
                    var wSrc = "scripts/webworkers/webWorker.js";
                    var reqUrl = $diginurls.diginengine + "/executeQuery?query=" + qStr + "&db=" + database;
                    var wData = {
                        rUrl: reqUrl,
                        method: "get"
                    };
                    $servicehelpers.sendWorker(wSrc, wData, function(data, status) {
                        cb(data, status);
                    });
                }
            }
        }

        return {
            getClient: function(dsid, db) {
                return new DiginEngineClient(dsid, db);
            }
        }
    });
    dsh.factory('$servicehelpers', function($http) {
        return {
            httpSend: function(method, cb, reqUrl, obj) {
                if (method == "get") {
                    $http.get(reqUrl, {
                        headers: {}
                    }).
                    success(function(data, status, headers, config) {
                        cb(data, true);
                    }).
                    error(function(data, status, headers, config) {
                        cb(data, false);
                    });
                }
            },
            sendWorker: function(wSrc, wData, cb) {
                var w = new Worker(wSrc);
                w.postMessage(JSON.stringify(wData));
                w.addEventListener('message', function(event) {
                    cb(JSON.parse(event.data.res), event.data.state);
                });
            }
        }
    });
    dsh.factory('$diginurls', function() {
        var host = getHost();
        return {
            //            diginengine: "http://" + host + ":8080",
            diginengine: "http://192.168.2.33:8080",
            diginenginealt: "http://" + host + ":8081"
        };
    });
})(angular.module('diginServiceHandler', []))
