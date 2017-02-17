////////////////////////////////
// File : dashboardFilterSettingsCtrl
// Owner  : Dilani Maheswaran
// Last changed date : 2017/02/09
// Version : 3.1.0.5
// Modified By : Dilani Maheswaran
////////////////////////////////

routerApp.controller('dashboardFilterSettingsCtrl',['$scope','$rootScope','$state','$http','$diginengine','datasourceFactory', 
	function($scope,$rootScope,$state,$http,$diginengine,datasourceFactory)
{


	//Theme config for md-tabs-wrapper
	if($rootScope.theme.substr($rootScope.theme.length - 4) == "Dark")
	{
		$('md-tabs-wrapper').css('background-color',"rgb(48,48,48)", 'important');
	} else
	{
		$('md-tabs-wrapper').css('background-color',"white", 'important');
	}
	$scope.selectedFilterOption = "configure";
	$scope.selectedDatasource = "BigQuery";
	$scope.datasources = [];
	$scope.tables = [];
	$scope.tableProgress = false;
	$scope.displayNoneText = false;
	$scope.stepData = [{
	    step: 0,
	    completed: false,
	    optional: false,
	    data: {},
	    busyText: ""
	}, {
	    step: 1,
	    completed: false,
	    optional: false,
	    data: {},
	    busyText: ""
	}, {
	    step: 2,
	    completed: false,
	    optional: false,
	    data: {}
	}, {
		step: 3,
		completed: false,
		optional: false,
		data: {}
	}, {
		step: 4,
		completed: false,
		optional: false,
		data: {}
	}, {
		step: 5,
		completed: false,
		optional: false,
		data: {}
	}];
	$scope.selectedStep = 0;

    $scope.initiateDatasources = function()
    {
        $http.get('jsons/dbConfig.json').success(function(data) 
        {
        	angular.forEach(data,function(src,index)
        	{
        		if (src.name != 'DuoStore' && src.name != 'postgresql' && src.name != 'CSV Upload')
        		{
        			$scope.datasources.push(src);
        		}
        	})
        }).error(function(error)
        {
        	console.log(error);
        });
    }

	// route to home
	$scope.goHome = function()
	{
		$state.go('home.welcomeSearch');
	}

	// move to the next stepper
	$scope.incrementStep = function()
	{
	    $scope.selectedStep++;
	}

	$scope.incrementTwoStep = function()
	{
		$scope.selectedStep += 2;
	}
	// move to the previous stepper
	$scope.decrementStep = function()
	{
		$scope.selectedStep--;
	}
	//move 2 steps back
	$scope.decrementTwoSteps = function()
	{
		$scope.selectedStep -= 2;
	}
	// next button at step one
	$scope.stepOne = function()
	{
		if ($scope.selectedFilterOption == "custom")
		{
			$scope.selectedStep += 5;
		} else
		{
			$scope.incrementStep();
		}
	}
	// next button of step two
	$scope.stepTwo = function()
	{
		if ($scope.selectedDatasource == 'MSSQL')
		{
			$scope.incrementStep();
			$scope.getConnections();
		} else 
		{
			$scope.incrementTwoStep();
			$scope.getTables();
		}
	}

	$scope.stepFourPrevious = function()
	{
		if ($scope.selectedDatasource == 'MSSQL')
		{
			$scope.decrementStep();
		} else 
		{
			$scope.decrementTwoSteps();
		}
	}
	// go to level one 
	$scope.GoToStepOne = function()
	{
		$scope.selectedStep = 0;
	}
	//select datasource
	$scope.selectDatasource = function(datasource)
	{
		$scope.selectedDatasource = datasource;	
	}
	//fetch tables 
	$scope.getTables = function()
	{
		$scope.tableProgress = true;
		$scope.client = $diginengine.getClient($scope.selectedDatasource);
		$scope.client.getTables(function(res, status)
		{
			$scope.tableProgress = false;
			if(status)
			{
				if($scope.tables.length == 0)
				{
					$scope.displayNoneText = true;
				} else
				{
					$scope.tables=res;
				}
			}
		});
	}
	// fetch connections
	$scope.getConnections = function()
	{
		$scope.tableProgress = true;
		datasourceFactory.getAllConnections(userInfo.SecurityToken).success(function(data)
		{

		}).error(function(data)
		{

		})
	}

}]);