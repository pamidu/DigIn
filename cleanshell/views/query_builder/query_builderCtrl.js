DiginApp.controller('query_builderCtrl',[ '$scope','$rootScope','$mdDialog', '$stateParams','$diginengine','dbType','$compile','$element','DiginServices','generateHighchart', 'generateHighMap','$timeout', function ($scope,$rootScope,$mdDialog, $stateParams, $diginengine, dbType,$compile,$element,DiginServices,generateHighchart,generateHighMap,$timeout){
	$scope.$parent.currentView = "Chart Designer";
	
	//Adjust window height accordingly otherwise the view will not become fullscreen
	$scope.viewPortHeight = "calc(100vh - 92px)";
	$scope.$parent.topMenuToggle2 = function()
	{
		if($rootScope.showHeader == true)
		{
			$scope.viewPortHeight = "calc(100vh - 92px)";
		}else{
			$scope.viewPortHeight = "calc(100vh - 46px)";
		}
	}

	var newElement = "";
	
	
	//Get the state parameters passed from visualize data view
	$scope.selectedAttributes = $stateParams.selectedAttributes;
	$scope.selectedMeasures = $stateParams.selectedMeasures;
	$scope.selectedFile = $stateParams.selectedFile;
	$scope.selectedDB = $stateParams.selectedDB;
	
	$scope.aggregations = ["AVG","SUM","COUNT","MIN","MAX"];
	$scope.limit = 100;
	$scope.requestLimits = [100, 1000, 2000, 3000, 4000, 5000];
	$scope.showPlaceholderIcon = true;

	
	//The variables that contain the series and category data
	$scope.selectedSeries = [];
	$scope.selectedCategory = [];
	
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
	
	//Array that will contain all chart types
	$scope.chartTypes = [];

	DiginServices.getChartTypes().then(function(data) {
		$scope.chartTypes = data;
		$scope.chartType = $scope.chartTypes[1]; // set default chart
	});
	
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
		}else{
			$scope.showPlaceholderIcon = true;
		}
	}
	
	//Common variable to store the widget contents
	$scope.widgetConfig = {};
	//$scope.currentChartType = "";
	$scope.showBarChartLoading = false;
	
	
	//Generate Chart Event
	$scope.generate = function()
	{
		//If a chart is already rendered first remove it
		$element.find('.currentChart').children().remove();
		
		$scope.showBarChartLoading = true;
		if($scope.chartType.chartType == 'highCharts') // if the user wants a highchart
		{
		
			generateHighchart.generate($scope.chartType.chart, $scope.selectedFile.datasource_name, $scope.selectedSeries,$scope.selectedCategory, 100, $scope.selectedFile.datasource_id,$scope.selectedDB,function (data){
				$scope.widgetConfig = data;
				$scope.showBarChartLoading = false;
				$scope.showPlaceholderIcon = false;
				newElement = $compile('<digin-high-chart config="widgetConfig" ></digin-high-chart>')($scope);
				$element.find('.currentChart').append(newElement);
				
			});
			
			//$scope.currentChartType = "highCharts";
		}else if($scope.chartType.chartType == 'map')
		{
			console.log($scope.chartType.chartType);
			$scope.widgetConfig = generateHighMap.generate(2);
			newElement = $compile('<digin-high-map config="'+$scope.widgetConfig+'"></digin-high-map>')($scope);
			$element.find('.currentChart').append(newElement);
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
	
	var widget = {};
	widget.widgetData = {};
	widget.widgetData.widData = {};
	$scope.createWidgetFinish = function()
	{
		//alert("create");
		$scope.saveWidget(widget);
	}
	
	$scope.saveWidget =  function(widget) {

		widget.widgetData.highchartsNG = $scope.highcharts;
		widget.widgetData.widData['drilled'] = false;
		widget.widgetData.widData['drillConf'] = undefined;
		widget.widgetName = "highcharts";
		widget.widgetData.widView = "views/common-data-src/res-views/SimpleHighChart.html";
		widget.widgetData.initCtrl = "elasticInit";
		$scope.saveChart(widget);
	}
	
	$scope.saveChart =  function(widget) {
		var widgets = $rootScope.dashboard.pages[$rootScope.selectedPage - 1].widgets;

		if (widget.widgetID == null) { // new widget, so a temp id is assigned
			widget.widgetID = "temp" + Math.floor(Math.random() * (100 - 10 + 1) + 10);
		}
		widget.widgetData.highchartsNG["size"] = {
			width: 313,
			height: 260
		};
		widget.widgetData.dataCtrl = "widgetSettingsDataCtrl";
		widget.widgetData.dataView = "views/ViewData.html";
		//widget.widgetData.widView = 'views/query/chart-views/highcharts.html'
		widget.widgetData["selectedChart"] = $scope.selectedChart;
		widget.sizeX = 6;
		widget.sizeY = 21;
		var objIndex = getRootObjectById(widget.widgetID, widgets);
		if (objIndex == null) { //new widget
			widgets.push(widget);
		}
		setTimeout(function() {
			$rootScope.selectedPageIndx = $rootScope.selectedPage - 1;
			$state.go('home.Dashboards');
		}, 1000);
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