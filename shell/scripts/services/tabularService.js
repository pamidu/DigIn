routerApp.service('tabularService',function($rootScope,$http,Digin_Engine_API,Digin_Domain,$diginengine,$diginurls){


    var thisService = this;
	this.setPagination = function(summaryData,widData){

			widData.userList.length =0;
			widData.pageingArr.length=0;
            var pageCount = summaryData.length/widData.tabularConfig.numOfRows;

            
            var numOfRows = parseInt(widData.tabularConfig.numOfRows);
            var uperBound = parseInt(widData.tabularConfig.numOfRows);
            var lowerBound = 0;

            for(var i = 0; i < Math.ceil(pageCount) ; i++){

                var pageEle = summaryData.slice(lowerBound,uperBound);

                var obj = {
                    "pageNum" : i,
                    "pageEle" : pageEle,
                    "pageLable" : lowerBound+1 +"-"+uperBound
                }

                widData.pageingArr.push(obj);
                uperBound = uperBound+numOfRows;
                lowerBound = lowerBound+ numOfRows;


            }

            widData.userList = widData.pageingArr[0].pageEle;
            widData.selectedPage = widData.pageingArr[0].pageLable;
            widData.currentPage=0;


	}

	this.tabularNavigate =function (direction,widget,init){

        if(init == false){
            if(direction == "Next" && widget.widgetData.widData.currentPage+1 < widget.widgetData.widData.pageingArr.length){
                widget.widgetData.widData.currentPage++;
                widget.widgetData.widData.userList = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageEle;
                widget.widgetData.widData.selectedPage = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageLable;
            }else if(direction == "Next" && widget.widgetData.widData.currentPage+1 >= widget.widgetData.widData.pageingArr.length){
                thisService.getNextDataSet(widget);
            }

            if(direction == "Prev" && widget.widgetData.widData.currentPage > 0){
                widget.widgetData.widData.currentPage--;
                widget.widgetData.widData.userList = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageEle;
                widget.widgetData.widData.selectedPage = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageLable;
            }
        }
        else{
            widget.widgetData.widData.currentPage =0;
            widget.widgetData.widData.userList = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageEle;
            widget.widgetData.widData.selectedPage = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageLable;
        }
      

    }


    this.getNextDataSet = function(widget){

        var cl = $diginengine.getClient(widget.widgetData.commonSrc.src.src);
        var offset = widget.widgetData.widData.pageingArr.length * widget.widgetData.widData.tabularConfig.numOfRows;

        cl.getExecQuery(widget.widgetData.widData.query, widget.widgetData.commonSrc.src.id, function(data, status) {
            if(status){

                var pageCount = parseInt(widget.widgetData.widData.pageingArr.length) + data.length/widget.widgetData.widData.tabularConfig.numOfRows;

                var numOfRows = parseInt(widget.widgetData.widData.tabularConfig.numOfRows);
                var uperBound = parseInt(widget.widgetData.widData.tabularConfig.numOfRows);
                var lowerBound = 0;

                for(var i = widget.widgetData.widData.pageingArr.length; i < Math.ceil(pageCount) ; i++){

                    var pageEle = data.slice(lowerBound,uperBound);

                    var down = ((widget.widgetData.widData.pageingArr.length)*parseInt(widget.widgetData.widData.tabularConfig.numOfRows))+1 ;
                    var up = ( parseInt(widget.widgetData.widData.pageingArr.length)*parseInt(widget.widgetData.widData.tabularConfig.numOfRows))+parseInt(widget.widgetData.widData.tabularConfig.numOfRows);
                    var obj = {
                        "pageNum" : i,
                        "pageEle" : pageEle,
                        "pageLable" : down +"-"+ up
                    }

                    widget.widgetData.widData.pageingArr.push(obj);
                    uperBound = uperBound+numOfRows;
                    lowerBound = lowerBound+ numOfRows;

                }

                widget.widgetData.widData.currentPage++;
                widget.widgetData.widData.userList = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageEle;
                widget.widgetData.widData.selectedPage = widget.widgetData.widData.pageingArr[widget.widgetData.widData.currentPage].pageLable;

            }
        },100,offset);
    }

    this.getExecQueryFilterArr = function(widget,filterStr){


        var fieldArray = [];
        var FilterQuery = "";

        if(widget.widgetData.commonSrc.src.src == "BigQuery"){
            for(var i=0; i < widget.widgetData.widData.tabularConfig.AllingArr.length; i++){

                fieldArray.push(widget.widgetData.widData.tabularConfig.AllingArr[i].Attribute);
            }

        
            FilterQuery = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + widget.widgetData.commonSrc.src.tbl + " WHERE "+ filterStr +" ORDER BY "+widget.widgetData.widData.tabularConfig.defSortFeild+" "+widget.widgetData.widData.tabularConfig.AscOrDec;

        }
        else{
            for(var i=0; i < widget.widgetData.widData.tabularConfig.AllingArr.length; i++){

                fieldArray.push('['+widget.widgetData.widData.tabularConfig.AllingArr[i].Attribute+']');
            }

            var defSortFeild='['+$scope.widget.widgetData.widData.tabularConfig.defSortFeild+']';
            FilterQuery = "SELECT " + fieldArray.toString() + " FROM " +"["+ widget.widgetData.commonSrc.src.tbl.split(".")[0]+ "].["+widget.widgetData.commonSrc.src.tbl.split(".")[1] +"]" + " WHERE " + filterStr + " ORDER BY "+widget.widgetData.widData.tabularConfig.defSortFeild+" "+widget.widgetData.widData.tabularConfig.AscOrDec;
        }

       return FilterQuery;
    }


    this.executeQuery=function(executeColumns, widgetData,sourceData,sorting,OrderType,orderByColumnName,limit,cb){  

            var changeSort=false;
            if($rootScope.isChangeSort==true){
                changeSort= true;
            }


            var fieldArray = [];
            var fieldArrayMSSQL = [];

            var fieldArrayLength = executeColumns.length;
            var chartState = true;


                if(changeSort){
                    for (var i = 0; i < executeColumns.length; i++) {
                        fieldArray.push(executeColumns[i].Attribute);
                        fieldArrayMSSQL.push('['+executeColumns[i].Attribute+']');
                    }
                }
                else{
                    for (var i = 0; i < executeColumns.length; i++) {
                        fieldArray.push(executeColumns[i].filedName);
                        fieldArrayMSSQL.push('['+executeColumns[i].filedName+']');
                    }
                }
                

                var defSortFeild=executeColumns[0].filedName;

                var parameter;
                var i = 0;

                fieldArray.forEach(function(entry) {
                    if (i == 0) {
                        parameter = entry
                    } else {
                        parameter += "," + entry;
                    }
                    i++;
                });


                if(sourceData=='' || sourceData==undefined){
                    sourceData=$rootScope.dataSource;
                }

                var db = sourceData.src;

                if(sorting==undefined || sorting==''){
                    sorting=false;
                }

                if(!sorting){
                    if (db == "BigQuery") {
                        var query = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + sourceData.tbl + " ORDER BY "+defSortFeild+" "+widgetData.widData.tabularConfig.AscOrDec;
                    } else {
                        var defSortFeild='['+defSortFeild+']';
                        var query = "SELECT " + fieldArrayMSSQL.toString() + " FROM " +"["+ sourceData.tbl.split(".")[0]+ "].["+sourceData.tbl.split(".")[1] +"]"+ " ORDER BY "+defSortFeild+" "+widgetData.widData.tabularConfig.AscOrDec;
                    }
                }
                else{
                    if (db == "BigQuery") {
                        var query = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + sourceData.tbl + " ORDER BY "+orderByColumnName+" "+OrderType;
                    } else {
                        var orderByColumnName='['+orderByColumnName+']';
                        var query = "SELECT " + fieldArrayMSSQL.toString() + " FROM " + "["+ sourceData.tbl.split(".")[0] +"].["+ sourceData.tbl.split(".")[1] + "]" +" ORDER BY "+orderByColumnName+" "+OrderType;
                    }
                }


                var cl = $diginengine.getClient(sourceData.src);
                cl.getExecQuery(query, sourceData.id, function(data, status) {
                    //#to get aggregations
                    if(widgetData.widData.tabularConfig.totForNumeric == "true" ){

                        if(widgetData.widData.tabularConfig.AllingArr.length > 0){

                            var fieldArr=[];
                            for(var i=0; i < widgetData.widData.tabularConfig.AllingArr.length; i++ ){

                                if(widgetData.widData.tabularConfig.AllingArr[i].isString == false){
                                    var obj = {
                                        "agg": widgetData.widData.tabularConfig.AllingArr[i].Aggregation,
                                        "field": widgetData.widData.tabularConfig.AllingArr[i].Attribute
                                    };

                                    fieldArr.push(obj);
                                }
                                    

                            }

                            if(fieldArr.length>0){
                                 cl.getAggData(sourceData.tbl, fieldArr, limit, sourceData.id, function(res, status, Aggquery) {
                                       if(status == true){
                                         
                                          for(var i = 0; i < fieldArr.length ; i++)  {
                                                var str = fieldArr[i].agg+"_"+fieldArr[i].field;
                                                var obj = {
                                                    field : fieldArr[i].field,
                                                    aggName: fieldArr[i].agg+"_"+fieldArr[i].field,
                                                    value : res[0][str] 
                                                }

                                                for(var j=0; j < widgetData.widData.tabularConfig.AllingArr.length; j++){

                                                    if(widgetData.widData.tabularConfig.AllingArr[j].Attribute == fieldArr[i].field){

                                                        widgetData.widData.tabularConfig.AllingArr[j].Aggregation_value = Math.round(res[0][str] * 100) / 100  ;

                                                    }
                                                }
                                          
                                          }

                                        widgetData.widData.Aggquery =Aggquery;
                                        $rootScope.summaryData = data;
                                        widgetData.widData.tabularService.setPagination($rootScope.summaryData,widgetData.widData);
                                        cb(query);

                                       }
                                },undefined,undefined);
                            }
                            else{
                                $rootScope.summaryData = data;
                                widgetData.widData.tabularService.setPagination($rootScope.summaryData,widgetData.widData);
                                cb(query);
                            }
                        }
                    }
                    else{
                                    $rootScope.summaryData = data;
                                    widgetData.widData.tabularService.setPagination($rootScope.summaryData,widgetData.widData);
                                    cb(query);
                    } 

        
                },  limit);

    }

    this.changeSort=function(name,widget){
        //alert("change Sort....");

        $rootScope.isChangeSort=true;

        if($rootScope.sort==name.Attribute){
          $rootScope.sort='-'+name.Attribute;
          $rootScope.orderByColumnName=name.Attribute;
          $rootScope.OrderType='DESC';
          $rootScope.sorting=true;
        }else if($rootScope.sort=='-'+name.Attribute){
          $rootScope.sort='';
          $rootScope.sorting=false;
        }else{
          $rootScope.sort=name.Attribute;
          $rootScope.orderByColumnName=name.Attribute;
          $rootScope.OrderType='ASC';
          $rootScope.sorting=true;
        }

        var sourceData;
        if(widget.widgetData.commonSrc=='' || widget.widgetData.commonSrc==undefined){
            sourceData=$rootScope.dataSource;
        }
        else{
            sourceData=widget.widgetData.commonSrc.src;
        }
        
        this.executeQuery(widget.widgetData.widData.tabularConfig.AllingArr, widget.widgetData,sourceData,
            $rootScope.sorting,$rootScope.OrderType,name.Attribute,100, function(query){
            var query=query;
            //$scope.eventHndler.isLoadingChart = false;
            //$scope.dataToBeBind.receivedQuery = query;
            //$scope.widget.widgetData.widData.query = query;
        });

    }


});


