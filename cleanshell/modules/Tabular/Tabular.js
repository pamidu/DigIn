/*!
* Tabular: v0.0.1
* Authour: Gevindu
*/

'use strict';

var TabularModule = angular.module('Tabular',['DiginServiceLibrary']);


TabularModule.directive('tabular',['$rootScope','notifications','generateTabular','tabularService', function($rootScope,notifications,generateTabular,tabularService) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Tabular/tabular.html',
         scope: {
           config: '=',
           tabularSettings: '=',
           idSelector: '@'
          },
         link: function(scope,element){
         	scope.tabularService = tabularService;
         	console.log(scope.tabularSettings);
			
			scope.$on('widget-resized', function(element, widget) {
				var height = widget.element[0].clientHeight - 50;
				var whatIfId = widget.element[0].children[2].children[0].getAttribute('id-selector');
				angular.element('#'+whatIfId).css('height',height+'px');
				//.noUi-connect
			});
         } //end of link
    };
}]);

TabularModule.directive('tabularSettings',['$rootScope','notifications','generateTabular', function($rootScope,notifications,generateTabular) {
	return {
         restrict: 'E',
         templateUrl: 'modules/Tabular/tabularSettings.html',
         scope: {
			tabularSettings: '=',
			attr:'=',
			select:'=',
			submitForm: '&'
          },
         link: function(scope,element){

         	//create tabular 
         	scope.allingments = ["left","right"];
			scope.aggregationArr = ["sum","avg","count","min","max"];

         	var keys = Object.keys(scope.tabularSettings);
            var len = keys.length;

            if(len !=1 ){

            }
            else
            {
				scope.allingArr = [];

                scope.tabularSettings.totForNumeric = "true";
                scope.tabularSettings.defSortFeild = "";
                scope.tabularSettings.AscOrDec = "ASC";
                scope.tabularSettings.AllingArr = [];
                scope.tabularSettings.numOfRows = 10;
			 
			}
		    scope.$watch("select", function(newValue, oldValue) {
		        if (newValue !== oldValue) {
		        	scope.tabularSettings.AllingArr = [];
		         	for(var i = 0 ; i < scope.select.length; i ++){
				    	 var Alignment = "left";
		                 var isString = true;
		                 var att = scope.select[i];
		                 if(att.type == "INTEGER" || att.type == "FLOAT" ||
		                    att.type.toUpperCase() == "TINYINT"  || att.type.toUpperCase() == "SMALLINT" ||
		                    att.type.toUpperCase() == "INT" || att.type.toUpperCase() == "BIGINT" ||
		                    att.type.toUpperCase() == "NUMERIC" || att.type.toUpperCase() == "DECIMAL" ||
		                    att.type.toUpperCase() == "FLOAT" || att.type.toUpperCase() == "REAL" ||
		                    att.type.toUpperCase() == "SMALLMONEY" || att.type.toUpperCase() == "MONEY")
			                {
			                    Alignment = "right";
			                    isString = false;
			                }

			               var colObj = {
		                    "Attribute": att.name,
		                    "DislayName": att.name,
		                    "Alignment": Alignment,
		                    "isString" : isString,
		                    "Aggregation":"sum",
		                    "Aggregation_value":0

		                };
		                scope.tabularSettings.AllingArr.push(colObj);
				    }
		        }

		    }, true);

			console.log(scope.tabularSettings);
			
			scope.submit = function()
			{
				if(scope.tabularSettingsForm.$valid)
				{
					console.log(scope.tabularSettings);
					scope.submitForm();
				}else{
					console.log("invalid");
				}
			}
			
			scope.restoreSettings = function()
			{
				scope.submitForm();
			}
         } //end of link
    };
}]);

