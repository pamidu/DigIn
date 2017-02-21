////////////////////////////////
// File : dashboardFilterSettingsCtrl
// Owner  : Dilani Maheswaran
// Last changed date : 2017/02/09
// Version : 3.1.0.5
// Modified By : Dilani Maheswaran
////////////////////////////////

routerApp.controller('dashboardFilterSettingsCtrl',['$scope','$rootScope','$state','$http','$diginengine','datasourceFactory', 'notifications',
	function($scope,$rootScope,$state,$http,$diginengine,datasourceFactory,notifications)
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
	$scope.selectionType = "single";
	$scope.selectedTable = "";
	$scope.selectedTableValue = "";
	$scope.selectedValueField = "";
	$scope.selectedDisplayField = "";
	$scope.filterName = "";
	$scope.datasourceId = "";
	$scope.selectedConnection = "";
	$scope.fields = [];
	$scope.datasources = [];
	$scope.tables = [];
	$scope.customFields = [];
	$scope.datasourceConnections = [];
	$scope.tableProgress = false;
	$scope.connectionProgress = false;
	$scope.fieldsProgress = false;
	$scope.displayNoneText = false;

	$scope.selectedStep = 0;
	var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));


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
			$scope.customFields.push({
				actualValue : '',
				displayValue: ''
			})
		} else
		{
			$scope.incrementStep();
		}
	}
	// next button of step two
	$scope.stepTwo = function()
	{
		$scope.datasourceConnections = [];
		$scope.tables = [];
		$scope.client = $diginengine.getClient($scope.selectedDatasource);
		if ($scope.selectedDatasource == 'MSSQL' || $scope.selectedDatasource == 'Oracle' || $scope.selectedDatasource == 'hiveql' )
		{
			$scope.incrementStep();
			$scope.getConnections();
		} else 
		{
			$scope.incrementTwoStep();
			$scope.getTables();
		}
	}
	// next button of step three
	$scope.stepThree = function()
	{
		if ( $scope.selectedConnection == '' || $scope.selectedConnection === undefined )
		{
			notifications.toast('0','Please select a connection');
			return;
		}
		$scope.selectedConnectionValue = angular.fromJson($scope.selectedConnection);
		$scope.datasourceId = $scope.selectedConnectionValue.ds_config_id;
		$scope.incrementStep();
		$scope.getConnectionTables();

	}
	//next button of step four
	$scope.stepFour = function()
	{
		if( $scope.selectedTable == '' || $scope.selectedTable === undefined )
		{
			notifications.toast('0','Please select a table');
			return;
		}
		$scope.fields = [];
		$scope.incrementStep();
		if ($scope.selectedDatasource == 'MSSQL' || $scope.selectedDatasource == 'Oracle' || $scope.selectedDatasource == 'hiveql' )
		{
			$scope.selectedTableValue = angular.fromJson($scope.selectedTable).datasource_name;
			$scope.getAllFields();
		} else 
		{
			$scope.fieldsProgress = false;
			$scope.selectedTableValue = angular.fromJson($scope.selectedTable);
			$scope.datasourceId = $scope.selectedTableValue.datasource_id;
			angular.forEach($scope.selectedTableValue.schema,function(schema){
				if(schema.name != "_index_id")
				{
					$scope.fields.push({
						name: schema.name
					})
				}
			});
		}
	}
	// next button of step five
	$scope.stepFive = function()
	{
		//validation
		if($scope.selectedValueField == '' || $scope.selectedDisplayField == '')
		{
			notifications.toast('0','Please select a value field and a display field.');
			return;
		}
		$scope.incrementTwoStep();
	}

	$scope.stepFourPrevious = function()
	{
		if ($scope.selectedDatasource == 'MSSQL' || $scope.selectedDatasource == 'Oracle' || $scope.selectedDatasource == 'hiveql')
		{
			$scope.decrementStep();
		} else 
		{
			$scope.decrementTwoSteps();
		}
	}

	$scope.stepSevenPrevious = function()
	{
		if ($scope.selectedFilterOption == "custom")
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
		$scope.selectedTableValue = "";
		$scope.selectedTable = "";
		$scope.tables = [];
		$scope.client.getTables(function(res, status)
		{
			$scope.tableProgress = false;
			if(status)
			{
				if(res.length == 0)
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
		$scope.connectionProgress = true;
		datasourceFactory.getAllConnections(userInfo.SecurityToken,$scope.selectedDatasource).success(function(res)
		{
			$scope.connectionProgress = false;
			if(res.Is_Success)
			{
				$scope.datasourceConnections = res.Result;
			} else
			{
				$scope.datasourceConnections = [];
			}
		}).error(function(res)
		{
			$scope.connectionProgress = false;
			$scope.datasourceConnections = [];
		})
	}
	// fetch tables of a given connection
	$scope.getConnectionTables = function()
	{
		$scope.tableProgress = true;
		$scope.selectedTableValue = "";
		$scope.selectedTable = "";
		$scope.tables = [];
		$scope.displayNoneText = false;
		$scope.client.getConnectionTables($scope.datasourceId,$scope.selectedDatasource,function(data,status){
			if(status)
			{
				$scope.tableProgress = false;
				if(data.length == 0)
				{
					$scope.displayNoneText = true;
				} else
				{
					data.sort();
					angular.forEach(data,function(table){
						$scope.tables.push({
							datasource_name : table
						});
					});
				}
			} else 
			{
				$scope.tableProgress = false;

			}
		})
	}
	// fetch fields for a given table - mssql, hive and oracle
	$scope.getAllFields = function()
	{
		$scope.fieldsProgress = true;
        $scope.client.getMSSQLFields($scope.selectedTableValue, $scope.datasourceId ,function(data, status) {
        	if(status)
        	{
        		data.sort();
        		$scope.fieldsProgress = false;
        		if(data.length > 0)
        		{
        			angular.forEach(data,function(field){
	        			$scope.fields.push({
							name: field.Fieldname
						})
        			})
        		}
        	} else
        	{
				$scope.fieldsProgress = false;
        	}
        });
	}

}]);