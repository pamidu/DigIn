DiginApp.controller('addWidgetCtrl', ['$scope', '$rootScope','$timeout', '$rootScope', '$mdDialog', '$http', '$log', 'DiginServices',
    function($scope, $rootScope ,$timeout, $rootScope, $mdDialog, $http, $log, DiginServices) {
		
		if(Object.keys($rootScope.currentDashboard).length != 0)
		{
			console.log("dashboard selected");
		}else{
			
			$rootScope.selectedPageIndex = 0;
			
			$rootScope.currentDashboard = {
				"pages": null,
				"compClass": null,
				"compType": null,
				"compCategory": null,
				"compID": null,
				"compName": null,
				"refreshInterval": null,
			}

			$rootScope.currentDashboard.pages = [];
			var page = {
				"widgets": [],
				"pageID": "temp" + "asdjfl",
				"pageName": "DEFAULT",
				"pageData": null
			}
			$rootScope.currentDashboard.pages.push(page);
		}
	
		//to filter the view with widget types
		$scope.selected = {};
		
		DiginServices.getWidgetTypes().then(function(data) {
			$scope.WidgetTypes = data;
			$scope.selected.type = data[0].title;
		});
		
		DiginServices.getWidgets().then(function(data) {
			$scope.Widgets = data;
		});

        

        $scope.filterWidgets = function(item) {
            if (item == null) {
                item.title = "Visualization";
            }
            $scope.selected = {};
            $scope.selected.type = item.title;
            $rootScope.widgetType = $scope.selected.type;
        };

        function openInitialConfig(ev, id) {

            if($scope.currWidget.initTemplate){
				$mdDialog.show({
                    controller: $scope.currWidget.initCtrl,
                    templateUrl: $scope.currWidget.initTemplate,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        widgetID : id
                    }
                })
                .then(function() {
                
                });
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

		
        $scope.addAllinOne = function(widget, ev) {

            // if($rootScope.dashboard.pages[0].widgets.length < 6){
				
			$scope.currWidget = {

				widCsv: {},
				widCsc: {},
				widEnc: {},
				widDec: {},
				widAna: {},
				widAque: {},
				widAexc: {},
				widIm: {},
				widData: {},
				widChart: widget.widConfig,
				widView: widget.widView,
				widName: widget.title,
				dataView: widget.dataView,
				dataCtrl: widget.dataCtrl,
				initTemplate: widget.initTemplate,
				initCtrl: widget.initController,
				uniqueType: widget.title,
				syncState: true,
				expanded: true,
				seriesname: "",
				externalDataURL: "",
				dataname: "",
				d3plugin: "",
				divider: false,
				chartSeries: $scope.chartSeries,
				id: Math.floor(Math.random() * (100 - 10 + 1) + 10),
				type: widget.type,
				width: '370px',
				left: '0px',
				top: '0px',
				height: '300px',
				mheight: '100%',
				chartStack: [{
					"id": '',
					"title": "No"
				}, {
					"id": "normal",
					"title": "Normal"
				}, {
					"id": "percent",
					"title": "Percent"
				}],
				highchartsNG: null

			}
				
			/*var voices = window.speechSynthesis.getVoices();
			var msg = new SpeechSynthesisUtterance('you are adding' + widget.title + ' widget');
			msg.voice = voices[2];
			window.speechSynthesis.speak(msg);*/

			var widgetObj =
			{   
				"widgetID": "temp" + Math.floor(Math.random() * (100 - 10 + 1) + 10),
				"widgetName": $scope.currWidget.widName,
				"widgetData": $scope.currWidget,
				sizeX: 7,
				sizeY: 23  
			}
			console.log(widgetObj);
			openInitialConfig( ev, widgetObj.widgetID);
			console.log($rootScope.selectedPageIndex);
			$rootScope.currentDashboard.pages[$rootScope.selectedPageIndex].widgets.push(widgetObj);
			location.href = '#/dashboard?id='+$rootScope.currentDashboard.compID;
            $mdDialog.hide();
        };
		
			
		$scope.cancel = function()
		{
			$mdDialog.cancel();
		}
    }

]);