DiginApp.controller('query_builderCtrl',[ '$scope','$rootScope','$mdDialog', '$stateParams','$diginengine','dbType','$compile','$element','DiginServices','generateHighchart', 'generateGoogleMap','generateForecast','$timeout','NgMap', function ($scope,$rootScope,$mdDialog, $stateParams, $diginengine, dbType,$compile,$element,DiginServices,generateHighchart,generateGoogleMap,generateForecast,$timeout,NgMap){
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
	
	$scope.widgetConfig = $stateParams.widget.widgetConfig;
	$scope.settingConfig = {};
	//$scope.currentChartType = "";
	$scope.showBarChartLoading = false;
	
	//Create widgetId;
	var widgetID ="";
	
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
		$scope.chartType = $scope.chartTypes[index];
		
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
			if(!angular.equals($scope.widgetConfig, {}))
			{
				$scope.showPlaceholderIcon = false;
				generateForecast.reRender($scope.chartType.chart, $scope.widgetConfig,function (data){
					console.log(data);
				})
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
			if($scope.chartType.chartType == "highCharts")
			{
				$scope.showPlaceholderIcon = false;
				newElement = $compile('<digin-high-chart id="{{001}}" config="widgetConfig" ></digin-high-chart>')($scope);
				$element.find('.currentChart').append(newElement);
				
			}
			if($scope.chartType.chartType == "forecast")
			{
				$scope.showPlaceholderIcon = false;
				newElement = $compile('<digin-forecast  config="widgetConfig" ></digin-forecast>')($scope);
				$element.find('.currentChart').append(newElement);
				
			}if($scope.chartType.chartType == "map")
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
			$diginengine.getUUID(1, function(id){
				widgetID = id;
			});

			// initialize if the object is empty
			$scope.widgetConfig = generateHighchart.initializeChartObject($scope.chartType.chart);
			newElement = $compile('<digin-high-chart config="widgetConfig" ></digin-high-chart>')($scope);
			$element.find('.currentChart').append(newElement);
			
		}
	}
	
	//Generate Chart Event
	$scope.generate = function()
	{
		
			//If a chart is already rendered first remove it
			$element.find('.currentChart').children().remove();
			
			$scope.showBarChartLoading = true;
			if($scope.chartType.chartType == 'highCharts') // if the user wants a highchart
			{
			
				var isChartConditionsOk = generateHighchart.highchartValidations($scope.chartType.chart,$scope.selectedSeries,$scope.selectedCategory);
				if(isChartConditionsOk){
					generateHighchart.generate($scope.widgetConfig, $scope.chartType.chart, $scope.selectedFile.datasource_name, $scope.selectedSeries,$scope.selectedCategory, 100, $scope.selectedFile.datasource_id,$scope.selectedDB,function (data){
						$scope.widgetConfig = data;
						$scope.showBarChartLoading = false;
						$scope.showPlaceholderIcon = false;
						newElement = $compile('<digin-high-chart id-selector="'+widgetID+'" config="widgetConfig" ></digin-high-chart>')($scope);//'+widgetID+'
						$element.find('.currentChart').append(newElement);
						
					});
				}
				else{
					$scope.showBarChartLoading = false;
				}
				//$scope.currentChartType = "highCharts";
			}else if($scope.chartType.chartType == 'map')
			{
			    
				    $scope.widgetConfig = generateGoogleMap.generate(2);
				    $scope.showBarChartLoading = false;
				    $scope.showPlaceholderIcon = false;
				    newElement = $compile('<google-map-in-settings></google-map-in-settings>')($scope);
				    $element.find('.currentChart').append(newElement);
			}
			else if($scope.chartType.chartType == 'forecast')
			{
				generateForecast.generate($scope.chartType.chart, $scope.selectedFile.datasource_name, $scope.selectedSeries,$scope.selectedCategory, 100, $scope.selectedFile.datasource_id,$scope.selectedDB,$scope.settingConfig,function (data){
					$scope.widgetConfig = data;
					$scope.showBarChartLoading = false;
					$scope.showPlaceholderIcon = false;
					newElement = $compile('<digin-high-chart config="widgetConfig" ></digin-high-chart>')($scope);
					$element.find('.currentChart').append(newElement);
					
				});
			}
		
		
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
		$scope.settingsOpened = !$scope.settingsOpened;
	}
	
	//Initiaize the edit Query as off
	$scope.queryEditState = false;
	
	//Toggle the query edit state
	$scope.changeEditState = function() {
		$scope.queryEditState = !$scope.queryEditState;
	};
	
	$scope.saveWidget =  function() {
		
		var widget = {
			'chartType' : $scope.chartType,
			'selectedFile' : $scope.selectedFile,
			'Measures' : $scope.selectedSeries,
			'XAxis': $scope.selectedCategory,
			'allMeasures' : $scope.selectedMeasures,
			'allXAxis' : $scope.selectedAttributes,
			'DesignTimeFilter': [],
			'RuntimeFilter' : [],
			'widgetConfig' : $scope.widgetConfig,
			'selectedDB' : $scope.selectedDB,
			'widgetID' :  widgetID
			
		};

		$rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets.push(widget);

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


}])