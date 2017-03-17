////////////////////////////////
// File : diginServicehandler.js
// Owner  : Dilani
// Last changed date : 2017/03/03
// Version : 3.1.0.3
// Modified By : Dilshan
/////////////////////////////////


(function (){
    
    function getHost() {
        var host = window.location.hostname;

        if (host.indexOf("localhost") != -1 || host.indexOf("127.0.0.1") != -1) host = "104.131.48.155";
        return host;
    }

    function getNamespace() {
        var authdata=JSON.parse(decodeURIComponent(getCookie('authData')));        
        var namespace = authdata.Email.replace('@', '_');
        var namespace = authdata.Email.replace(/[@.]/g, '_');
        return namespace;
    }
    DiginServiceLibraryModule.factory('$diginengine', function($diginurls, $servicehelpers) {
        function DiginEngineClient(_dsid, _db) {
            var dataSetId = _dsid;
            var database = _db;

            return {
                getTables: function(cb) {
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                        cb(data, status);
                    }, $diginurls.diginengine + "GetTables?dataSetName=" + getNamespace() + "&db=" + database);
                },
                getFolders: function(f_name,cb) {
                    var url_string = "get_system_directories?folder_type=data_source_folder";
                    if (f_name){
                        url_string += "&folder_name="+f_name;
                    } else{
                        url_string += "&folder_name=";
                    }
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                        cb(data, status);
                    }, $diginurls.diginengine + url_string);
                },
                getConnectionTables: function(id,db,cb) {
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                        cb(data, status);
                    }, $diginurls.diginengine + "GetTables?db="+db+"&datasource_config_id=" + id);
                },
                getFields: function(tbl, cb) {
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                        cb(data, status);
                    }, $diginurls.diginengine + "GetFields?dataSetName=" + getNamespace() + "&tableName=" + tbl + "&db=" + database + "&schema=public");
                },
                getMSSQLFields: function(tbl, MSSQLid, cb) {
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                        cb(data, status);
                    }, $diginurls.diginengine + "GetFields?dataSetName=" + getNamespace() + "&tableName=" + tbl + "&db=" + database + "&schema=public&datasource_config_id=" + MSSQLid);
                },
                getHighestLevel: function(tbl, fieldstr, id, cb) {
                    if (database == "BigQuery" || database == "memsql") {
                        $servicehelpers.httpSend("get", function(data, status, msg) {
                            cb(data, status);
                        }, $diginurls.diginengine + "gethighestlevel?tablename=[" + getNamespace() + "." + tbl + "]&id=1&levels=[" + fieldstr + "]&plvl=All&db=" + database + "&datasource_id=" + id);
                    }
                    if (database == "MSSQL") {
                        var db = tbl.split(".");
                        $servicehelpers.httpSend("get", function(data, status, msg) {
                            cb(data, status);
                        }, $diginurls.diginengine + "gethighestlevel?tablename=[" + db[0] + '].[' + db[1] + "]&id=1&levels=[" + fieldstr + "]&plvl=All&db=" + database + "&datasource_config_id=" + id);
                    }
                    if (database == "postgresql") {

                        $servicehelpers.httpSend("get", function(data, status, msg) {
                            cb(data, status);
                        }, $diginurls.diginengine + "gethighestlevel?tablename=" + tbl + "&id=1&levels=[" + fieldstr + "]&plvl=All&db=" + database);
                    }
                    if(database == "hiveql"){
                         $servicehelpers.httpSend("get", function(data, status, msg) {
                            cb(data, status);
                        }, $diginurls.diginengine + "gethighestlevel?tablename=" + tbl + "&id=1&levels=[" + fieldstr + "]&plvl=All&db=" + database + "&datasource_config_id=" + id);
                    }
                    if(database == "Oracle"){
                         $servicehelpers.httpSend("get", function(data, status, msg) {
                            cb(data, status);
                        }, $diginurls.diginengine + "gethighestlevel?tablename=" + tbl + "&id=1&levels=[" + fieldstr + "]&plvl=All&db=" + database + "&datasource_config_id=" + id);
                    }

                },
                // gb = display column
                // ob = sorting coulmn 
                getAggData: function(tbl, aggObjArr, limit, id, cb, gb, con, ob) {
                    var strField = "";
                    if (con !== undefined) {
                        // con = con.replace(/&/g , "%26");                        
                    }
                    if (ob === undefined) {
                        ob = gb;
                    }
                    aggObjArr.forEach(function(key) {
                        if (database == "MSSQL") {
                            if (key.field !== undefined){
                                strField += "[%27[" + key.field + "]%27,%27" + key.agg + "%27],";                            
                            } else{
                                strField += "[%27[" + key.filedName + "]%27,%27" + key.condition + "%27],";
                            }
                        } else {
                            if (key.field !== undefined){
                                strField += "[%27" + key.field + "%27,%27" + key.agg + "%27],";                            
                            } else{
                                strField += "[%27" + key.filedName + "%27,%27" + key.condition + "%27],";
                            }
                        }
                    });

                    var wSrc = "js/services/webWorker.js";
                    if (database == "BigQuery") {
                        if (!gb) {
                            var params = "tablenames={1:%27" + getNamespace() + "." + tbl + "%27}&db=" + database + "&agg=[" + strField + "]" + "&group_by={}&cons=&order_by={}" + "&datasource_id=" + id;
                        } else {
                            var params = "tablenames={1:%27" + getNamespace() + "." + tbl + "%27}&db=" + database + "&agg=[" + strField + "]" + "&group_by={%27" + gb + "%27:1}&cons=&order_by={%27" + ob + "%27:1}"  + "&datasource_id=" + id;
                        }
                    }
                    if (database == "memsql") {

                    // gb = display column
                    // ob = sorting coulmn 

                        if (!gb) {
                            var params = "tablenames={1:%27" + getNamespace() + "." + tbl + "%27}&db=" + database + "&agg=[" + strField + "]" + "&group_by={}&cons=&order_by={}" + "&datasource_id=" + id;
                        }
                        else  {
                            var params = "tablenames={1:%27" + getNamespace() + "." + tbl + "%27}&db=" + database + "&agg=[" + strField + "]" + "&group_by={%27" + gb + "%27:1}&cons=&order_by={%27" + ob + "%27:1}"  + "&datasource_id=" + id;
                        }
                    }
                    if (database == "MSSQL" ) {
                        var db = tbl.split(".");
                        if (gb === undefined) {
                            var params = "tablenames={1:%27[" + db[0] + '].[' + db[1] + "]%27}&db=" + database + "&group_by={}&agg=[" + strField + "]&cons=&order_by={}&id=" + Math.floor((Math.random() * 10) + 1) + "&datasource_config_id=" + id;
                        } else {
                            var params = "tablenames={1:%27[" + db[0] + '].[' + db[1] + "]%27}&db=" + database + "&group_by={%27[" + gb + "]%27:1}&&agg=[" + strField + "]&cons=&order_by={%27[" + ob + "]%27:1}&id=" + Math.floor((Math.random() * 10) + 1) + "&datasource_config_id=" + id;
                        }
                    }
                    if (database == "postgresql" ) {
                        if (gb === undefined) {
                            var params = "tablenames={1:%27" + tbl + "%27}&db=" + database + "&group_by={}&agg=[" + strField + "]&cons=&order_by={}&id=" + Math.floor((Math.random() * 10) + 1);
                        } else {
                            var params = "tablenames={1:%27" + tbl + "%27}&db=" + database + "&group_by={%27" + gb + "%27:1}&&agg=[" + strField + "]&cons=&order_by={%27[" + ob + "]%27:1}&id=" + Math.floor((Math.random() * 10) + 1);
                        }
                    }
                    if(database == "hiveql"){
                        if (gb === undefined) {
                            var params = "tablenames={1:%27" + tbl + "%27}&db=" + database + "&group_by={}&agg=[" + strField + "]&cons=&order_by={}&id=" + Math.floor((Math.random() * 10) + 1)+ "&datasource_config_id=" + id;;
                        } else {
                            var params = "tablenames={1:%27" + tbl + "%27}&db=" + database + "&group_by={%27" + gb + "%27:1}&&agg=[" + strField + "]&cons=&order_by={%27[" + ob + "]%27:1}&id=" + Math.floor((Math.random() * 10) + 1)+ "&datasource_config_id=" + id;;
                        }
                    }
                    if(database == "Oracle"){
                        if (gb === undefined) {
                            var params = "tablenames={1:%27" + tbl + "%27}&db=" + database + "&group_by={}&agg=[" + strField + "]&cons=&order_by={}&id=" + Math.floor((Math.random() * 10) + 1)+ "&datasource_config_id=" + id;;
                        } else {
                            var params = "tablenames={1:%27" + tbl + "%27}&db=" + database + "&group_by={%27" + gb + "%27:1}&&agg=[" + strField + "]&cons=&order_by={%27" + ob + "%27:1}&id=" + Math.floor((Math.random() * 10) + 1)+ "&datasource_config_id=" + id;;
                        }
                    }

                    // if (gb) params += "&group_by={'" + gb + "':1}";
                    if (con) params += "&cons=" + con;
                    if (limit) params += "&limit=" + limit;
                    var reqUrl = $diginurls.diginengine + "aggregatefields?" + params;
                    var wData = {
                        rUrl: reqUrl,
                        method: "get"
                    };
                    $servicehelpers.sendWorker(wSrc, wData, function(data, status, msg) {
                        cb(data, status, msg);
                    });

                },

                getExecQuery: function(qStr, id, cb, limit,offset) {
                    var wSrc = "js/services/webWorker.js";
                    var limVal = undefined;
                    var offVal = 0;
                    if (limit) 
                        limVal = limit;
                    if (offset) 
                        offVal = offset;
                    if (database == 'MSSQL')
                        var reqUrl = $diginurls.diginengine + "executeQuery?query=" + qStr + "&db=" + database + "&limit=" + limVal + "&offset=" + offVal + "&datasource_config_id=" + id;
                    else if (database == 'BigQuery' || database == "memsql")
                        var reqUrl = $diginurls.diginengine + "executeQuery?query=" + qStr + "&db=" + database + "&limit=" + limVal + "&offset=" + offVal+ "&datasource_id=" + id;
                    else if (database == 'hiveql')
                        var reqUrl = $diginurls.diginengine + "executeQuery?query=" + qStr + "&db=" + database + "&datasource_config_id=" + id;
                    else if (database == 'Oracle')
                        var reqUrl = $diginurls.diginengine + "executeQuery?query=" + qStr + "&db=" + database + "&datasource_config_id=" + id;
                    else 
                        var reqUrl = $diginurls.diginengine + "executeQuery?query=" + qStr + "&db=" + database + "&limit=" + limVal;

                    var wData = {
                        rUrl: reqUrl,
                        method: "get"
                    };
                    $servicehelpers.sendWorker(wSrc, wData, function(data, status, msg) {
                        cb(data, status, msg);
                    });
                },

                getHierarchicalSummary: function(hObj,measure,aggData,tbl,id,cb) {
                    var query = "";
                    if (database == "BigQuery" || database == "memsql") {
                        query = $diginurls.diginengine + "hierarchicalsummary?h=" + JSON.stringify(hObj) + "&tablename=[" + 
                        getNamespace() + "." + tbl + "] &measure=" + measure + "&agg=" + aggData + "&id=19&db=" + database + "&datasource_id=" + id;
                    } else if ( database == "MSSQL") {
                        var db = tbl.split(".");
                        query = $diginurls.diginengine + "hierarchicalsummary?h=" + JSON.stringify(hObj) + "&tablename=[" + 
                        db[0] + '].[' + db[1] + "]&measure=[" + measure + "]&agg=" + aggData + "&db=" + database + "&datasource_config_id=" + id;
                    } else {
                        query = $diginurls.diginengine + "hierarchicalsummary?h=" + JSON.stringify(hObj) + "&tablename=" + 
                        tbl + "&measure=" + measure + "&agg=" + aggData + "&db=" + database;
                    }
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                        cb(data, status);
                    }, query);
                },

                generateboxplot: function(query, cb) {
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                        cb(data, status);
                    }, query);
                },


                generatehist: function(query, cb) {
                        $servicehelpers.httpSend("get", function(data, status, msg) {
                            cb(data, status);
                        }, query);
                },

                generateBubble: function(query, cb) {
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                        cb(data, status);                        
                    }, query);
                },

                getForcast: function(fObj,widget,filters,id, cb, gb) {

                    //check filters for undefine 
                    if(typeof filters == "undefined"){
                        filters ="";
                    }


                    function formattedDate(date) {

                            var d = new Date(date || Date.now()),
                                month = '' + (d.getMonth() + 1),
                                day = '' + d.getDate(),
                                year = d.getFullYear();

                            if (month.length < 2) month = "0"+ month;
                            if (day.length < 2) day ="0"+   day;

                            return [year,month, day].join('-');
                    }

            
                    var endDate,startdate;
                    if (new Date(fObj.enddate) > new Date(fObj.startdate)){
                        endDate = "'"+formattedDate(fObj.enddate)+"'" ;
                        startdate = "'"+formattedDate(fObj.startdate)+"'";
                        
                    }
                    else{
                        endDate = "";
                        startdate = "";
                    }
                    

                    if(database == "BigQuery" || database == "memsql")
                    {
                    $servicehelpers.httpSend("get", function(data, status, msg) {
                            cb(data, status,fObj);
                        }, $diginurls.diginengine + "forecast?model=" + fObj.mod +
                        "&method=" + fObj.method +
                        "&alpha=" + fObj.a +
                        "&beta=" + fObj.b +
                        "&gamma=" + fObj.g +
                        "&n_predict=" + fObj.fcast_days +
                        "&table=[" + widget.namespace + "." + fObj.tbl + 
                        "]&date_field=" + fObj.date_field +
                        "&f_field=" + fObj.f_field +
                        "&period=" + fObj.interval +
                        "&len_season=" + fObj.len_season +
                        "&start_date=" + startdate +
                        "&end_date=" + endDate +
                        "&group_by=" + fObj.forecastAtt +
                        "&filter="+filters+
                        "&dbtype=" + database+
                        "&datasource_config_id="+ ""+
                        "&datasource_id="+ id);
                      }
                      else
                      {

                        var group_by ="";
                        if(fObj.forecastAtt != ""){
                             group_by = "["+fObj.forecastAtt+"]";
                        }

                        var str = fObj.tbl;
                        var res = str.split(".");
                        var tableName = "["+res[0]+"]."+"["+res[1]+"]";

                          $servicehelpers.httpSend("get", function(data, status, msg) {
                            cb(data, status,fObj);
                        }, $diginurls.diginengine + "forecast?model=" + fObj.mod +
                        "&method=" + fObj.method +
                        "&alpha=" + fObj.a +
                        "&beta=" + fObj.b +
                        "&gamma=" + fObj.g +
                        "&n_predict=" + fObj.fcast_days +
                        "&table= "+ tableName+
                        "&date_field=[" + fObj.date_field +
                        "]&f_field=[" + fObj.f_field +
                        "]&period=" + fObj.interval +
                        "&len_season=" + fObj.len_season +
                        "&start_date=" + startdate +
                        "&end_date=" + endDate +
                        "&group_by=" + group_by +
                        "&filter="+filters+
                        "&dbtype=" + database+
                        "&datasource_config_id="+id +
                        "&datasource_id="+ id);
                      }

                }
            }
        }

        return {
            getClient: function(db, dsid) {
                if (!dsid) return new DiginEngineClient(getNamespace(), db);
                else return new DiginEngineClient(dsid, db);
            },
            getUUID: function(amount,cb){
                $servicehelpers.httpSend("get", function(data, status, msg) {
                    if(amount > 1)
                        cb(data);    
                    else
                        cb(data[0]);                
                }, $diginurls.diginengine + "get_uuid?n=" + amount);
            }
        }
    });
    
    DiginServiceLibraryModule.factory('datasourceFactory', function ($http, Digin_Engine_API) {
        return {
            getAllConnections: function(securityToken,dbType) {
                return $http({
                    method: 'GET',
                    url: Digin_Engine_API + 'get_datasource_config?SecurityToken=' + securityToken
                        + '&connectiontype=' + dbType
                })
            },
            /*
                reqParam = {host:host name, username:user name, password:password, port:port}
            */
            getAllDatabases: function(securityToken,reqParam,dbType) {
                return $http({
                    method: 'GET',
                    url: Digin_Engine_API + 'get_all_databases?' + 
                    'SecurityToken=' + securityToken +
                    '&hostname=' + reqParam.host + 
                    '&port=' + reqParam.port +
                    '&username=' + reqParam.username + 
                    '&password=' + reqParam.password +
                    '&db=' + dbType
                })
            },
            testConnection: function(securityToken,reqParam,dbType) {
                return $http({
                    method: 'GET',
                    url: Digin_Engine_API + 'test_database_connection?' + 
                    'SecurityToken=' + securityToken +
                    '&hostname=' + reqParam.host + 
                    '&port=' + reqParam.port +
                    '&username=' + reqParam.username + 
                    '&password=' + reqParam.password + 
                    '&databasename=' + reqParam.databaseName+
                    '&db=' + dbType
                })
            },
            saveConnection: function(securityToken,reqParam) {
                return $http({
                    method: 'POST',
                    url: Digin_Engine_API + 'store_datasource_config/',
                    data: angular.toJson(reqParam),
                    headers: {
                        'Content-Type': 'application/json',
                        'securityToken' : securityToken
                    }
                })
            }
        }
    });
    
     DiginServiceLibraryModule.factory('$servicehelpers', function($http, $auth, Digin_Domain) {
        return {
            httpSend: function(method, cb, reqUrl, obj) {
                if (method == "get") {
                    /*$http.get(reqUrl + '&SecurityToken=' + getCookie("securityToken") + '&Domain=' + Digin_Domain, {
                        headers: {}
                    }).
                    success(function(data, status, headers, config) {
                        (data.Is_Success) ? cb(data.Result, true, data.Custom_Message): cb(data.Custom_Message, false, "");
                    }).
                    error(function(data, status, headers, config) {
                        cb(data, false, "");
                    });*/
                    $http({
                          method: 'GET',
                          url: reqUrl + '&SecurityToken=' + getCookie("securityToken") + '&Domain=' + Digin_Domain
                    }).then(function successCallback(response) {
                        console.log(response);
                        (response.data.Is_Success) ? cb(response.data.Result, true, response.data.Custom_Message): cb(response.data.Custom_Message, false, "");
                      }, function errorCallback(response) {
                          cb(response.data, false, "");
                      });
                }
            },
            sendWorker: function(wSrc, wData, cb) {
                var w = new Worker(wSrc);

                wData.rUrl = wData.rUrl + "&SecurityToken=" + getCookie("securityToken") + "&Domain=" + Digin_Domain;
                w.postMessage(JSON.stringify(wData));
                w.addEventListener('message', function(event) {
                    if (event.data.state) {
                        var res = JSON.parse(event.data.res);
                        res.Is_Success ? cb(res.Result, res.Is_Success, res.Custom_Message) : cb(res.Custom_Message, res.Is_Success, "");
                    } else {
                        if (typeof res != "undefined")
                            cb(res.Custom_Message, event.data.state, "");
                        else cb(null, event.data.state, "");
                    }

                });
            }
        }
    });

    
    DiginServiceLibraryModule.factory('$diginurls', function(Digin_Engine_API) {
        var host = getHost();
        return {
            //diginengine: "http://" + host + ":8080",

            diginengine: Digin_Engine_API,
            //diginengine: "http://192.168.2.33:8080",
            diginenginealt: "http://" + host + ":8081",
            getNamespace: function getNamespace() {
                var authdata = JSON.parse(decodeURIComponent(getCookie('authData')));
                var namespace = authdata.Email.replace('@', '_');
                namespace = namespace.replace(/\./g, '_');

                return namespace;
            }
        };
    });

})();