TabularModule.factory('generateTabular', ['$rootScope','notifications','tabularService', function($rootScope,notifications,tabularService) {
    

    return {
		doSomething : function(param) {
			return true;
        },
        tabularValidations: function(settings){
			var isChartConditionsOk = false;

			// if(settings.actual && settings.target)
			// {
			// 	isChartConditionsOk = true;
			// }else{
			// 	notifications.toast(2,"Please select actual and target values");
			// }

			return true;
		
		},
		generate: function(db , dataSource , tabulrSettings ,designFilterString, runtimefilterString, cb){

			var config = {
				'Aggquery' : "",
				'currentPage' : 0,
				'pageingArr' : [],
				'query' : [], 
				'selectedPage': "",
				'sort':"",
				'isSort':false,
				"userList":[],
				"isNext": false,
				"oderByclumn":"",
				'OrderType': "",
				"dbType":db,
				"dataSource":dataSource,
				"runtimefilterString" :runtimefilterString,
				"query":"",
				"aggQuerry":"",
				"isloading":false,
                "designFilterString":designFilterString,
                "runtimeQuery" : ""
			};

			tabularService.executeQuery(db , dataSource ,  tabulrSettings , config , function(tabulConfig){
                
				cb(tabulConfig);
            });
		},
        applyRunTimeFilters: function(widget,designFilterString, runtimefilterString, cb){
            widget.widgetData.widgetConfig.runtimefilterString= runtimefilterString;
            widget.widgetData.widgetConfig.designFilterString = designFilterString;

            tabularService.executeQuery(widget.widgetData.selectedDB , widget.widgetData.selectedFile ,  widget.widgetData.settingConfig , widget.widgetData.widgetConfig , function(tabulConfig){
                cb(tabulConfig);
            });

        }

	}
}]);//END OF generateTabular

