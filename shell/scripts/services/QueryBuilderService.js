routerApp.service('$qbuilder',function($diginengine,filterService,chartServices){
    this.sync = function(widgetData, cb){        
        var chartType = widgetData.selectedChart.chartType;
        var widType = eval('new ' + chartType.toUpperCase() + '();');
        widProt = new Widget(widType);
        widProt.sync(widgetData, cb);
    }


    var colors = ['#82b8d7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', 
             '#FF9655', '#FFF263', '#6AF9C4']
  
    var Widget = function(wid) {
        this.widget = wid;        
    };

    this.syncDrilledChart = function(obj,scope){
        var chart = obj.highchartsNG.getHighcharts();
        var cat = "";
        var newObj = {};
        var dataObj = [];
        var flag = true;
        if ( chart.options.customVar != obj.widData.drillConf.highestLvl ) {
            if (typeof obj.commonSrc.src.src != 'undefined'){
            var db = obj.commonSrc.src.src;}
            var cl = $diginengine.getClient(db);
            var series;
            angular.forEach(obj.highchartsNG.series,function(key){
                if(key.name == chart.series[0].name){
                    series = key.origName;
                }
            })
            cl.getExecQuery(obj.widData.drillConf.currentQuery, function(res, status, query) {
                if(status) {
                    filterService.filterAggData(res,obj.commonSrc.src.filterFields);
                    angular.forEach(obj.commonSrc.att, obj.commonSrc.src.id, function(field){
                        for(c in res[0]) {
                            if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                                if (c == field.filedName) {
                                    cat = c;
                                }
                            }
                        }
                    })
                    angular.forEach(obj.widData.drillConf.drillOrdArr,function(elem){
                        if(elem.name == cat) {
                            if (elem.nextLevel === undefined) {
                                flag = false;
                            }
                        }
                    })
                    angular.forEach(res,function(key){
                        newObj = {};
                        newObj = {
                            name : key[cat],
                            y:key[series],
                            drilldown: flag
                        }
                        dataObj.push(newObj);
                    })
                    chart.series[0].setData(dataObj);
                    scope.$apply(function(){
                        obj.syncState = true;
                    })
                    return;
                } else {
                    scope.$apply(function(){
                        obj.syncState = true;
                    })
                    return;
                }
            });
        }
    };

    Widget.prototype = {
        sync: function(wid, cb) {
            var q;
            var db;
            //console.log("wid object:"+JSON.stringify(wid));
            if (typeof wid.commonSrc.query != 'undefined'){
            var q = wid.commonSrc.query;}
            if (typeof wid.commonSrc.src.src != 'undefined'){
            var db = wid.commonSrc.src.src;}
            var cl = $diginengine.getClient(db);    
            return this.widget.sync(q,cl,wid, cb);
        }
    };

    var HIGHCHARTS = function() {
        function mapResult(cat, res, d, color, name, origName, cb){
            var serArr = [];
            var i = 0;
            for(c in res[0]){
                if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                    if(c != cat){
                        serArr.push({
                            temp: c,
                            name: name[i],
                            origName: origName[i],
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
                            y: parseFloat(key[ser.temp])
                        });
                    }else{
                        ser.data.push({
                            name: key[cat],
                            y: parseFloat(key[ser.temp]),
                            drilldown: true
                        });
                    }                    
                });
            });
            serArr.forEach(function(ser){
                delete ser.temp;
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
            cl.getExecQuery(q, widObj.commonSrc.src.id, function(res, status, query){
                var cat = "";
                var drilled;
                if(status){
                    filterService.filterAggData(res,widObj.commonSrc.src.filterFields);
                    for(c in res[0]){
                        if (Object.prototype.hasOwnProperty.call(res[0], c)) {
                            if(typeof res[0][c] == "string") cat = c;
                        }
                    }

                    if(cat != ""){
                        var color = [];
                        var name = [];
                        var origName = [];
                        for ( var i = 0; i < widObj.highchartsNG.series.length; i++){
                            color.push(widObj.highchartsNG.series[i].color);
                            name.push(widObj.highchartsNG.series[i].name);
                            origName.push(widObj.highchartsNG.series[i].origName);
                        }
                        drilled = widObj.widData.drilled;
                        mapResult(cat, res, drilled, color, name, origName, function(data){
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
                                }
                            },
                            click: function(){
                                //alert('test');
                            }
                        }
                    }
                    widObj.syncState = true;
                    cb(widObj);
                }else{
                    widObj.syncState = true;
                    cb(widObj);
                }
            });
        }
    };
    
    var METRIC = function() {
        function setMeasureData(res) {
            var val = "";
            for (var c in res) {
                if (Object.prototype.hasOwnProperty.call(res, c)) {
                    val = res[c];
                }
            }
            return val;
        }

        function setValues(widObj,metricValue,targetValue) {
            widObj.widData.decValue = metricValue[0];
            widObj.widData.value = convertDecimals(setMeasureData(metricValue[0]),parseInt(widObj.widData.dec)).toLocaleString();
            widObj.selectedChart.initObj.value = widObj.widData.value;
            widObj.selectedChart.initObj.decValue = widObj.widData.decValue;
            // Apply metric settings after filtering if target value is set
            if (widObj.selectedChart.initObj.targetValue != "" && widObj.selectedChart.initObj.targetValueString != "") {
                if (widObj.commonSrc.target.length == 1) {
                    widObj.selectedChart.initObj.targetValue = setMeasureData(targetValue[0]);
                    widObj.selectedChart.initObj.targetValueString = convertDecimals(widObj.selectedChart.initObj.targetValue,2).toLocaleString();
                }
                chartServices.applyMetricSettings(widObj.selectedChart);
            }
        }
        
        this.sync = function(q, cl, widObj, cb) {
            var targetRequest = false;
            var metricRequest = false;
            var targetSuccess = false;
            var metricSuccess = false;
            var metricValue, targetValue;
            if (widObj.commonSrc.target.length == 1) {
                cl.getExecQuery(widObj.selectedChart.initObj.targetQuery, widObj.commonSrc.src.id, function(res, status, targetQuery) {
                    if (status) {
                        targetRequest = true;
                        targetSuccess = true;
                        targetValue = res;
                        if (targetRequest && metricRequest) {
                            if (targetSuccess && metricSuccess) {
                                // call sync method
                                setValues(widObj,metricValue,targetValue);
                            }
                        }
                    } else {
                        targetRequest = true;
                    }
                });
            } else {
                targetRequest = true;
                targetSuccess = true;
            }
            cl.getExecQuery(q,  widObj.commonSrc.src.id, function(res, status, query) {
                if (status) {
                    metricRequest = true;
                    metricSuccess = true;
                    metricValue = res;
                    if (targetRequest && metricRequest) {
                        if (targetSuccess && metricSuccess) {
                            // call sync method
                            setValues(widObj,metricValue,targetValue);
                        }
                    }

                } else {
                    metricRequest = true;
                    metricSuccess = false;
                }
                widObj.syncState = true;
                cb(widObj);
            });
        }
    };
    
    var D3SUNBURST = function() {
        this.sync = function(q, cl, widObj, cb) {
            var fieldArray = [];
            var table = widObj.commonSrc.src.tbl;
            var id = widObj.commonSrc.src.id;
            var hObj= {};
            angular.forEach(widObj.commonSrc.att,function(attribute){
                fieldArray.push("'"+ attribute.filedName +"'");
            })
            cl.getHighestLevel(table,fieldArray.toString(),id,function(data,status){
                if(status) {
                    var measure = widObj.commonSrc.mea[0].filedName;
                    var agg = widObj.commonSrc.mea[0].condition;
                    data.forEach(function(entry) {
                        hObj[entry.value] = entry.level;
                    });
                    cl.getHierarchicalSummary(hObj,measure,agg,table, id, function(data, status) {
                        if (status) {
                            widObj.widData.data = data.children;
                            }
                        widObj.syncState = true;                    
                        cb(widObj);
                    });                    
                }
            })
        }
    }; 

    var D3HIERARCHY = function(){

        this.sync = function(q, cl, widObj, cb) {
            cl.getHierarchicalSummary(q, widObj.commonSrc.src.id, function(data, status) {
                if (status){
                    widObj.widData.data = data.children;
                    }
                widObj.syncState = true;
                cb(widObj);
            });
        }
    }; 

   var MAP = function(){

        this.sync = function(q, cl, widObj, cb) {
            cl.getHierarchicalSummary(q, widObj.commonSrc.src.id, function(data, status) {
                if (status){
                    widObj.widData.children = data.children;
                    }
                widObj.syncState = true;
                cb(widObj);
            });
        }
    }; 


    var FORECAST = function(){
        function mapResult(data,fObj,widObj){
                    var forcastArr =[];
                    var serArr = [];
                    var catArr = [];
                 if(fObj.forecastAtt == ""){

                                if(fObj.showActual == false){
                                    var a = data.data.forecast.length - fObj.fcast_days;
                                    for(var i =a ; i< data.data.forecast.length; i++){
                                        forcastArr.push(data.data.forecast[i]);
                                    }
                                    data.data.forecast = forcastArr;
                                    serArr.push({
                                        data: data.data.actual.concat(data.data.forecast),
                                        zoneAxis: 'x',
                                        color: colors[0],
                                        zones: [{
                                            value: data.data.actual.length - 1
                                        }, {
                                            dashStyle: 'dash'
                                        }]
                                    })
                                }else{
                                    serArr.push({
                                            name: 'Actual',
                                            data: data.data.actual,
                                            color: colors[0],
                                    })

                                    serArr.push({
                                        name: 'Forcasted',
                                        data: data.data.forecast,
                                        dashStyle: 'dash',
                                        color: colors[1],
                                    })
                                }

                                catArr = data.data.time;
                            }else{
                                if(fObj.showActual == false){
                                        Object.keys(data.data).forEach(function(key) {

                                            forcastArr =[];

                                            var obj = data.data[key];
                                            var a = obj.forecast.length - fObj.fcast_days;

                                            for(var i =a ; i < obj.forecast.length; i++){
                                                forcastArr.push(obj.forecast[i]);
                                            }
                                            obj.forecast = forcastArr;
                                            serArr.push({
                                                name: key,
                                                data: obj.actual.concat(obj.forecast),
                                                zoneAxis: 'x',
                                                zones: [{
                                                    value: obj.actual.length - 1
                                                }, {
                                                    dashStyle: 'dash'
                                                }]
                                            })

                                            catArr = obj.time;
                                        });

                                }else{
                                       Object.keys(data.data).forEach(function(key) {

                                            var obj = data.data[key];
                                          

                                            serArr.push({
                                            name: 'Actual  '+key,
                                            data: obj.actual,
                                            })

                                            serArr.push({
                                                name: 'Forcasted  '+key,
                                                data: obj.forecast,
                                                dashStyle: 'dash'
                                            })

                                            catArr = obj.time;
                                        });
                                }
                            }



            if(typeof serArr != "undefined"){
                  serArr.forEach(function(key) {
                     if (key.data.length > 1000) key['turboThreshold'] = key.data.length;
                   });
            }


            var  dataArray =[];
            if(widObj.isVisual == true){
            // ---------------------------------------------------------------------------------    
                var startdate = formattedDate(widObj.Vstart, widObj.foreCastObj.interval);
                var enddate = formattedDate(widObj.Vend, widObj.foreCastObj.interval);
                var xAxisLen = catArr.length;

                var startInd = -1;
                var endInd = -1;
                var cat = [];
                var data = [];
                for (var i = 0; i <= xAxisLen; i++) {

                    var date;
                    if(widObj.foreCastObj.interval == "Yearly"){
                        date = catArr[i] + "-01-01";
                    }else if(widObj.foreCastObj.interval == "Monthly"){
                        date = catArr[i] + "-01";
                    }else if(widObj.foreCastObj.interval == "Daily"){
                        date = catArr[i];
                    }


                    var x = new Date(startdate);
                    var y = new Date(date);
                    var z = new Date(enddate);
                    if (x <= y && y <= z) {
                        if (startInd == -1) {
                            startInd = i;
                        }

                        cat.push(catArr[i]);

                        if (i == xAxisLen - 1)
                            endInd = i;

                    } else if (startInd > -1) {
                        if (endInd == -1) {
                            endInd = i;
                        }
                    }
                }

                var seriesLen = serArr.length;

                for (var i = 0; i < seriesLen; i++) {
                    data = [];
                    var endIndex = startInd+cat.length;
                    for (var j = startInd; j < endIndex; j++) {
                        data.push(serArr[i].data[j]);
                    }

                    if (data.length > 0) {
                        serArr[i].data = data;
                        if(fObj.showActual != true){
                            serArr[i].zones[0].value = cat.length - fObj.fcast_days-1;
                        }else{
                             if(i%2 == 0 ){
                                var tempArr = [];
                                for(var indtemp=0 ; indtemp <= cat.length - fObj.fcast_days;indtemp++){
                                    tempArr.push(serArr[i].data[indtemp]);
                                }

                                serArr[i].data =tempArr;
                            }
                        }
                    }
                }

                if (cat.length > 0) {
                        dataArray[1] = cat;
                }
              
                dataArray[0] = serArr;
                
            }else{
                
                dataArray[0] = serArr;
                dataArray[1] = catArr;
            }
                
            return dataArray;        
        }



         var getAllDays = function (startdate,enddate) {
            var s = new Date(startdate);
            var e = new Date(enddate);
            var a = [];
            
            while(s < e) {
                a.push(getFormattedDate(s));
                s = new Date(s.setDate(
                    s.getDate() + 1
                ))
            }
            
            return a;
        };

        var getFormattedDate = function (date) {
              var year = date.getFullYear();
              var month = (1 + date.getMonth()).toString();
              month = month.length > 1 ? month : '0' + month;
              var day = date.getDate().toString();
              day = day.length > 1 ? day : '0' + day;
              return year +  '-' + month + '-' + day;
        }

        this.sync = function(q, cl, widObj, cb){
            cl.getForcast(widObj.foreCastObj,widObj,widObj.filterStr, function(data, status){
                if (status){
                    dataArray = mapResult(data,widObj.foreCastObj,widObj);
                    widObj.highchartsNG.series = dataArray[0];
                    widObj.highchartsNG.xAxis.categories = dataArray[1]; 
                    widObj.minDate =  data.act_min_date;
                    widObj.maxDate =  data.act_max_date;                     
                }
                widObj.syncState = true;
                cb(widObj);
            });
        }
    };

    var formattedDate = function (date,format) {

        var date;
        if(format ==  "Monthly"){
            var d = new Date(date || Date.now()),
                month = '' + (d.getMonth() + 1),
                day = '01',
                year = d.getFullYear();

            if (month.length < 2) month = month;
            if (day.length < 2) day = day;

            date =  [year, month, day].join('-');

        }else if(format==  "Yearly"){
             var d = new Date(date || Date.now()),
                month = '01' ,
                day = '01',
                year = d.getFullYear();

                date = [year, month, day].join('-');

        }else if(format == "Daily"){
             var d = new Date(date || Date.now()),
                month = '' + (d.getMonth() + 1),
                day = d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month ="0" +month;
            if (day.length < 2) day = "0"+day;

            date =  [year, month, day].join('-');
        } 

        return date;
    }

    var BOXPLOT = function(){

        function mapResult(data) {
            var i = 0;
            var observationsData = [];
            var dataOutliers = [];
            var plotCategories = [];
            var dataArray =   [];
            for (var key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    plotCategories.push(key);
                    observationsData.push([
                        data[key].l_w,
                        data[key].quartile_1,
                        data[key].quartile_2,
                        data[key].quartile_3,
                        data[key].u_w
                        ]);
                    data[key].outliers.forEach(function(k) {
                        dataOutliers.push([i, k]);
                    });
                    i++;
                    }
                }

                dataArray[0] = observationsData;
                dataArray[1] = dataOutliers;
                dataArray[2] = plotCategories;
                return dataArray;
        }

        this.sync = function(q, cl, widObj, cb){
            cl.generateboxplot(q, function(data, status){
                if(status){
                    var dataArray = mapResult(data);
                    widObj.highchartsNG.series[0].data = dataArray[0];
                    widObj.highchartsNG.series[1].data = dataArray[1];
                    widObj.highchartsNG.xAxis.categories = dataArray[2];

                }
                widObj.syncState = true;
                cb(widObj);
            });
        }
    };

    var HISTOGRAM = function(){

        function mapResult(data){
            var dataArray = [];
            var histogramPlotcat = [];
            var histogramPlotData = [];
            for ( var key in data){
                histogramPlotData.push(parseFloat(data[key][0]));
                var category = data[key].splice(0, 1);
                histogramPlotcat.push(data[key]);
                }
                dataArray[0] = histogramPlotData;
                dataArray[1] = histogramPlotcat;
            return dataArray;         
        }

        this.sync = function(q, cl, widObj, cb){
            cl.generatehist(q, function(data, status){
                if (status){
                    var dataArray = mapResult(data);
                    widObj.highchartsNG.series[0].data = dataArray[0];
                    widObj.highchartsNG.xAxis.categories = dataArray[1];
                }
                widObj.syncState = true;
                cb(widObj);
            });

        }

    };

    var PIVOTSUMMARY = function(){
        this.sync = function(q, cl, widObj, cb){
            cl.getExecQuery(q,  widObj.commonSrc.src.id, function(data, status) {
                widObj.widData.summary = data;
                widObj.syncState = true;
                cb(widObj);                
            }, widObj.limit);
        }
    };

    var BUBBLE = function(){
        var mapResult = function(data,a,b,c){
            var nameArray = [];

            for ( var i = 0; i < data.y.length; i++){
                nameArray[i] = data.c[i];
            }
            var dataArray = [];
            for ( var i = 0; i < data.y.length; i++){
                dataArray.push(
                {
                    x : data.x[i],
                    y : data.y[i],
                    z : data.s[i],
                    xName: a,
                    yName: b,
                    zName: c                      
                });
            }
            var seriesArray = [];
                for ( var i = 0; i < dataArray.length; i++){
                seriesArray.push(
                {
                    name: nameArray[i],
                    data: [dataArray[i]],
                });
                }
                return seriesArray;
        }

        this.sync = function(q, cl, widObj, cb){
            cl.generateBubble(q, function(data, status) {
                if(status){
                        var a = [];
                        var res = q.split("&");
                        for ( var c in res) {
                            if ( res[c].indexOf("x=") > -1 ) {
                                var x = res[c].split("x=");
                            }
                            if ( res[c].indexOf("y=") > -1 ) {
                                var y = res[c].split("y=");
                            }
                            if ( res[c].indexOf("s=") > -1 ) {
                                var z = res[c].split("s=");
                            }                                                
                    }
                    widObj.highchartsNG.series = mapResult(data,x[1],y[1],z[1]);
                }
                widObj.syncState = true;
                cb(widObj);
            });
        }

    }

});