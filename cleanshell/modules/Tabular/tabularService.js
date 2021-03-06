TabularModule.service('tabularService',['$rootScope','$http','Digin_Engine_API','Digin_Domain','$diginengine','$diginurls', function($rootScope,$http,Digin_Engine_API,Digin_Domain,$diginengine,$diginurls){


    var thisService = this;
    var dataSource;
	this.setPagination = function(summaryData,config,settingCon,cb){

			config.userList.length =0;
			config.pageingArr.length=0;
            var pageCount = summaryData.length/settingCon.numOfRows;

            var numOfRows = parseInt(settingCon.numOfRows);
            var uperBound = parseInt(settingCon.numOfRows);
            var lowerBound = 0;

            for(var i = 0; i < Math.ceil(pageCount) ; i++){

                var pageEle = summaryData.slice(lowerBound,uperBound);

                var obj = {
                    "pageNum" : i,
                    "pageEle" : pageEle,
                    "pageLable" : lowerBound+1 +"-"+uperBound
                }

                config.pageingArr.push(obj);
                uperBound = uperBound+numOfRows;
                lowerBound = lowerBound+ numOfRows;
            }

            config.userList = config.pageingArr[0].pageEle;
            config.selectedPage = config.pageingArr[0].pageLable;
            config.currentPage=0;
            cb(config);

	}

	this.tabularNavigate =function (direction,config,init,tabularSettings){

        if(init == false){
            if(direction == "Next" && config.currentPage+1 < config.pageingArr.length){
                config.currentPage++;
                config.userList = config.pageingArr[config.currentPage].pageEle;
                config.selectedPage = config.pageingArr[config.currentPage].pageLable;
            }else if(direction == "Next" && config.currentPage+1 >= config.pageingArr.length){
                thisService.getNextDataSet(config,tabularSettings);
            }

            if(direction == "Prev" && config.currentPage > 0){
                config.currentPage--;
                config.userList = config.pageingArr[config.currentPage].pageEle;
                config.selectedPage = config.pageingArr[config.currentPage].pageLable;
            }
        }
        else{
            config.currentPage =0;
            config.userList = config.pageingArr[config.currentPage].pageEle;
            config.selectedPage = config.pageingArr[config.currentPage].pageLable;
        }
      

    }


    this.getNextDataSet = function(config,tabularSettings){

        var cl = $diginengine.getClient(config.dbType);
        var offset = config.pageingArr.length * tabularSettings.numOfRows;

        var query ="";
        config.isNext = true;
        if(typeof config.filters == undefined || config.filters == ""){
            query = config.query;
        }else{
            query = thisService.getExecQueryFilterArr(widget,widget.widgetData.filterStr,widget.widgetData.widData.tabularConfig.defSortFeild);
        }

        cl.getExecQuery(query, config.dataSource.datasource_id, function(data, status) {
            if(status){

                if(config.pageingArr[config.pageingArr.length-1].pageEle.length != tabularSettings.numOfRows){
                    
                    var lastpage = config.pageingArr.length-1;
                    var page = config.pageingArr[lastpage].pageEle;
                    var max = tabularSettings.numOfRows - config.pageingArr[lastpage].pageEle.length;
                    var dataArr = data.slice(0,max)

                    for(var i = 0 ; i < dataArr.length; i++ ){
                        page.push(dataArr[i]);
                    }
                }

                var pageCount = parseInt(config.pageingArr.length) + data.length/tabularSettings.numOfRows;

                var numOfRows = parseInt(tabularSettings.numOfRows);
                var uperBound = parseInt(tabularSettings.numOfRows);
                var lowerBound = 0;

                for(var i = config.pageingArr.length; i < Math.ceil(pageCount) ; i++){

                    var pageEle = data.slice(lowerBound,uperBound);

                    var down = ((config.pageingArr.length)*parseInt(tabularSettings.numOfRows))+1 ;
                    var up = ( parseInt(config.pageingArr.length)*parseInt(tabularSettings.numOfRows))+parseInt(tabularSettings.numOfRows);
                    var obj = {
                        "pageNum" : i,
                        "pageEle" : pageEle,
                        "pageLable" : down +"-"+ up
                    }

                    config.pageingArr.push(obj);
                    uperBound = uperBound+numOfRows;
                    lowerBound = lowerBound+ numOfRows;

                }

                config.currentPage++;
                config.isNext = false;
                config.userList = config.pageingArr[config.currentPage].pageEle;
                config.selectedPage = config.pageingArr[config.currentPage].pageLable;

            }
        },100,offset);
    }

    this.getExecQueryFilterArr = function(widget,filterStr,sortFeild){


        var fieldArray = [];
        var FilterQuery = "";
        var dataBaseEng ="";
        var table = "";
        var dataEng = "";

        if(typeof widget.widgetData.commonSrc == "undefined"){
            dataEng = thisService.dataSource.src;
            table = thisService.dataSource.tbl;
        }else{
            dataEng = widget.widgetData.commonSrc.src.src;
            table = widget.widgetData.commonSrc.src.tbl;
        }

        

        if( dataEng == "BigQuery" || dataEng == "memsql"){
            for(var i=0; i < widget.widgetData.widData.tabularConfig.AllingArr.length; i++){

                fieldArray.push(widget.widgetData.widData.tabularConfig.AllingArr[i].Attribute);
            }

        
            FilterQuery = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + table + " WHERE "+ filterStr +" ORDER BY "+sortFeild+" "+widget.widgetData.widData.tabularConfig.AscOrDec;

        }
        else{
            for(var i=0; i < widget.widgetData.widData.tabularConfig.AllingArr.length; i++){

                fieldArray.push('['+widget.widgetData.widData.tabularConfig.AllingArr[i].Attribute+']');
            }

            var defSortFeild='['+widget.widgetData.widData.tabularConfig.defSortFeild+']';
            FilterQuery = "SELECT " + fieldArray.toString() + " FROM " +"["+ table.split(".")[0]+ "].["+table.split(".")[1] +"]" + " WHERE " + filterStr + " ORDER BY "+"["+sortFeild+"]"+" "+widget.widgetData.widData.tabularConfig.AscOrDec;
        }

       return FilterQuery;
    }


    this.executeQuery=function(db, sourceData , tabulrSettings ,filterStr, config, cb){  

           
            var fieldArray = [];
            var fieldArrayMSSQL = [];

            var widgetConfig = "";

            var executeColumns = tabulrSettings.AllingArr;

            var fieldArrayLength = executeColumns.length;
            var chartState = true;

                for (var i = 0; i < executeColumns.length; i++) {
                    fieldArray.push(executeColumns[i].Attribute);
                    fieldArrayMSSQL.push('['+executeColumns[i].Attribute+']');
                }
               
                
                //If user dosent select a default sort column set 
                if(tabulrSettings.defSortFeild == ""){
                    tabulrSettings.defSortFeild = tabulrSettings.AllingArr[0].Attribute; 
                }

                var dataSourceID = "";
                
                if(!config.isSort){
                    if (db == "BigQuery" || db == "memsql") {
                        dataSourceID = sourceData.datasource_id
                        //if(typeof widget.widgetData.filterStr == "undefined" || widget.widgetData.filterStr == ""){
                        if(true){
                            var query = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + sourceData.datasource_name + " ORDER BY "+tabulrSettings.defSortFeild+" "+tabulrSettings.AscOrDec;
                        }
                        else{
                            var query = thisService.getExecQueryFilterArr(widget,widget.widgetData.filterStr,defSortFeild);
                        }
                    } else {
                           

                          if(typeof widget.widgetData.filterStr == "undefined" || widget.widgetData.filterStr == ""){
                              var defSortFeild='['+widget.widgetData.widData.tabularConfig.defSortFeild+']';
                              var query = "SELECT " + fieldArrayMSSQL.toString() + " FROM " +"["+ sourceData.tbl.split(".")[0]+ "].["+sourceData.tbl.split(".")[1] +"]"+ " ORDER BY "+defSortFeild+" "+widgetData.widData.tabularConfig.AscOrDec;
                                
                            }
                            else{
                                 var defSortFeild = widget.widgetData.widData.tabularConfig.defSortFeild;
                                var query = thisService.getExecQueryFilterArr(widget,widget.widgetData.filterStr,defSortFeild);
                            }
                    }
                }
                else{
                    if (db == "BigQuery" || db == "memsql") {

                        //if(typeof widget.widgetData.filterStr == "undefined" || widget.widgetData.filterStr == ""){
                        if(true){
                              var query = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + sourceData.datasource_name + " ORDER BY "+config.oderByclumn+" "+config.OrderType;
                        }
                        else{
                            var query = thisService.getExecQueryFilterArr(widget,widget.widgetData.filterStr,orderByColumnName);
                        }
                    } else {
                       

                        if(typeof widget.widgetData.filterStr == "undefined" || widget.widgetData.filterStr == ""){
                             var orderByColumnName='['+orderByColumnName+']';
                            var query = "SELECT " + fieldArrayMSSQL.toString() + " FROM " + "["+ sourceData.tbl.split(".")[0] +"].["+ sourceData.tbl.split(".")[1] + "]" +" ORDER BY "+orderByColumnName+" "+OrderType;
                                 
                            }
                            else{
                                var orderByColumnName = orderByColumnName;
                                var query = thisService.getExecQueryFilterArr(widget,widget.widgetData.filterStr,orderByColumnName);
                            }
                    }
                }

                config.query = query;
                var cl = $diginengine.getClient(db);
                cl.getExecQuery(query, dataSourceID, function(data, status) {
                    //#to get aggregations
                    if(tabulrSettings.totForNumeric == "true" ){

                        if(tabulrSettings.AllingArr.length > 0){

                            var fieldArr=[];
                            for(var i=0; i < tabulrSettings.AllingArr.length; i++ ){

                                if(tabulrSettings.AllingArr[i].isString == false){
                                    var obj = {
                                        "agg": tabulrSettings.AllingArr[i].Aggregation,
                                        "field": tabulrSettings.AllingArr[i].Attribute
                                    };

                                    fieldArr.push(obj);
                                }
                                    

                            }

                            if(fieldArr.length>0){
                                 cl.getAggData(sourceData.datasource_name, fieldArr, 100, dataSourceID , function(res, status, Aggquery) {
                                       if(status == true){
                                         
                                          for(var i = 0; i < fieldArr.length ; i++)  {
                                                var str = (fieldArr[i].agg+"_"+fieldArr[i].field).toString();

                                                var splitArr = str.split(" ")
                                                str="";
                                                for(var a=0; a < splitArr.length ; a++){

                                                    str = str + splitArr[a]; 
                                                }
                                                
                                                var obj = {
                                                    field : fieldArr[i].field,
                                                    aggName: fieldArr[i].agg+"_"+fieldArr[i].field,
                                                    value : res[0][str] 
                                                }

                                                for(var j=0; j < tabulrSettings.AllingArr.length; j++){

                                                    if(tabulrSettings.AllingArr[j].Attribute == fieldArr[i].field){

                                                        tabulrSettings.AllingArr[j].Aggregation_value = Math.round(res[0][str] * 100) / 100  ;

                                                    }
                                                }
                                          
                                          }

                                        config.aggQuerry  =Aggquery;
                                        thisService.setPagination(data,config,tabulrSettings,cb);

                                       }
                                },undefined,filterStr);
                            }
                            else{
                                config.aggQuerry  =Aggquery;
                                thisService.setPagination(data,config,tabulrSettings,cb);
                                
                            }
                        }
                    }
                    else{
                                    
                        config.aggQuerry  =Aggquery;
                        thisService.setPagination(data,config,tabulrSettings,cb);
                                    
                    } 

        
                },  100);

    }

    this.numberWithCommas = function (x) {

        if(!isNaN(x))
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        else
            return x;
    }

    this.changeSort=function(name,config,tabularSettings){
      
        config.isloading = true;
        //widget.widgetData.syncState = false;
        if(config.sort==name.Attribute){
          config.sort='-'+name.Attribute;
          config.oderByclumn=name.Attribute;
          config.OrderType='DESC';
          config.isSort=true;
        }else if(config.sort=='-'+name.Attribute){
          config.sort='';
          config.isSort=false;
        }else{
          config.sort=name.Attribute;
          config.oderByclumn=name.Attribute;
          config.OrderType='ASC';
          config.isSort=true;
        }

        
        this.executeQuery(config.dbType, config.dataSource,tabularSettings,config.filters,config,  function(query){

             config.isloading = false;
            // var query=query;
            // widget.widgetData.syncState = true;
            //$scope.eventHndler.isLoadingChart = false;
            //$scope.dataToBeBind.receivedQuery = query;
            //$scope.widget.widgetData.widData.query = query;
        });

    }


}]);