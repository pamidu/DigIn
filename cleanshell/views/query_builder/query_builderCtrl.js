DiginApp.controller('query_builderCtrl',[ '$scope','$rootScope','$mdSidenav','$mdDialog', '$stateParams','$diginengine','dbType','$compile','$element','DiginServices','generateHighchart', 'generateGoogleMap','generateForecast','$timeout','NgMap','notifications','$mdMedia', function ($scope,$rootScope,$mdSidenav,$mdDialog, $stateParams, $diginengine, dbType,$compile,$element,DiginServices,generateHighchart,generateGoogleMap,generateForecast,$timeout,NgMap,notifications,$mdMedia){
	$scope.$parent.currentView = "Chart Designer";

	var newElement = "";
	
	
	//Get the state parameters passed from visualize data view
	$scope.selectedAttributes = $stateParams.allAttributes;
	$scope.selectedMeasures = $stateParams.allMeasures;
	$scope.selectedFile = $stateParams.selectedFile;
	$scope.selectedDB = $stateParams.selectedDB;
	
	//The variables that contain the series and category data
	$scope.selectedSeries = $stateParams.selectedMeasures;
	$scope.selectedCategory = $stateParams.selectedAttributes;
	
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
		
		//first get all chart types beofre cheking the widget config
		checkWigetConfig();
		
	});

	//add to selectedSeries
	$scope.pushSeries = function(item, aggregation)
	{
		var pushObj = angular.copy(item);
		pushObj.aggType = aggregation;
		
		$scope.selectedSeries.push(pushObj);
		if($scope.selectedCategory.length > 0)
		{
			addGenerateBtnAnimation()
		}
	}
	
	//add to selectedCategory
	$scope.pushCateory = function(index, item)
	{
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
	
	//remove to selectedSeries
	$scope.removeFromSeries = function(index)
	{
		$scope.selectedSeries.splice(index, 1);
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
			generateForecast.getforecastAtts($scope.selectedAttributes, $scope.selectedMeasures,$scope.settingConfig);

			/*if(!angular.equals($scope.widgetConfig, {}))
			{
				$scope.showPlaceholderIcon = false;
				generateForecast.reRender($scope.chartType.chart, $scope.widgetConfig,function (data){
					console.log(data);
				})
			}*/
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

			$scope.widgetCol = $stateParams.widget.col;
			$scope.widgetRow = $stateParams.widget.row;
			$scope.widgetSizeX = $stateParams.widget.sizeX;
			$scope.widgetSizeY = $stateParams.widget.sizeY;

			$scope.settingConfig.widgetName = $scope.chartType.name;

			if($scope.chartType.chartType == "highCharts")
			{
				$scope.showPlaceholderIcon = false;
				newElement = $compile('<digin-high-chart id="{{001}}" config="widgetConfig" ></digin-high-chart>')($scope);
				$element.find('.currentChart').append(newElement);
				
			}
			else if($scope.chartType.chartType == "forecast")
			{
				$scope.showPlaceholderIcon = false;
				newElement = $compile('<digin-forecast  config="widgetConfig" ></digin-forecast>')($scope);
				$element.find('.currentChart').append(newElement);
				
			}else if($scope.chartType.chartType == "map")
			{
				$scope.showPlaceholderIcon = false;
				newElement = $compile('<google-map-in-settings config="widgetConfig" ></google-map-in-settings>')($scope);
				$element.find('.currentChart').append(newElement);
				NgMap.getMap().then(function(map) {
					var center = map.getCenter();
					google.maps.event.trigger(map, "resize");
					map.setCenter(center);
				});
				
			}else{
				$scope.showPlaceholderIcon = true;
			}
		}else{
			$scope.chartType = $scope.chartTypes[0]; // set default chart
			
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

				var isChartConditionsOk = generateHighchart.highchartValidations($scope.chartType.chart,$scope.selectedSeries,$scope.selectedCategory);
				if(isChartConditionsOk){

					var isDrilled = false;
					if($scope.selectedCategory.length > 1){
						isDrilled = true;
					} 

					generateHighchart.generate($scope.widgetConfig, $scope.chartType.chart, $scope.selectedFile.datasource_name, $scope.selectedSeries,$scope.selectedCategory, $scope.limit, $scope.selectedFile.datasource_id,$scope.selectedDB,isDrilled,$scope.groupBySortArray ,function (data,query){
						$scope.widgetConfig = data;
						$scope.chartQuery = query;
						bindChart();
					},undefined,$scope.selectedAttributes,reArangeArr);

				}else{
					$scope.showChartLoading = false;
				}
				//$scope.currentChartType = "highCharts";
			}else if($scope.chartType.chartType == 'map')
			{
			    
				    var isChartConditionsOk = generateGoogleMap.mapValidations($scope.settingConfig);
					if(isChartConditionsOk){
						$scope.showChartLoading = false;
						$scope.showPlaceholderIcon = false;
						newElement = $compile('<google-map-in-settings></google-map-in-settings>')($scope);
						$element.find('.currentChart').append(newElement);
					}else{
						$scope.showChartLoading = false;
						$scope.showPlaceholderIcon = true;
					}
			}
			else if($scope.chartType.chartType == 'forecast')
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
	$scope.openSettings = function()
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
	  	$rootScope.$broadcast('press-submit', {callbackFunction: function(data){
		   if(data)
		   {
		    	$scope.settingsOpened = !$scope.settingsOpened;
		   }else{
		    	notifications.toast(0,"form invalid");
		   }
	  	}});
	}

	//Initiaize the edit Query as off
	$scope.queryEditState = false;
	
	//Toggle the query edit state
	$scope.changeEditState = function() {
		$scope.queryEditState = !$scope.queryEditState;
	};
	
	$scope.saveWidget =  function() {
		
		var widgetData = {
			'chartType' : $scope.chartType,
			'selectedFile' : $scope.selectedFile,
			'Measures' : $scope.selectedSeries,
			'XAxis': $scope.selectedCategory,
			'allMeasures' : $scope.selectedMeasures,
			'allXAxis' : $scope.selectedAttributes,
			'DesignTimeFilter': [],
			'RuntimeFilter' : [],
			'widgetConfig' : $scope.widgetConfig,
			'settingConfig': $scope.settingConfig,
			'selectedDB' : $scope.selectedDB,
			'widgetID' :  widgetID,
			'query' : $scope.chartQuery,
			'groupBySortArray': $scope.groupBySortArray			

			
		};

		var widget = {
			'widgetID' : widgetID ,
			'widgetName' : $scope.settingConfig.widgetName,
			'widgetData' : widgetData,
			'col': $scope.widgetCol,
			'row': $scope.widgetRow,
			'sizeX': $scope.widgetSizeX,
			'sizeY': $scope.widgetSizeY

			
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