TabularModule.run(['cellEditorFactory',function(cellEditorFactory) {
// create cell editor
  cellEditorFactory['boolean'] = {
    // cell key event handler
    cellKey:function(event, options, td, cellCursor){
      if(event.type=='keydown'){
        switch(event.which){
        case 13:
        case 32:
          event.stopPropagation();
          options.setValue(!options.getValue());
          return true;
        }
      }
    },
    // editor open handler
    open:function(options, td, finish, cellEditor){
      options.setValue(!options.getValue());
      finish();
	}
  }
}]);

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
                    "pageLable" : lowerBound+1 +" - "+uperBound
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
        if(config.runtimefilterString == ""){
            query = config.query;
        }else{
            query = config.runtimeQuery;
        }

        var datasource_id = config.dataSource.datasource_id
     

        cl.getExecQuery(query, datasource_id, function(data, status) {
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
                        "pageLable" : down +" - "+ up
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


    this.executeQuery=function(db, sourceData , tabulrSettings , config, cb){  

           
            var fieldArray = [];
            var fieldArrayMSSQL = [];


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
                        dataSourceID = sourceData.datasource_id;

                        //check its has runtime filters
                        if(config.runtimefilterString == ""){
                            //check wether it has designtime filters
                            if(config.designFilterString == "")
                                var query = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + sourceData.datasource_name + " ORDER BY "+tabulrSettings.defSortFeild+" "+tabulrSettings.AscOrDec;
                            else
                                var query = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + sourceData.datasource_name + " WHERE "+ config.designFilterString +" ORDER BY "+tabulrSettings.defSortFeild+" "+tabulrSettings.AscOrDec;
                        }
                        else{
                            var query = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + sourceData.datasource_name + " WHERE "+ config.runtimefilterString +" ORDER BY "+tabulrSettings.defSortFeild+" "+tabulrSettings.AscOrDec;
                        }
                    } else {
                           
                    	   dataSourceID = sourceData.datasource_id;
                           if(config.runtimefilterString == ""){
                              var defSortFeild='['+tabulrSettings.defSortFeild+']';
                              if(config.designFilterString == ""){
                                 var query = "SELECT " + fieldArrayMSSQL.toString() + " FROM " +"["+ sourceData.datasource_name.split(".")[0]+ "].["+sourceData.datasource_name.split(".")[1] +"]"+ " ORDER BY "+"[" +tabulrSettings.defSortFeild+"]"+" "+tabulrSettings.AscOrDec;
                              }
                              else
                                 var query = "SELECT " + fieldArrayMSSQL.toString() + " FROM " +"["+ sourceData.datasource_name.split(".")[0]+ "].["+sourceData.datasource_name.split(".")[1] +"]"+ " WHERE " + config.designFilterString +" ORDER BY "+"[" +tabulrSettings.defSortFeild+"]"+" "+tabulrSettings.AscOrDec;
                            }
                            else{
                                var query = "SELECT " + fieldArrayMSSQL.toString() + " FROM " +"["+ sourceData.datasource_name.split(".")[0]+ "].["+sourceData.datasource_name.split(".")[1] +"]"+ " WHERE " + config.runtimefilterString +" ORDER BY "+"[" +tabulrSettings.defSortFeild+"]"+" "+tabulrSettings.AscOrDec;
                            }
                    }
                }
                else{
                    if (db == "BigQuery" || db == "memsql") {

                    	dataSourceID = sourceData.datasource_id;
                        if(config.runtimefilterString == ""){
                            if(config.designFilterString == "")
                                var query = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + sourceData.datasource_name + " ORDER BY "+config.oderByclumn+" "+config.OrderType;
                            else
                                var query = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + sourceData.datasource_name + " WHERE "+ config.designFilterString +" ORDER BY "+config.oderByclumn+" "+config.OrderType;
                        }
                        else{
                            var query = "SELECT " + fieldArray.toString() + " FROM " + $diginurls.getNamespace() + "." + sourceData.datasource_name + " WHERE "+ config.runtimefilterString +" ORDER BY "+config.oderByclumn+" "+config.OrderType;
                        }
                    } else {
                       
                        dataSourceID = sourceData.datasource_id;
                        if(config.runtimefilterString == ""){
                             var orderByColumnName='['+config.oderByclumn+']';
                             if(config.designFilterString == "")
                                var query = "SELECT " + fieldArrayMSSQL.toString() + " FROM " + "["+ sourceData.datasource_name.split(".")[0] +"].["+ sourceData.datasource_name.split(".")[1] + "]" +" ORDER BY "+orderByColumnName+" "+config.OrderType;
                             else
                                var query = "SELECT " + fieldArrayMSSQL.toString() + " FROM " + "["+ sourceData.datasource_name.split(".")[0] +"].["+ sourceData.datasource_name.split(".")[1] + "]" +" WHERE " + config.designFilterString +" ORDER BY "+orderByColumnName+" "+config.OrderType;   
                            
                        }
                        else{
                             var orderByColumnName='['+config.oderByclumn+']';
                            var query = "SELECT " + fieldArrayMSSQL.toString() + " FROM " + "["+ sourceData.datasource_name.split(".")[0] +"].["+ sourceData.datasource_name.split(".")[1] + "]" +" WHERE " + config.runtimefilterString +" ORDER BY "+orderByColumnName+" "+config.OrderType;   
                        }
                    }
                }


                var filterParam = config.designFilterString;

                if(config.runtimefilterString != "")
                   filterParam = config.runtimefilterString;




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

                                        if (config.runtimefilterString == ""){
                                            config.aggQuerry  =Aggquery;
                                            config.query  =query;
                                        }
                                        else
                                             config.runtimeQuery = query;
                                        thisService.setPagination(data,config,tabulrSettings,cb);

                                       }

                                },undefined,filterParam);
                            }
                            else{

                                if (config.runtimefilterString == "")
                                    config.query  = query;
                                else
                                    config.runtimeQuery = query;

                                thisService.setPagination(data,config,tabulrSettings,cb);
                                
                            }
                        }
                    }
                    else{
                        if (config.runtimefilterString == "")           
                            config.query  =query;
                        else
                            config.runtimeQuery = query;
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

        
        this.executeQuery(config.dbType, config.dataSource,tabularSettings,config,  function(query){

             config.isloading = false;
            // var query=query;
            // widget.widgetData.syncState = true;
            //$scope.eventHndler.isLoadingChart = false;
            //$scope.dataToBeBind.receivedQuery = query;
            //$scope.widget.widgetData.widData.query = query;
        });

    }

}]);
