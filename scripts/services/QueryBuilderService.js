routerApp.service('$qbuilder',function($diginengine){
    this.sync = function(widgetData, cb){        
        var chartType = widgetData.selectedChart.chartType;
        var widType = eval('new ' + chartType.toUpperCase() + '();');
        widProt = new Widget(widType);
        widProt.sync(widgetData, cb);
    }
    
    var Widget = function(wid) {
        this.widget = wid;        
    };
    
    Widget.prototype = {
        sync: function(wid, cb) {
            //console.log("wid object:"+JSON.stringify(wid));
            var q = wid.commonSrc.query;
            var db = wid.commonSrc.src.src;
            var cl = $diginengine.getClient(db);    
            return this.widget.sync(q,cl,wid, cb);
        }
    };
    
    var HIGHCHARTS = function() {
        function mapResult(cat, res, d, color, cb){
            var serArr = [];
            var i = 0;
            for(c in res[0]){
                if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                    if(c != cat){
                        serArr.push({
                            name: c,
                            data: [],
                            color: color[i]
                        });
                        i++;
                    }                
                }
            }

            //fill the series array
            res.forEach(function(key){
                serArr.forEach(function(ser){

                    if(!d){
                        ser.data.push({
                            name: key[cat],
                            y: parseFloat(key[ser.name])
                        });
                    }else{
                        ser.data.push({
                            name: key[cat],
                            y: parseFloat(key[ser.name]),
                            drilldown: true
                        });
                    }                    
                });
            });
            cb(serArr);
        }

        function setMeasureData(res,measureData){
            var series = [];
            var i = 0;
            var cat = []
                for ( var i = 0; i < measureData.length; i++){
                    cat[i] = measureData[i].origName;
                    measureData[i].data = [];
                }

            for ( c in res[0]){
                if(cat.indexOf(c) == -1 ){
                    var y = c;
                }
            }

            res.forEach(function (key) {
                measureData.forEach(function(data){
                    data.data.push({
                        name: key[y],
                        y: parseFloat(key[data.origName])
                    });
                })
            })

            return measureData;
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
                        var color = [];
                        for ( var i = 0; i < widObj.highchartsNG.series.length; i++){
                            color[i] = widObj.highchartsNG.series[i].color;
                        }
                        mapResult(cat, res, widObj.widData.drilled, color, function(data){
                            widObj.highchartsNG.series = data;
                        });
                    }else{
                        var measureData = widObj.highchartsNG.series;
                        widObj.highchartsNG.series = setMeasureData(res,measureData);
                    }

                    if(typeof widObj.widData.drilled != "undefined")
                    {
                        widObj.highchartsNG.options.chart['events'] ={
                            drilldown: function (e) {                                
                                if (!e.seriesOptions) {
                                    console.log('drilled');
                                }
                            },
                            click: function(){
                                //alert('test');
                            }
                        }
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
                    widObj.widData.decValue = res[0];
                    widObj.widData.value = convertDecimals(setMeasureData(res[0]),parseInt(widObj.widData.dec));
                }
                cb(widObj);
            });
        }
    };
        
        
        
    
});