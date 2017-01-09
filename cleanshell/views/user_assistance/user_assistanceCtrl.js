DiginApp.controller('user_assistanceCtrl',[ '$scope','$mdDialog', '$mdThemingProvider', function ($scope,$mdDialog, $mdThemingProvider){
		$scope.$parent.currentView = "User Assistance";
		
		//initialize the forms
		$scope.upload_step1 = {};
		$scope.upload_step1.completed = true;
		$scope.upload_step2 = {};
		$scope.upload_step2.disabled = true;
		$scope.upload_step3 = {};
		
		console.log($mdTheming);
		
		//Upload Types
		$scope.uploadTypes = [{name:"File", icon:"ti-file"},{name:"Folder",icon:"ti-folder"}];
		
		//Submit one in Upload Source
		$scope.disableFolerName = function(type)
		{
			if(type == "File")
			{
				$scope.upload_step2.disabled = true;
			}else{
				$scope.upload_step2.disabled = false;
			}
			$scope.upload_selected = 1;
			$scope.upload_step1.completed = true;
		}
		
		//start of page one Folder name configuring
		$scope.currentNavItem = 'page1';
		$scope.newCollection = false;

		$scope.goto = function() {

			$scope.folderForm.$setUntouched();
			$scope.folderForm.$setPristine();
			$scope.newCollection = !$scope.newCollection;
		}
		//end of page one Folder name configuring
		
		//Submit two in Upload Source
		$scope.submitFolderStep = function()
		{
			$scope.upload_selected = 2;
			$scope.upload_step2.completed = true;	
		}
		
		//Submit three in Upload Source
		$scope.submitUploadDetails = function()
		{
			$scope.upload_selected = 3;
			$scope.upload_step3.completed = true;	
			//$scope.upload_step2.completed = true;	
		}
		
		//Go To Previous Upload Source Step
		$scope.goToPreviousUploadSourceStep = function()
		{
			--$scope.upload_selected;
		}
		
		//Submit four in Upload Source
		$scope.goToNext = function()
		{
			console.log("next");
			$scope.assist_selected = 1;
		}
		
		
		
		
		
		
		
		
		//Connect Source		
		
		//initialize the forms
		
		$scope.connectSource_step1 = {};
		$scope.connectSource_step2 = {};
		
		$scope.sourceType = [
			{name: "Big Query", icon: "views/data_source/visualize_data/bigquery.png"},
			{name: "postgresql", icon: "views/data_source/visualize_data/postgress.png"},
			{name: "MSSQL", icon: "views/data_source/visualize_data/mysql.png"}
		];
		
		//Submit one in Upload Source
		$scope.selectSource = function(type)
		{
			//alert(type);
			$scope.connectSource_selected = 1;
			$scope.connectSource_step1.completed = true;
		}
		
		$scope.tables = ['Superstore', 'ar_customercatogories','ar_customerinfo','ar_invoicedetails','ar_invoiceheader','ar_returndetails','ar_returnheader','current_employee_names__salaries__and_position_titles','departments','inv_inventoryTransactions','inv_products','inv_storeinformation','overdata','sample'];
		
		
		$scope.goToPreviousConnectSourceStep = function()
		{
			--$scope.connectSource_selected;
		}
		
		$scope.submitTableSelectStep = function()
		{
			$scope.connectSource_selected = 2;
			$scope.connectSource_step2.completed = true;
		}
		
		$scope.attributes = ['GUStoreID','GUChangeID','StoreCode', 'StoreName','BuildingNumber', 'StreetName', 'City', 'PostalCode','ZipCode', 'Phone1','Phone2','Fax','Status','CreatedUser','CreatedDate','ModifiedUser','ModifiedDate','GUDepotID','GUDepotChgID','MiniStore','GUVehicleID','GUVehicleChgID','GUDeptID'];
		$scope.selectAllAttributes = false;
		$scope.selectedAttributes = [];
		$scope.selectAttribute = function (item) {

			var idx = $scope.selectedAttributes.indexOf(item);
			if (idx > -1) {
			 $scope.selectedAttributes.splice(idx, 1);
			}
			else {
			  $scope.selectedAttributes.push(item);
			  console.log($scope.selectedAttributes);
			}
		};
		$scope.attributesExists = function (item) {
			return $scope.selectedAttributes.indexOf(item) > -1;
		};
		/*vm.isIndeterminate = function() {
			return (vm.selectedAttributes.length !== 0 &&
				vm.selectedAttributes.length !== vm.attributes.length);
		};*/
	  
		$scope.toggleAllAttributes = function() {
			if ($scope.selectedAttributes.length === $scope.attributes.length) {
				$scope.selectedAttributes = [];
			} else if ($scope.selectedAttributes.length === 0 || $scope.selectedAttributes.length > 0) {
				$scope.selectedAttributes = $scope.attributes.slice(0);
			}
		};
		
		$scope.measures = ['LocationID','CompanyID', 'BranchID','DeptID','StoreID','CityID','Country','PeriodID'];
		$scope.selectAllMeasures= false;
		$scope.selectedMeasures= [];
		$scope.selectMeasure = function (item) {

			var idx = $scope.selectedMeasures.indexOf(item);
			if (idx > -1) {
			  $scope.selectedMeasures.splice(idx, 1);
			}
			else {
			  $scope.selectedMeasures.push(item);
			  console.log($scope.selectedMeasures);
			}
		};
		$scope.measuresExists = function (item) {
			return $scope.selectedMeasures.indexOf(item) > -1;
		};
		
		$scope.toggleAllMeasures = function() {
			if ($scope.selectedMeasures.length === $scope.measures.length) {
				$scope.selectedMeasures = [];
			} else if ($scope.selectedMeasures.length === 0 || $scope.selectedMeasures.length > 0) {
				$scope.selectedMeasures = $scope.measures.slice(0);
			}
		};
		
		$scope.aggregations = ["AVG","SUM","COUNT","MIN","MAX"];
		
		$scope.series = [
							{click: false,filedName: 'PO',id:0,type:'integer'},
							{click: false,filedName: 'QUANTITY',id:0,type:'integer'},
							{click: false,filedName: 'AMOUNT',id:0,type:'integer'}
						];
							
		$scope.category = [	"CITY","PROVINCE","COUNTRY","ITEM","ITEMGROUP","QUANTITY","AMOUNT"];
		
		$scope.selectedSeries = [];
		$scope.selectedCategory = [];
		
		$scope.pushSeries = function(item, aggregation)
		{
			var pushObj = angular.copy(item);
			pushObj.aggType = aggregation;
			
			$scope.selectedSeries.push(pushObj);
			console.log($scope.series[0]);
			console.log($scope.selectedSeries[0]);
		}
		
		$scope.pushCateory = function(index, item)
		{
			console.log(item);
			$scope.selectedCategory.push(item);
		}
		
		setTimeout(function(){
			Highcharts.chart('container', {
				  title: {
					text: 'Sales'
				  },
				  chart: {
					type: "bar",
					backgroundColor: "green",
					color: "white"
					
					},

				  xAxis: {
					categories: ['Sep', 'Oct', 'Nov', 'Dec']
				  },

				  series: [{
					data: [8750.0, 11650.0, 6970.0, 21755.0]
				  }]
			});
		}, 1000);
			
		
		
		
		
		
		
		
		
}])