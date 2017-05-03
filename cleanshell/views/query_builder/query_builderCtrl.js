DiginApp.controller('query_builderCtrl',[ 
			 '$scope','$rootScope','$mdSidenav','$mdDialog','$stateParams','$diginengine','dbType','$compile','$element','DiginServices','generateHighchart','generateGoogleMap','generateForecast','generateMetric','generateTabular','generateWhatIf','generateBoxplot','generateBubble','generateHistogram','$timeout','NgMap','notifications','$mdMedia','filterServices', 
	function ($scope,  $rootScope,  $mdSidenav,  $mdDialog,  $stateParams,  $diginengine,  dbType,  $compile,  $element,  DiginServices,  generateHighchart,  generateGoogleMap,  generateForecast,  generateMetric,  generateTabular,  generateWhatIf,  generateBoxplot,  generateBubble,  generateHistogram,  $timeout,  NgMap,  notifications,  $mdMedia,  filterServices){
	
	$scope.$parent.currentView = "Chart Designer";
	var newElement = "";
	
	//Get the state parameters passed from visualize data view
	$scope.selectedAttributes = $stateParams.allAttributes;
	$scope.selectedMeasures = $stateParams.allMeasures;
	$scope.selectedFile = $stateParams.selectedFile;
	$scope.selectedDB = $stateParams.selectedDB;
	console.log($stateParams.chartType);
	
	//The variables that contain the series and category data
	$scope.selectedSeries = $stateParams.selectedMeasures;
	$scope.selectedCategory = $stateParams.selectedAttributes;

	$scope.selectedDesignTimeFilters = $stateParams.DesignTimeFilter;
	$scope.selectedRunTimeFilters = $stateParams.RuntimeFilter;

	
	$scope.aggregations = ["AVG","SUM","COUNT","MIN","MAX"];
	$scope.limit = 100;
	$scope.requestLimits = [100, 1000, 2000, 3000, 4000, 5000];
	$scope.showPlaceholderIcon = true;


	//Array that will contain all chart types
	$scope.chartTypes = [];

	//Common variable to store the widget contents
	
	$scope.widgetConfig = $stateParams.widget.widgetData.widgetConfig;

	$scope.widgetCol = null;
	$scope.widgetRow = null;
	$scope.widgetSizeX = 4;
	$scope.widgetSizeY = 11;

	$scope.settingConfig = {};
	$scope.notification_data = [];

	//$scope.currentChartType = "";
	$scope.showChartLoading = false;

	//variable to hold query of highcharts
	$scope.chartQuery = "";
	
	//Create widgetId;
	var widgetID ="";

	//to keep the group by column and sort by column
	$scope.groupBySortArray =[];

	DiginServices.getChartTypes().then(function(data) {
		$scope.chartTypes = data;
		
		//first get all chart types before checking the widget config
		checkWigetConfig();
		
	});

	//#get only date attributes out of selectedAttributes
	$scope.getOnlyDateAttributes = function()
	{
		$scope.dateAttributes=[];
			angular.forEach($stateParams.allAttributes, function(value, key) {
				if(value.type.toUpperCase()=='TIMESTAMP' || value.type.toUpperCase()=='DATETIME' || value.type.toUpperCase()=='DATE' )
			  		$scope.dateAttributes.push(value);
			}, '');
	}

//add to selectedSeries
 $scope.pushSeries = function(item, aggregation)
 {
  	//check weather series is also added
  	var isFoundCnd = false;
    for (i in $scope.selectedSeries) {
        if ($scope.selectedSeries[i].name == item.name && $scope.selectedSeries[i].aggType == aggregation) {
                isFoundCnd = true;
    			notifications.toast(2,'duplicate record found ..');
                return;
        }
            isFoundCnd = false;
    }

    if(!isFoundCnd){
         var pushObj = angular.copy(item);
   		pushObj.aggType = aggregation;
   
   		$scope.selectedSeries.push(pushObj);


   		var obj = {
    		"disName":item.name,
    		"name": item.name,
    		"color": "#7cb5ec"
   		};

   		if(typeof $scope.settingConfig.seriescolourArr == "undefined"){
    		$scope.settingConfig["seriescolourArr"] = [];
   		}
   		$scope.settingConfig.seriescolourArr.push(obj);

   		if($scope.selectedCategory.length > 0)
   		{
    		addGenerateBtnAnimation()
   		}
    } 
 }

	$scope.toggleSeries = function(ev, series, seriesList) {
		ev.preventDefault();

		if(seriesList == undefined || series == undefined)
			return

		var idx = seriesList.findIndex(function(sr) {
			return sr.name === series.name
		});

		if(idx > -1) seriesList.splice(idx, 1);
		else seriesList.push(series); 
		
		$scope.settingConfig.seriesList = angular.copy(seriesList)

		console.log(seriesList);

	}

	$scope.isSeriesToggled = function(series, seriesList) {

		if(seriesList.length === 0)
			return false;

		var idx = seriesList.findIndex(function(sr) {
			return sr.name === series.name
		});

		return idx > -1 ? true : false
	}
	
//add to selectedCategory
 $scope.pushCateory = function(index, item)
 {   
  var isFoundCnd = false;
    for (i in $scope.selectedCategory) {
        if ($scope.selectedCategory[i].name == item.name) {
            isFoundCnd = true;
            //alert('duplicate record found in object...');
            notifications.toast(2,'duplicate record found ..');
            $scope.isPendingRequest = false;
            return;
        }
        isFoundCnd = false;
    }

    if(!isFoundCnd){
     	$scope.selectedCategory.push(item);

				//push selected category to groupBySortArray
			var obj = {
        	"sortName": item.name,
        	"displayName" : item.name
    	}

     		$scope.groupBySortArray.push(obj);

	  	if($scope.selectedSeries.length > 0)
	   	{
	    		addGenerateBtnAnimation()
	  	}
    }
 }
	
	//remove to selectedSeries
	$scope.removeFromSeries = function(index)
	{
		$scope.selectedSeries.splice(index, 1);
		$scope.settingConfig.seriescolourArr.splice(index, 1);
	}
	
	//remove to selectedCategory
	$scope.removeFromCategory = function(index)
	{
		$scope.selectedCategory.splice(index, 1);
		$scope.groupBySortArray.splice(index, 1);

	}

	//used only to define one variable from the selector-section (Eg: used to set longitute/ latitude info)
	$scope.defineVariable = function(index, variableName, value)
	{
		$scope.settingConfig[variableName] = value;
	}
	
	//remove a key/value pair from the settingConfig
	$scope.removeVariable = function(index, variableName)
	{
		delete $scope.settingConfig[variableName];
	}

	 //used only to define a array and push
	 $scope.addArrayElement = function(index, variableName, value, aggregation)
	 {
	  var pushObj = {name:value.name, aggType: aggregation};
	  
	  if($scope.settingConfig[variableName]){
	   $scope.settingConfig[variableName].push(pushObj);
	  }else{
	   $scope.settingConfig[variableName] = [];
	   $scope.settingConfig[variableName].push(pushObj);
	  }
	 }
	 
	 //remove from created array
	 $scope.removeArrayElement = function(index, variableName)
	 {
	  $scope.settingConfig[variableName].splice(index,1);
	 }
	
	function addGenerateBtnAnimation()
	{
		angular.element('#generateBtn').addClass("callToAction");
		$timeout(function(){
			angular.element('#generateBtn').removeClass("callToAction");
		}, 3000);
	}
	
	
	
	//change chart type - default is bar chart(from Highcharts)
	$scope.changeChartType = function(index)
	{

		//$scope.settingConfig = {}; //empty the previous settings
		$scope.chartType = $scope.chartTypes[index];

		if(angular.equals($scope.widgetConfig.widgetName, undefined))//if there is no config
		{
			$scope.settingConfig.widgetName = $scope.chartType.name;
		}

		//reRender a high-chart if the type is changed to another chart in highcharts given that a highchart was generated before
		if($scope.chartType.chartType == "highCharts")
		{
			if(!angular.equals($scope.widgetConfig, {}))
			{
				$scope.showPlaceholderIcon = false;
				generateHighchart.reRender($scope.chartType.chart, $scope.widgetConfig,function (data){
					console.log(data);
				})
			}
		}
		else if($scope.chartType.chartType == "forecast")
		{
			//generateForecast.getforecastAtts($scope.selectedAttributes, $scope.selectedMeasures,$scope.settingConfig);

			/*if(!angular.equals($scope.widgetConfig, {}))
			{
				$scope.showPlaceholderIcon = false;
				generateForecast.reRender($scope.chartType.chart, $scope.widgetConfig,function (data){
					console.log(data);
				})
			}*/

			/*
			var allAttributes=$scope.selectedAttributes;
			$scope.selectedAttributes=[];
			var log = [];
			angular.forEach(allAttributes, function(value, key) {
				if(value.type=='TIMESTAMP' || value.type=='DATETIME' || value.type=='DATE' )
			  		$scope.selectedAttributes.push(value);
			}, log);
			*/		

		}else if($scope.chartType.chartType == "whatif")
		{		
			$scope.settingsOpened = true;
		}
		else if($scope.chartType.chartType == "metric")
		{
			$scope.settingsOpened = true;
			if($scope.dateAttributes==undefined || $scope.dateAttributes==""){
				$scope.getOnlyDateAttributes();
			}
		}
		else{
			$scope.showPlaceholderIcon = true;
		}
		
	}
	
	//common function to check wether widget config exsits 
	function checkWigetConfig()
	{
		//reRender a high-chart if the type is changed to another chart in highcharts given that a highchart was generated before
		
		if(!angular.equals($scope.widgetConfig, {}))//if there is a config
		{
			$scope.chartType = $stateParams.chartType;
			widgetID = $stateParams.widget.widgetID;
			$scope.groupBySortArray = $stateParams.widget.widgetData.groupBySortArray;
			$scope.drilledConfig = $stateParams.widget.widgetData.drilledConf;

			$scope.widgetCol = $stateParams.widget.col;
			$scope.widgetRow = $stateParams.widget.row;
			$scope.widgetSizeX = $stateParams.widget.sizeX;
			$scope.widgetSizeY = $stateParams.widget.sizeY;
			$scope.settingConfig = $stateParams.widget.widgetData.settingConfig;
			$scope.chartQuery = $stateParams.widget.widgetData.query;

			if($scope.settingConfig.widgetName==undefined || 	$scope.settingConfig.widgetName=="")
			{
				$scope.settingConfig.widgetName = $scope.chartType.name;
			}
			
			if($scope.chartType.chartType == "highCharts")
			{
				$scope.showPlaceholderIcon = false;
				newElement = $compile('<digin-high-chart id="{{001}}" config="widgetConfig" ></digin-high-chart>')($scope);
				$element.find('.currentChart').append(newElement);
				
			}
			else if($scope.chartType.chartType == "forecast")
			{
				$scope.showPlaceholderIcon = false;
				newElement = $compile('<digin-forecast config="widgetConfig" ></digin-forecast>')($scope);
				$element.find('.currentChart').append(newElement);
				
			}else if($scope.chartType.chartType == "map")
			{
				$scope.showPlaceholderIcon = false;
				
				//id-selector="'+widgetID+'" - There is a bug here, if an id is added when the map is in the dashboard again it will stop working
				newElement = $compile('<google-map config="widgetConfig" ></google-map>')($scope);
				$element.find('.currentChart').append(newElement);
				NgMap.getMap().then(function(map) {
					var center = map.getCenter();
					google.maps.event.trigger(map, "resize");
					map.setCenter(center);
				});
				
			}else if($scope.chartType.chartType == "whatif")
			{
				$scope.showPlaceholderIcon = false;
				
				//id-selector="'+widgetID+'" - There is a bug here, if an id is added when the map is in the dashboard again it will stop working
				newElement = $compile('<what-if config="widgetConfig" ></what-if>')($scope);
				$element.find('.currentChart').append(newElement);
			}else if($scope.chartType.chartType == "tabular"){
				$scope.showPlaceholderIcon = false;
				console.log($scope.settingConfig);
				newElement = $compile('<tabular config="widgetConfig" tabular-settings="settingConfig"></tabular>')($scope);

				$element.find('.currentChart').append(newElement);
			}else if($scope.chartType.chartType == "metric")
			{
				$scope.notification_data = $stateParams.widget.notification_data;
				$scope.showPlaceholderIcon = false;
				newElement = $compile('<metric id-selector="'+widgetID+'" config="widgetConfig" settings="settingConfig" notification="notification_data"></metric>')($scope);
				//newElement = $compile('<metric config="widgetConfig" settings="settingConfig" notification="notification_data"></metric>')($scope);
				$element.find('.currentChart').append(newElement);
			}
			else{
				$scope.showPlaceholderIcon = true;
			}
		}else{
			$scope.chartType = $scope.chartTypes[$stateParams.chartType]; // set default chart
			
			widgetID = "temp" + createuuid();
			
			$scope.settingConfig.widgetName = $scope.chartType.name;

			console.log($scope.settingConfig.widgetName );

			// initialize if the object is empty
			$scope.widgetConfig = generateHighchart.initializeChartObject($scope.chartType.chart);
			newElement = $compile('<digin-high-chart config="widgetConfig" ></digin-high-chart>')($scope);
			$element.find('.currentChart').append(newElement);
			
		}
	}

	// bind chart to the view
	function bindChart()
	{
		$scope.showChartLoading = false;
		$scope.showPlaceholderIcon = false;
		newElement = $compile('<digin-high-chart id-selector="'+widgetID+'" config="widgetConfig" ></digin-high-chart>')($scope);//'+widgetID+'
		$element.find('.currentChart').append(newElement);
	}
	
	//Generate Chart Event
	$scope.generate = function()
	{
		
			//If a chart is already rendered first remove it
			$element.find('.currentChart').children().remove();
			
			$scope.showChartLoading = true;
			if($scope.chartType.chartType == 'highCharts') // if the user wants a highchart
			{
				var connection_string = "";

				// if filters exist, apply
				if ($scope.selectedDesignTimeFilters.length > 0)
				{
					var groupFilters = filterServices.groupFilterConnectionString($scope.selectedDesignTimeFilters);
					connection_string = filterServices.generateFilterConnectionString(groupFilters,$scope.selectedDB);
				}

				var isChartConditionsOk = generateHighchart.highchartValidations($scope.chartType.chart,$scope.selectedSeries,$scope.selectedCategory);
				if(isChartConditionsOk){

					var isDrilled = false;
					if($scope.selectedCategory.length > 1){
						isDrilled = true;
					} 
					var isCreate = true; 
					generateHighchart.generate($scope.widgetConfig, $scope.chartType.chart, $scope.selectedFile, $scope.selectedSeries,$scope.selectedCategory, $scope.limit, $scope.selectedDB,isDrilled,$scope.groupBySortArray ,function (data,query,drilledConf){
							

						 // set the sries colour from settingsConfig
						  for(var i=0; i < data.series.length; i++){
						  	data.series[i].color = $scope.settingConfig.seriescolourArr[i].color
						  }
						$scope.widgetConfig = data;
						$scope.chartQuery = query;
						$scope.drilledConfig = drilledConf;
						bindChart();
					},connection_string,$scope.selectedAttributes,reArangeArr,isCreate);

				}else{
					$scope.showChartLoading = false;
				}
				//$scope.currentChartType = "highCharts";
			}else if($scope.chartType.chartType == 'forecast')
			{
				if(generateForecast.isRequestValidated($scope.selectedSeries, $scope.selectedCategory)){
					generateForecast.generate($scope.chartType.chart, $scope.selectedFile.datasource_name, $scope.selectedSeries,$scope.selectedCategory, 100, $scope.selectedFile.datasource_id,$scope.selectedDB,$scope.settingConfig,function (data,status){
						if(status){
							$scope.widgetConfig = data;
							$scope.showChartLoading = false;
							$scope.showPlaceholderIcon = false;
							newElement = $compile('<digin-forecast config="widgetConfig" ></digin-forecast>')($scope);
							$element.find('.currentChart').append(newElement);
						}
						else{
							$scope.showChartLoading = false;
							$scope.showPlaceholderIcon = false;
						}
						
					});
				}
				else{
					$scope.showChartLoading = false;
				}
			}else if($scope.chartType.chartType == 'map')
			{
				var isChartConditionsOk = generateGoogleMap.mapValidations($scope.settingConfig);
				if(isChartConditionsOk){
					
					generateGoogleMap.generate($scope.settingConfig, $scope.selectedDB, $scope.selectedFile.datasource_id, $scope.selectedSeries, function (data){
						$scope.showChartLoading = false;
						$scope.showPlaceholderIcon = false;
						$scope.widgetConfig = data;
						newElement = $compile('<google-map config="widgetConfig"></google-map>')($scope);
						$element.find('.currentChart').append(newElement);
					})

				}else{
					$scope.showChartLoading = false;
					$scope.showPlaceholderIcon = true;
				}
			}else if($scope.chartType.chartType == 'metric')
			{
				var isChartConditionsOk = generateMetric.metricValidations($scope.settingConfig);
				if(isChartConditionsOk){	

					var datasource_id;
			         if( $scope.selectedDB == "BigQuery" || $scope.selectedDB == "memsql"){
			          datasource_id = $scope.selectedFile.datasource_id
			         }else{
			          datasource_id = $scope.selectedFile.id;
			         }

							
					generateMetric.generate($scope.chartType.chart, $scope.selectedFile.datasource_name, 100, datasource_id,$scope.selectedDB,$scope.settingConfig,$scope.notification_data,function (status,metricObj,settings,notification){
						if(status){
							$scope.widgetConfig = metricObj;
							notification.page_id= $rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].pageID;
              				notification.dashboard_name=$rootScope.currentDashboard.compName;
              				notification.widget_id=widgetID;
              				$scope.notification_data=[];
							$scope.notification_data.push(notification);
							$scope.chartQuery = metricObj.trendQuery;
							$scope.showChartLoading = false;
							$scope.showPlaceholderIcon = false;
							newElement = $compile('<metric id-selector="'+widgetID+'" config="widgetConfig" settings="settingConfig" notification_data="notification_data"></metric>')($scope);
							$element.find('.currentChart').append(newElement);
						}
						else{
							$scope.showChartLoading = false;
							$scope.showPlaceholderIcon = false;
						}
						
					});
				}else{
					$scope.showChartLoading = false;
					$scope.showPlaceholderIcon = true;
				}
			}else if($scope.chartType.chartType == 'whatif')
			{
				var isValid = generateWhatIf.validate($scope.settingConfig);
				
				if(!isValid){
					$scope.showChartLoading = false;
					$scope.showPlaceholderIcon = true;
					return;
				}

				// make available selected measures to settingConfig.eqconfig object
				$scope.settingConfig.eqconfig['variables'] = angular.copy($scope.settingConfig.seriesList);
				
				generateWhatIf.generate({
					databaseType: $scope.selectedDB, 
					dataTable: $scope.selectedFile.datasource_name, 
					datasourceId: $scope.selectedFile.datasource_id
				}, $scope.settingConfig.eqconfig, function(variables, eq) {
					$scope.showChartLoading = false;
					$scope.showPlaceholderIcon = false;
					$scope.widgetConfig.variables = variables;
					$scope.widgetConfig.equation = eq;
					newElement = $compile('<what-if id-selector="'+widgetID+'" config="widgetConfig"></what-if>')($scope);
					$element.find('.currentChart').append(newElement);
				});
			}else if($scope.chartType.chartType == 'tabular')
			{
				var isChartConditionsOk = generateTabular.tabularValidations($scope.settingConfig);

				var connection_string = "";
			    // if filters exist, apply
			    if ($scope.selectedDesignTimeFilters.length > 0)
			    {
			     var groupFilters = filterServices.groupFilterConnectionString($scope.selectedDesignTimeFilters);
			     connection_string = filterServices.generateFilterConnectionString(groupFilters,$scope.selectedDB);
			    }


				if(isChartConditionsOk){
					generateTabular.generate($scope.selectedDB,$scope.selectedFile, $scope.settingConfig,connection_string,"", function (data){


					  $scope.widgetConfig = data;


					  $scope.showChartLoading = false;
					  $scope.showPlaceholderIcon = false;
					  newElement = $compile('<tabular id-selector="'+widgetID+'" config="widgetConfig" tabular-settings="settingConfig"></tabular>')($scope);
					  $element.find('.currentChart').append(newElement);

					 })
				}else{
					$scope.showChartLoading = false;
					$scope.showPlaceholderIcon = true;
				}
			}else if($scope.chartType.chartType == 'boxplot')
			{
				$scope.showChartLoading = false;
				$scope.showPlaceholderIcon = false;
				newElement = $compile('<boxplot id-selector="'+widgetID+'" config="widgetConfig" boxplot-settings="settingConfig"></boxplot>')($scope);
				$element.find('.currentChart').append(newElement);
			}else if($scope.chartType.chartType == 'bubble')
			{
				$scope.showChartLoading = false;
				$scope.showPlaceholderIcon = false;
				newElement = $compile('<bubble id-selector="'+widgetID+'" config="widgetConfig" bubble-settings="settingConfig"></bubble>')($scope);
				$element.find('.currentChart').append(newElement);
			}else if($scope.chartType.chartType == 'histogram')
			{
				$scope.showChartLoading = false;
				$scope.showPlaceholderIcon = false;
				newElement = $compile('<histogram id-selector="'+widgetID+'" config="widgetConfig" histogram-settings="settingConfig"></histogram>')($scope);
				$element.find('.currentChart').append(newElement);
			}
		
		
	}

	// execute query and build chart
	$scope.executeQuery = function()
	{
		//If a chart is already rendered first remove it
		$element.find('.currentChart').children().remove();

		generateHighchart.executeQuery($scope.widgetConfig, $scope.chartQuery, $scope.selectedFile.datasource_id, $scope.limit, 0, $scope.selectedDB, function(data){
			$scope.widgetConfig = data;
			bindChart();
		});
	}

	//adding this methode to recive and set the changed attributeArr and the groupbysortArr
	var reArangeArr = function(selectedCatArr,sortArr){

		$scope.selectedCategory =[];
		$scope.groupBySortArray =[];
		
		$scope.selectedCategory = selectedCatArr;
		$scope.groupBySortArray = sortArr;

	}


	//Change to tooltip of the hovered chart type
	$scope.changeTip = function(tip)
	{
		$scope.tooltip = tip;
	}
	
	//Initially the settings view of a chart should be turned off
	$scope.settingsOpened = false;
	
	//Toggle chart settings
	$scope.toggleSettings = function()
	{
		if($mdMedia('xs') == true || $mdMedia('sm') == true)
		{
			$mdSidenav('chart_desinger_settings').toggle();
		}else{
			$scope.settingsOpened = !$scope.settingsOpened;
		}

	}
	
	$scope.saveSettings = function()
	{
		$scope.settingsOpened = !$scope.settingsOpened;
	}

	//Initiaize the edit Query as off
	$scope.queryEditState = false;
	
	//Toggle the query edit state
	$scope.changeEditState = function() {
		$scope.queryEditState = !$scope.queryEditState;
	};


	// module by : Dilani Maheswaran

	// ---------------- filter related methods and variables start----------------

	//Variables that contain filter attributes
	
	$scope.designtimeFilters = angular.copy($scope.selectedAttributes); // deep copy as you need to load the values under the particular field

	//add to design time filter
	$scope.pushDesignTimeFilters = function(filterField,filterValue)
	{
		// if a field is slected, push it to the array
		if (filterValue.isSelected)
		{
			$scope.selectedDesignTimeFilters.push({
				name : filterField.name,
				fieldDataType: filterField.type,
				valueName: filterValue.valueName
			});
		} else 
		{
			// if a field is un- slected, remove it from the array
			$scope.selectedDesignTimeFilters.splice({filterName: filterField.name, fieldDataType: filterField.type, valueName: filterValue.valueName},1);
		}
	};

	//add to run time filters
	$scope.pushRunTimeFilters = function(item,type)
	{
		var pushObj = angular.copy(item);
		pushObj.selectionType = type;

		$scope.selectedRunTimeFilters.push(pushObj);
	};

	//remove selected design time filters
	$scope.removeDesignTimeFilters = function (index) {
		$scope.selectedDesignTimeFilters.splice(index,1);
	};

	//remove selected run time filters
	$scope.removeRunTimeFilters = function (index) {
		$scope.selectedRunTimeFilters.splice(index,1);
	};


	// load all the values under the selected field
	$scope.loadFilterParams = function(index) {
		if ($scope.designtimeFilters[index]['fieldvalues'] === undefined) $scope.designtimeFilters[index]['fieldvalues'] = [];
		if ($scope.designtimeFilters[index]['fieldvalues'].length == 0)
		{
			$scope.designtimeFilters[index]['isLoading'] = true;
			var is_dashboardFilter = false;
			filterServices.getFieldParameters($scope.designtimeFilters[index].name,$scope.selectedDB,$scope.selectedFile,function(data){
				$scope.$apply(function(){
					$scope.designtimeFilters[index]['isLoading'] = false;
					$scope.designtimeFilters[index]['fieldvalues'] = data;
				})
				// set the isSelected parameters of the selected fields
				if ($scope.selectedDesignTimeFilters.length != 0) {
					for (var i = 0; i < $scope.selectedDesignTimeFilters.length; i++) {
						if ( $scope.selectedDesignTimeFilters[i].name == $scope.designtimeFilters[index].name) {
							var idx = $scope.designtimeFilters[index]['fieldvalues'].findIndex(function(arg) {
								return arg.valueName == $scope.selectedDesignTimeFilters[i].valueName;
							});
							$scope.designtimeFilters[index].fieldvalues[idx].isSelected = true;
						}
					}
				}
			},100,0,is_dashboardFilter);
		}
	};

	// ---------- filter related methods end ---------------

	$scope.saveWidget =  function() {
		
		var widgetData = {
			'chartType' : $scope.chartType,
			'selectedFile' : $scope.selectedFile,
			'Measures' : $scope.selectedSeries,
			'XAxis': $scope.selectedCategory,
			'allMeasures' : $scope.selectedMeasures,
			'allXAxis' : $scope.selectedAttributes,
			'DesignTimeFilter': $scope.selectedDesignTimeFilters,
			'RuntimeFilter' : $scope.selectedRunTimeFilters,
			'widgetConfig' : $scope.widgetConfig,
			'settingConfig': $scope.settingConfig,
			'selectedDB' : $scope.selectedDB,
			'widgetID' :  widgetID,
			'query' : $scope.chartQuery,
			'groupBySortArray': $scope.groupBySortArray,
			'drilledConf' : $scope.drilledConfig 


			
		};

		var widget = {
			'widgetID' : widgetID ,
			'widgetName' : $scope.settingConfig.widgetName,
			'widgetData' : widgetData,
			'col': $scope.widgetCol,
			'row': $scope.widgetRow,
			'sizeX': $scope.widgetSizeX,
			'sizeY': $scope.widgetSizeY,
			'notification_data':$scope.notification_data

			
		};

		//if its a new widget add it as a new widget else replce 
			var widgets = $rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets;
			var objIndex = getRootObjectById(widgetID, widgets);
           

        if(typeof objIndex != 'undefined'){
        	 widgets[objIndex] = widget;
        }    
		else{
			$rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets.push(widget);
		}
		$scope.$parent.changed = true;
		$scope.$parent.route('dashboard');
	}
	
		
	//Introduction to Chart Designer
	$scope.ChartDesignerIntro = {
		steps:[
			{
				element: '#selectChartType',
				intro: 'Chose the chart type/widget you wish to create',
				position: 'left'
			}, {
				element: '#selectorSection',
				intro: 'Choose the attributes needed to create a chart/widget, every type will require you to add specific types of attributes',
				position: 'right'
			}, {
				element: '#generateBtn',
				intro: 'After selecting attributes click generate to fetch data and create your chart',
				position: 'top'
			}, {
				element: '#chartContainer',
				intro: 'The chart will be displayed here',
				position: 'bottom'
			}, {
				element: '#settingsBtn',
				intro: 'After generating the chart/widget you can change the default settings',
				position: 'left'
			}, {
				element: '#saveBtn',
				intro: 'Finally click save to add the created chart/widget in the dashboard',
				position: 'left'
			}
			],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong style="color:green">NEXT</strong>',
        prevLabel: '<span>Previous</span>',
        skipLabel: 'End Tour',
        doneLabel: '<strong style="color:green">Got it!!</strong>'
    };


}]);
