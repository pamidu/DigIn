DiginApp.controller('developerCtrl',[ '$scope','$mdDialog','colorManager','notifications', 'dialogService','$timeout',function ($scope,$mdDialog,colorManager,notifications, dialogService,$timeout){
	$scope.$parent.currentView = "Developer Documentation";
    colorManager.reinforceTheme();
	
	$scope.availableColumns = [{name:"order_id"},{name:"order_quantity"},{name: "product_base_margin"} ];
	
    var cssHeading = "font-size:15px;font-weight:700;";


    $scope.alertDialog = function (ev) {
    	console.log('%c\nALERT DIALOG\n\n',cssHeading);
    	console.log('dialogService.alertDialog(ev,"Title","This is the content","OK");');
        dialogService.alertDialog(ev,"Title","This is the content","OK");
    }

    $scope.confirmDialog = function (ev) {
        console.log('%c\nCONFIRM DIALOG\n\n',cssHeading);
    	console.log('dialogService.confirmDialog(ev,"Title","Are you sure you want to close this dialog box?", "yes","no","cancel").then(function(answer) {\n'+
        '\tif(answer == "yes")\n'+
        '\t{\n\t\tnotifications.toast(1,"you said yes");\n'+
    	'\t}\n'+
       	'\telse if(answer == "no")\n'+
        '\t{\n\t\tnotifications.toast(0,"you said no");\n\t}\n'+
    	'});');


		dialogService.confirmDialog(ev,"Title","Are you sure you want to close this dialog box?", "yes","no","cancel").then(function(answer) {
            if(answer == 'yes')
			{
                notifications.toast(1,"you said yes");
			}else if(answer == 'no')
			{
                notifications.toast(0,"you said no");
			}
        });
    }

    $scope.showLoading = function (ev) {
        console.log('%c\nLOADING DIALOG\n\n',cssHeading);
        console.log('notifications.startLoading(ev,"This will load for 2 seconds");');
        console.log(' $timeout(function(){\n'+
        				    '\tnotifications.finishLoading();\n'+
      				'}, 2000););');

    	notifications.startLoading(ev,"This will load for 2 seconds");
        $timeout(function(){
			notifications.finishLoading();
		}, 2000);
    }

    $scope.showToast = function (type, content) {
        console.log('%c\nTOAST\n\n',cssHeading);
        console.log('notifications.toast('+type+','+content+');');
        notifications.toast(type,content);
    }

    $scope.consoleElement = function(elementType,specificType)
	{
		if(elementType == 'button')
		{
            console.log('%c\nBUTTON ('+specificType+')\n\n',cssHeading);
        	console.log('<md-button ng-click="doSomething()" class="'+specificType+'">Button</md-button>');
		}if(elementType == 'link') {
        	console.log('%c\nLINK (' + specificType + ')\n\n', cssHeading);
       		console.log('<md-button ng-href="{{googleUrl}}" class="' + specificType + '">Button</md-button>');
    	}if(elementType == 'iconButton')
		{
            console.log('%c\nBUTTON WITH ICON('+specificType+')\n\n',cssHeading);
            console.log('<md-button ng-click="doSomething()" class="'+specificType+'">Button</md-button>\n'+
							'\t<i class="ti-save" style="font-size:20px;line-height: 55px;"></i>\n'+
						'</md-button>');
		}else if(elementType == 'checkbox')
		{
            console.log('%c\nCHECKBOX\n\n',cssHeading);
			console.log('<md-checkbox ng-init="check = false" ng-model="check">\n'+
            			'\tCheck me out ({{check}})\n'+
        				'</md-checkbox>');
		}else if(elementType == 'switch')
		{
            console.log('%c\nSWITCH\n\n',cssHeading);
			console.log('<md-switch ng-init="switch = false" ng-model="switch" aria-label="Switch 1">\n'+
           					'\tSwitch 1: {{ switch }}\n'+
       					'</md-switch>');
		}else if(elementType == 'icon')
		{
            console.log('%c\nICON\n\n',cssHeading);
            console.log('<i class="ti-save-alt" style="font-size:15px"></i>');
		}else if(elementType == 'input')
		{
            console.log('%c\nINPUT / RESPONSIVE ROW\n\n',cssHeading);
            console.log('<div layout-gt-sm="row" class="side-margins">\n'+
							'\t<md-input-container class="md-block" flex-gt-sm>\n'+
								'\t\t<span>Full Name</span>\n'+
								'\t\t<input required type="text" name="name" ng-model="user.Name"  ng-disabled="false"  is-disabled-dark aria-label="name"/>\n'+
									'\t\t<div ng-messages="inputForm.name.$error" role="alert">\n'+
										'\t\t\t<div ng-message-exp="[\'required\']">\n'+
											'\t\t\t\tFull name is required\n'+
										'\t\t\t</div>\n'+
									'\t\t</div>\n'+
							'\t</md-input-container>\n'+
							'\t<md-input-container class="md-block" flex-gt-sm="60">\n'+
								'\t\t<span>Email</span>\n'+
								'\t\t<input required type="email" name="email" ng-model="user.Email" minlength="10" maxlength="100" ng-pattern="/^.+@.+\..+$/" ng-disabled="false"  is-disabled-dark  aria-label="email"/>\n'+
									'\t\t<div ng-messages="inputForm.email.$error" role="alert">\n'+
									'\t\t\t<div ng-message-exp="[\'required\', \'minlength\', \'maxlength\', \'pattern\']">\n'+
										'\t\t\t\tPlease enter a valid Email\n'+
									'\t\t\t</div>\n'+
								'\t\t</div>\n'+
							'\t</md-input-container>\n'+
						'</div>');
		}else if(elementType == 'select')
		{
				console.log('%c\nSELECT\n\n',cssHeading);
            	console.log('<md-input-container class="md-block" flex-gt-sm="40">\n'+
             				   '\t<span>Gender</span>\n'+
                				'\t<md-select ng-model="user.gender" ng-disabled="false" is-disabled-dark aria-label="gender">\n'+
            						'\t\t<md-option value="male" aria-label="country">Male</md-option>\n'+
              				      	'\t\t<md-option value="female" aria-label="country">Female</md-option>\n'+
                    			'\t</md-select>\n'+
                    		'</md-input-container>');
		}else if(elementType == 'theme')
		{
            console.log('%c\nSELECT\n\n',cssHeading);
            console.log('md-colors="{color:\'primary-500\'}" //this can be used on text');
            console.log('md-colors="{color:\'accent-500\'}" //same as above but uses accent colours');
            console.log('\nmd-colors="{background:\'primary-500\'}" //this can be used on background div');
            console.log('md-colors="{background:\'accent-500\'}" //same as above but uses accent colours');
		}

	}

	$scope.iconHTML = "Example: <i class=' ti-save-alt' style='font-size:15px'></i>";

}]);