routerApp.service('$qbuilder',function($diginengine){
    this.sync = function(wid, cb){        
        var chartType = wid.selectedChart.chartType;
        var widType = eval('new ' + chartType.toUpperCase() + '();');
        widProt = new Widget(widType);
        widProt.sync(wid, cb);
    }
    
    var Widget = function(wid) {
        this.widget = wid;        
    };
    
    Widget.prototype = {
        sync: function(wid, cb) {
            var q = wid.commonSrc.query;
            var db = wid.commonSrc.src.src;
            var cl = $diginengine.getClient(db);    
            return this.widget.sync(q,cl,wid, cb);
        }
    };
    
    var HIGHCHARTS = function() {
        function mapResult(cat, res, cb){
            var serArr = [];

            //dynamically building the series objects
            for(c in res[0]){
                if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                    if(c != cat){
                        serArr.push({
                            name: c,
                            data: []
                        });
                    }                
                }
            }

            //fill the series array
            res.forEach(function(key){
                serArr.forEach(function(ser){
                    ser.data.push({
                        name: key[cat],
                        y: parseFloat(key[ser.name])
                    });
                });
            });
            cb(serArr);
        }

        function setMeasureData(res){
            var series = [];
            for (var c in res) {
                if (Object.prototype.hasOwnProperty.call(res, c)) {
                    series.push({
                        name: c,
                        data: [res[c]]
                    })
                }
            }
            return series;
        }
        
        this.sync = function(q, cl, widObj, cb) {            
            cl.getExecQuery(q, function(res, status, query){
                var cat = "";
                if(status){
                    for(c in res[0]){
                        if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                            if(typeof res[0][c] == "string") cat = c;
                        }
                    }
                    
                    if(cat != ""){
                        mapResult(cat, res, function(data){
                            widObj.highchartsNG.series = data;
                        });
                    }else{
                        widObj.highchartsNG.series = setMeasureData(res[0]);
                    }
                    cb(widObj);
                }
            });
        }
    };
    
    var METRIC = function() {
        function setMeasureData(res){
            var val = "";
            for (var c in res) {
                if (Object.prototype.hasOwnProperty.call(res, c)) {
                    val = res[c];
                }
            }
            return val;
        }
        
        this.sync = function(q, cl, widObj, cb) {
            cl.getExecQuery(q, function(res, status, query){
                if(status){
                    widObj.widData.value = setMeasureData(res[0]);
                }
                cb(widObj);
            });
        }
    };
        
        
        
    
});