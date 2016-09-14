DiginApp.controller('visualize_dataCtrl', function ($scope, $q, $timeout) {
	console.log('start of visualize_dataCtrl');
    var vm = this;

    vm.selectedStep = 0;
    vm.stepProgress = 1;
    vm.maxStep = 3;
    vm.showBusyText = false;
    vm.stepData = [
        { step: 1, completed: false, optional: false, data: {} },
        { step: 2, completed: false, optional: false, data: {} },
        { step: 3, completed: false, optional: false, data: {} },
    ];
	
	vm.attributes = ['GUStoreID','GUChangeID','StoreCode', 'StoreName','BuildingNumber', 'StreetName', 'City', 'PostalCode','ZipCode', 'Phone1','Phone2','Fax','Status','CreatedUser','CreatedDate','ModifiedUser','ModifiedDate','GUDepotID','GUDepotChgID','MiniStore','GUVehicleID','GUVehicleChgID','GUDeptID'];
	vm.selectAllAttributes = false;
	vm.selectedAttributes = [];
	vm.selectAttribute = function (item) {

		var idx = vm.selectedAttributes.indexOf(item);
		if (idx > -1) {
		  vm.selectedAttributes.splice(idx, 1);
		}
		else {
		  vm.selectedAttributes.push(item);
		  console.log(vm.selectedAttributes);
		}
	};
	vm.attributesExists = function (item) {
		return vm.selectedAttributes.indexOf(item) > -1;
	};
	/*vm.isIndeterminate = function() {
		return (vm.selectedAttributes.length !== 0 &&
			vm.selectedAttributes.length !== vm.attributes.length);
	};*/
  
	vm.toggleAllAttributes = function() {
		if (vm.selectedAttributes.length === vm.attributes.length) {
			vm.selectedAttributes = [];
		} else if (vm.selectedAttributes.length === 0 || vm.selectedAttributes.length > 0) {
			vm.selectedAttributes = vm.attributes.slice(0);
		}
	};
	
	vm.measures = ['LocationID','CompanyID', 'BranchID','DeptID','StoreID','CityID','Country','PeriodID'];
	vm.selectAllMeasures= false;
	vm.selectedMeasures= [];
	vm.selectMeasure = function (item) {

		var idx = vm.selectedMeasures.indexOf(item);
		if (idx > -1) {
		  vm.selectedMeasures.splice(idx, 1);
		}
		else {
		  vm.selectedMeasures.push(item);
		  console.log(vm.selectedMeasures);
		}
	};
	vm.measuresExists = function (item) {
		return vm.selectedMeasures.indexOf(item) > -1;
	};
	
	vm.toggleAllMeasures = function() {
		if (vm.selectedMeasures.length === vm.measures.length) {
			vm.selectedMeasures = [];
		} else if (vm.selectedMeasures.length === 0 || vm.selectedMeasures.length > 0) {
			vm.selectedMeasures = vm.measures.slice(0);
		}
	};
	
	
	
	
	vm.sourceType = [
		{name: "Big Query", icon: "views/data_source/visualize_data/bigquery.png"},
		{name: "postgresql", icon: "views/data_source/visualize_data/postgress.png"},
		{name: "MSSQL", icon: "views/data_source/visualize_data/mysql.png"}
	];
	
	vm.tables = ['Superstore', 'ar_customercatogories','ar_customerinfo','ar_invoicedetails','ar_invoiceheader','ar_returndetails','ar_returnheader','current_employee_names__salaries__and_position_titles','departments','inv_inventoryTransactions','inv_products','inv_storeinformation','overdata','sample']

	vm.selectSource = function(source)
	{
		console.log(source);
		vm.stepData[0].data.source = source;
	}
	
    vm.enableNextStep = function nextStep() {
        //do not exceed into max step
        if (vm.selectedStep >= vm.maxStep) {
            return;
        }
        //do not increment vm.stepProgress when submitting from previously completed step
        if (vm.selectedStep === vm.stepProgress - 1) {
            vm.stepProgress = vm.stepProgress + 1;
        }
        vm.selectedStep = vm.selectedStep + 1;
    }

    vm.moveToPreviousStep = function moveToPreviousStep() {
        if (vm.selectedStep > 0) {
            vm.selectedStep = vm.selectedStep - 1;
        }
    }

    vm.submitCurrentStep = function submitCurrentStep(stepData, isSkip) {
		console.log(stepData, isSkip)
        var deferred = $q.defer();
        vm.showBusyText = true;

        if (!stepData.completed && !isSkip) {
            //simulate $http
            $timeout(function () {
                vm.showBusyText = false;
                console.log('On submit success');
                deferred.resolve({ status: 200, statusText: 'success', data: {} });
                //move to next step when success
                stepData.completed = true;
                vm.enableNextStep();
            }, 500)
        } else {
            vm.showBusyText = false;
            vm.enableNextStep();
        }
    }

});