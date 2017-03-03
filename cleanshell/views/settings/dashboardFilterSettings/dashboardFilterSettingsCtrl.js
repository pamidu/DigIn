////////////////////////////////
// File : dashboardFilterSettingsCtrl
// Owner  : Dilani Maheswaran
// Last changed date : 2017/02/09
// Version : 3.1.0.5
// Modified By : Dilani Maheswaran
////////////////////////////////

DiginApp.controller('dashboardFilterSettingsCtrl',['$scope','$rootScope','$state','$http','$diginengine','$diginurls','datasourceFactory','notifications','colorManager',
function($scope,$rootScope,$state,$http,$diginengine,$diginurls,datasourceFactory,notifications,colorManager)
{
	$scope.$parent.currentView = "Dashboard Filter Settings";

	$scope.selectedFilterOption = "configure";
	$scope.selectedDatasource = "MSSQL";
	$scope.selectionType = "single";
	$scope.selectedTable = "";
	$scope.selectedTableValue = "";
	$scope.selectedConnectionValue = "";
	$scope.selectedValueField = "";
	$scope.selectedDisplayField = "";
	$scope.filterName = "";
	$scope.datasourceId = "";
	$scope.selectedConnection = "";
	$scope.selectedDefaultValue = "";
	$scope.fields = [];
	$scope.datasources = [];
	$scope.tables = [];
	$scope.customFields = [];
	$scope.datasourceConnections = [];
	$scope.defaultValues = [];
	$scope.tableProgress = false;
	$scope.connectionProgress = false;
	$scope.fieldsProgress = false;
	$scope.displayConnectionNoneText = false;
	$scope.displayTableNoneText = false;
	$scope.displayFieldNoneText = false;
	$scope.defaultProgoress = false;
	$scope.isDefault = false;
	$scope.selectedStep = 0;
	$scope.customFields[0] = {
		actualValue : '',
		displayValue: ''
	}
	var userInfo = JSON.parse(decodeURIComponent(getCookie('authData')));


    $scope.initiateDatasources = function()
    {
        $http.get('jsons/dbConfig.json').then(function(data) 
        {
        	angular.forEach(data,function(src,index)
        	{
        		if (src.name != 'DuoStore' && src.name != 'postgresql' && src.name != 'CSV Upload')
        		{
        			$scope.datasources.push(src);
        		}
        	})
        },function errorCallback(response) {
    
        	console.log(error);
        });

    }

	// route to home
	$scope.goHome = function()
	{
		$state.go('home.Dashboards');
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

	$scope.incrementThreeStep = function()
	{
		$scope.selectedStep += 3;
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
	//move three steps back
	$scope.decrementThreeSteps = function()
	{
		$scope.selectedStep -= 3;
	}
	// next button at step one
	$scope.stepOne = function()
	{
		if ($scope.selectedFilterOption == "custom")
		{
			$scope.selectedStep += 6;
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
		$scope.selectedDefaultValue = '';
		$scope.defaultProgoress = false;
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
		$scope.isDefault = false;
		$scope.incrementThreeStep();
	}
	// next button of step six
	$scope.stepSix = function()
	{
		if ( $scope.defaultValues.length > 0)				
		{
			if ($scope.selectedDefaultValue == '')
			{
				notifications.toast('0','Please se;ect a default value to proceed.');
				return;
			}
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
	// previous of step six
	$scope.stepSixPrevious = function()
	{
		$scope.isDefault = false;
		$scope.selectedDefaultValue = '';
		$scope.decrementStep();
	}

	$scope.stepEightPrevious = function()
	{
		if ($scope.selectedFilterOption == "custom")
		{
			$scope.decrementStep();
		} else
		{
			if ($scope.isDefault)
			{
				$scope.decrementTwoSteps();
			} else 
			{
				$scope.decrementThreeSteps();				
			}
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
		$scope.displayTableNoneText = false;
		$scope.client.getTables(function(res, status)
		{
			$scope.tableProgress = false;
			if(status)
			{
				if(res.length == 0)
				{
					$scope.displayTableNoneText = true;
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
		$scope.displayConnectionNoneText = false;
		$scope.connectionProgress = true;
		datasourceFactory.getAllConnections(userInfo.SecurityToken,$scope.selectedDatasource).success(function(res)
		{
			$scope.connectionProgress = false;
			if(res.Is_Success)
			{
				if(res.Result.length == 0)
				{
					$scope.displayConnectionNoneText = true;
				}
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
		$scope.displayTableNoneText = false;
		$scope.client.getConnectionTables($scope.datasourceId,$scope.selectedDatasource,function(data,status){
			if(status)
			{
				$scope.tableProgress = false;
				if(data.length == 0)
				{
					$scope.displayTableNoneText = true;
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
		$scope.displayFieldNoneText = false;
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
        		} else
        		{
        			$scope.displayFieldNoneText = true;
        		}
        	} else
        	{
				$scope.fieldsProgress = false;
        	}
        });
	}
	//add custom filter row
	$scope.addCustomField = function()
	{
		$scope.customFields.push({
			actualValue: '',
			displayValue: ''
		})
	}
	//remove custom field
	$scope.removeCustomField = function(index)
	{
		if ($scope.customFields.length == 1)
		{
			$scope.customFields = [];
		} else
		{
			if (index == 0)
			{
				$scope.customFields.shift();
			} else
			{
				$scope.customFields.splice(index,1);
			}
		}
	}
	//display default values 
	$scope.displayDefaultValues = function()
	{
		$scope.incrementStep();
		$scope.isDefault = true;
		var query = '';
		$scope.defaultProgoress = true;
		$scope.defaultValues = [];
		switch($scope.selectedDatasource)
		{
			case 'BigQuery':
			case 'memsql':
				// write the statement for bigQuery and memesql
				query = "SELECT " + $scope.selectedValueField + " FROM " + $diginurls.getNamespace() + "." + $scope.selectedTableValue.datasource_name + " GROUP BY " + $scope.selectedValueField;
				break;
			case 'MSSQL':
				// write for mssql
				var table = $scope.selectedTableValue.split(".");
				query = "SELECT [" + $scope.selectedValueField + "] FROM [" + table[0] + '].[' + table[1] + "] GROUP BY [" + $scope.selectedValueField + "] ORDER BY [" + $scope.selectedValueField + "]";
				break;
			case 'hiveql':
				// write for hiveql
				query = "SELECT " + $scope.selectedValueField + " FROM "+ $scope.selectedTableValue +"  GROUP BY " + $scope.selectedValueField + " ORDER BY " + $scope.selectedValueField + "";
				break;
		}
		$scope.client.getExecQuery(query,$scope.datasourceId,function(data,status)
		{
			$scope.defaultProgoress = false;
			if(status)
			{
				angular.forEach(data,function(value)
				{
					$scope.$apply(function()
					{
						$scope.defaultValues.push(value[$scope.selectedValueField]);
					});
				})
				if ($scope.defaultValues.length > 0)
				{
					$scope.selectedDefaultValue = $scope.defaultValues[0];
				}
			} else {
				notifications.toast('0','Error occurred. Please try again.');
			}
		})

	}

	$scope.setDefaultParam = function()
	{
		if ($scope.isDefault)
		{
			$scope.selectedDefaultValue = "";
		}
	}

	// save the filter with the respective dashboard
	$scope.saveFilters = function()
	{
		var is_custom;
		var connection;
		var table;
		if ( $scope.selectedFilterOption == "custom" )
		{
			is_custom = true;
		} else 
		{
			is_custom = false;
		}
		if ($scope.selectedConnectionValue.connection_name === undefined)
		{
			connection = "";
		} else
		{
			connection = $scope.selectedConnectionValue.connection_name;
		}
		if( $scope.selectedDatasource == 'BigQuery' || $scope.selectedDatasource == 'memsql')
		{
			table = $scope.selectedTableValue.datasource_name;
		} else 
		{
			table = $scope.selectedTableValue;
		}

		var filterObj = {
			"filter_id" : null,
			"is_custom" : is_custom,
			"selection_type" : $scope.selectionType,
			"custom_fields" : $scope.customFields,
			"datasource" : $scope.selectedDatasource,
			"datasource_id" : $scope.datasourceId,
			"datasource_connection" : connection,
			"datasource_table" : table,
			"value_field" : $scope.selectedValueField,
			"display_field" : $scope.selectedDisplayField,
			"is_default" : $scope.isDefault,
			"default_value" : $scope.selectedDefaultValue,
			"filter_name": $scope.filterName
		}
		if ($rootScope.dashboard.filterDetails === undefined)
		{
			$rootScope.dashboard["filterDetails"] = [];
			$rootScope.dashboard.filterDetails.push(filterObj);
		} else
		{
			$rootScope.dashboard.filterDetails.push(filterObj);
		}
		$scope.goHome();
	}

}]);