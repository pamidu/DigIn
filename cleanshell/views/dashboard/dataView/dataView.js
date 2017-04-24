DiginApp.controller('dataViewCtrl', ['$scope', '$mdDialog','event' ,'widget','$timeout', function($scope, $mdDialog,event, widget,$timeout) {

	
	$scope.widget = widget;
	console.log(widget);
	console.log(widget.widgetData.widgetConfig.series);
	
	$scope.data = [
					{id: "0", order_priority:"Critical", avg_sales: 1694.53},
					{id: "1", order_priority:"High", avg_sales: 	1848.05},
					{id: "2", order_priority:"Low", avg_sales: 	1908.51},
					{id: "3", order_priority:"Medium", avg_sales: 	1755.03},
					{id: "4", order_priority:"Not Specified", avg_sales: 	1661.7},
					{id: "5", order_priority:"Critical", avg_sales: 1694.53},
					{id: "6", order_priority:"High", avg_sales: 	1848.05},
					{id: "7", order_priority:"Low", avg_sales: 	1908.51},
					{id: "8", order_priority:"Medium", avg_sales: 	1755.03},
					{id: "9", order_priority:"Not Specified", avg_sales: 	1661.7},
					{id: "10", order_priority:"Low", avg_sales: 	1908.51},
					{id: "11", order_priority:"Medium", avg_sales: 	1755.03},
					{id: "12", order_priority:"Not Specified", avg_sales: 	1661.7},
					{id: "13", order_priority:"Low", avg_sales: 	1908.51},
					{id: "14", order_priority:"Medium", avg_sales: 	1755.03},
					{id: "15", order_priority:"Not Specified", avg_sales: 	1661.7},
					{id: "16", order_priority:"Low", avg_sales: 	1908.51},
					{id: "17", order_priority:"Medium", avg_sales: 	1755.03},
					{id: "18", order_priority:"Not Specified", avg_sales: 	1661.7}
	];
	
}]);// END OF dataViewCtrl
/*
 // ====== angular-table configuration ========
        $scope.config = {
            itemsPerPage: 10,
            fillLastPage: false
        }
        $scope.eventHndler = {
            isLoadingChart: true,
            message: "Data Loading..."
        }
        $scope.defaultFileName = "file name";

        publicFun = {
            getDrilledLevel: function() {

                switch ($rootScope.widget.widgetData.widData.drillConf.currentLevel) {

                    case 1:
                        var query = $rootScope.widget.widgetData.widData.drillConf.level1Query;
                        break;
                    case 2:
                        var query = $rootScope.widget.widgetData.widData.drillConf.level2Query;
                        break;
                    case 3:
                        var query = $rootScope.widget.widgetData.widData.drillConf.level3Query;
                        break;
                }

                return query;
            }
        }


        $scope.initialize = function() {


            if ($rootScope.widget.widgetName == "sunburst" || $rootScope.widget.widgetName == "hierarchy") {

                $scope.tableData = [];
                // if($rootScope.widget.widgetData.commonSrc.src.fMeaArr.length > 0)
                //     var parent =$rootScope.widget.widgetData.commonSrc.src.fMeaArr[0].name;

                $scope.fieldData = [parent, "value"];

                var id = 0;
                var data;

                data = $rootScope.widget.widgetData.TochartData.children;

                var newTableData = [];
                for (var i = 0; i < data.length; i++) {

                    if (typeof data[i].children == "object") {

                        if ($rootScope.widget.widgetData.commonSrc.att.length > 2) {
                            var childone = $rootScope.widget.widgetData.commonSrc.att[0].filedName;
                            var childtwo = $rootScope.widget.widgetData.commonSrc.att[2].filedName;
                            var childthree = $rootScope.widget.widgetData.commonSrc.att[1].filedName;
                           
                            $scope.fieldData = [childone, childtwo, childthree, "value"];

                            for (var x = 0; x < data[i].children.length; x++) {
                                for (var y = 0; y < data[i].children[x].children.length; y++) {
                                    //for(var z=0; z< data[i].children[x].children[y].children.length ; z++){
                                    var newObject = {};
                                    id++;
                                    newObject["id"] = id;
                                    newObject[childone] = data[i].type;
                                    newObject[childtwo] = data[i].children[x].type;
                                    newObject[childthree] = data[i].children[x].children[y].type;
                                    newObject["value"] = data[i].children[x].children[y].size;
                                    // if($rootScope.widget.widgetData.commonSrc.src.fMeaArr.length > 0)
                                    //     newObject[parent]  = data[i].children[x].children[y].children[z].type;
                                    newTableData.push(newObject);
                                    //}

                                }
                            }
                        } else if ($rootScope.widget.widgetData.commonSrc.att.length === 2) {
                            var childone = $rootScope.widget.widgetData.commonSrc.att[0].filedName;
                            var childtwo = $rootScope.widget.widgetData.commonSrc.att[1].filedName;
                            //$scope.fieldData=[childone,childtwo,parent];
                            $scope.fieldData = [childone, childtwo, "value"];
                            for (var x = 0; x < data[i].children.length; x++) {
                                //for(var y = 0; y < data[i].children[x].children.length; y++){
                                var newObject = {};
                                id++;
                                newObject["id"] = id;
                                newObject[childone] = data[i].type;
                                newObject[childtwo] = data[i].children[x].type;
                                newObject["value"] = data[i].children[x].size;
                                //newObject[parent]  = data[i].children[x].children[y].type;
                                newTableData.push(newObject);
                                //}
                            }
                        } else if ($rootScope.widget.widgetData.commonSrc.att.length === 1) {
                            var childone = $rootScope.widget.widgetData.commonSrc.att[0].filedName;
                            $scope.fieldData = [childone, "value"];
                            //for (var x = 0; x < data[i].children.length; x++) {
                            var newObject = {};
                            id++;
                            newObject["id"] = id;
                            newObject[childone] = data[i].type;
                            newObject["value"] = data[i].size;
                            newTableData.push(newObject);
                            //}
                        }

                    }
                }
                console.log(newTableData);
                $scope.tableData = newTableData;
                $scope.originalList = newTableData;

            } else if ($rootScope.widget.widgetName == "forecast") {
                $scope.fieldData = [];
                $scope.fieldData[0] = "Date";
                var forecast_field = $rootScope.widget.widgetData.foreCastObj.f_field;

                for (var i = 0; i < $rootScope.widget.widgetData.highchartsNG.series.length; i++) {
                    if (typeof $rootScope.widget.widgetData.highchartsNG.series[i].name != "undefined")
                        nameOfFeild = $rootScope.widget.widgetData.highchartsNG.series[i].name + "_" + forecast_field;
                    else
                        nameOfFeild = forecast_field;
                    $scope.fieldData[i + 1] = nameOfFeild.replace(/\s+/g, '');
                }
                var newTableData = [];

                for (var i = 0; i < $rootScope.widget.widgetData.highchartsNG.xAxis.categories.length; i++) {
                    var newObject = {};
                    newObject["id"] = i;

                    newObject[$scope.fieldData[0]] = $rootScope.widget.widgetData.highchartsNG.xAxis.categories[i];

                    for (var j = 1; j < $scope.fieldData.length; j++) {
                        if ($rootScope.widget.widgetData.highchartsNG.series[j - 1].data[i] == "" ||
                            typeof $rootScope.widget.widgetData.highchartsNG.series[j - 1].data[i] == "undefined")
                            newObject[$scope.fieldData[j]] = 0;
                        else
                            newObject[$scope.fieldData[j]] = $rootScope.widget.widgetData.highchartsNG.series[j - 1].data[i];
                    }
                    newTableData.push(newObject);
                }
                $scope.tableData = newTableData;
                $scope.originalList = newTableData;
            } else if ($rootScope.widget.widgetName == "bubble") {
                $scope.fieldData = [];
                var newTableData = [];
                // for(var i=0; i< $rootScope.widget.widgetData.commonSrc.src.fAttArr.length; i++){
                //         $scope.fieldData.push($rootScope.widget.widgetData.commonSrc.src.fAttArr[i]);
                // }
                $scope.fieldData.push($rootScope.widget.widgetData.commonSrc.src.fAttArr[0].name);
                for (var i = 0; i < $rootScope.widget.widgetData.commonSrc.src.fMeaArr.length; i++) {
                    $scope.fieldData.push($rootScope.widget.widgetData.commonSrc.src.fMeaArr[i].name);
                }
                for (var i = 0; i < $rootScope.widget.widgetData.highchartsNG.series.length; i++) {
                    var newObject = {};
                    newObject["id"] = i;

                    newObject[$scope.fieldData[0]] = $rootScope.widget.widgetData.highchartsNG.series[i].name;
                    newObject[$scope.fieldData[1]] = $rootScope.widget.widgetData.highchartsNG.series[i].data[0].x;
                    newObject[$scope.fieldData[2]] = $rootScope.widget.widgetData.highchartsNG.series[i].data[0].y;
                    newObject[$scope.fieldData[3]] = $rootScope.widget.widgetData.highchartsNG.series[i].data[0].z;
                    newTableData.push(newObject);
                }
                $scope.tableData = newTableData;
                $scope.originalList = newTableData;

            } else if ($rootScope.widget.widgetName == "histogram") {
                $scope.fieldData = ["lower_bound", "upper_bound", "value"];
                var newTableData = [];

                for (var i = 0; i < $rootScope.widget.widgetData.highchartsNG.series[0].data.length; i++) {
                    var newObject = {};
                    newObject["id"] = i;
                    newObject["lower_bound"] = $rootScope.widget.widgetData.highchartsNG.xAxis.categories[i][0];
                    newObject["upper_bound"] = $rootScope.widget.widgetData.highchartsNG.xAxis.categories[i][1];
                    newObject["value"] = $rootScope.widget.widgetData.highchartsNG.series[0].data[i];
                    newTableData.push(newObject);
                }
                $scope.tableData = newTableData;
                $scope.originalList = newTableData;
            } else if($rootScope.widget.widgetName == "boxplot") {
                $scope.fieldData = ["Experiment","Maximum" , "Minimum" ,"Q1" , "Q2" , "Q3" ];
                var min,max;
                var data_boxplot = $rootScope.widget.widgetData.highchartsNG.series[0].data;
                var outlier = $rootScope.widget.widgetData.highchartsNG.series[1].data;
                var categories = $rootScope.widget.widgetData.highchartsNG.xAxis.categories;
                var newTableData = [];
                for(var i = 0; i < data_boxplot.length; i++){
                    var newObject = {};
                    newObject["id"] = i;
                    newObject["Experiment"] = categories[i];
                    min = data_boxplot[i][0];
                    newObject["Q1"] = data_boxplot[i][1];
                    newObject["Q2"] = data_boxplot[i][2];
                    newObject["Q3"] = data_boxplot[i][3];                   
                    max = data_boxplot[i][4];

                    for(var j=0; j<outlier.length; j++){
                        if(outlier[j][0] == i){
                            if ( outlier[j][1] < min ){
                                min = outlier[j][1];
                            }
                            if ( outlier[j][1] > max ){
                                max = outlier[j][1];
                            }
                        }
                    }
                    newObject["Minimum"] = min;
                    newObject["Maximum"] = max;
                    newTableData.push(newObject);
                }
                $scope.tableData = newTableData;
                $scope.originalList = newTableData;
            }
            else {
                var query;
                switch ($rootScope.widget.widgetData.uniqueType) {

                    case "Dynamic Visuals":
                        $scope.fieldData = [];
                        if ($rootScope.widget.widgetData.highchartsNG.xAxis !== undefined) {
                            if ($rootScope.widget.widgetData.highchartsNG.xAxis.title !== undefined) {
                                $scope.fieldData[0] = $rootScope.widget.widgetData.highchartsNG.xAxis.title.text;
                            }
                        } else {
                            $scope.fieldData[0] = "label"
                        }
                        $scope.serObj = angular.copy($rootScope.widget.widgetData.highchartsNG.series);
                        angular.forEach($scope.serObj, function(series) {
                            $scope.fieldData.push(series.name);
                            angular.forEach(series.data, function(data) {
                                var tempY = data.y;
                                var tempName = data.name;
                                delete data.y;
                                delete data.name;
                                delete series.color;
                                delete series.id;
                                delete series.origName;
                                data[series.name] = tempY;
                                data[$scope.fieldData[0]] = tempName;
                            });
                            delete series.name;
                        });
                        var temp = {};
                        for (var i = 0; i < $scope.serObj.length - 1; i++) {
                            angular.merge($scope.serObj[i + 1].data, $scope.serObj[i].data, $scope.serObj[i + 1].data);
                        }
                        var data = $scope.serObj[$scope.serObj.length - 1].data;

                        var newTableData = [];
                        for (var i = 0; i < data.length; i++) {
                            var newObject = {};
                            newObject["id"] = i;
                            for (var j = 0; j < $scope.fieldData.length; j++) {
                                if (typeof data[i][$scope.fieldData[j]] == 'number') {
                                    newObject[$scope.fieldData[j]] = (Math.round(data[i][$scope.fieldData[j]] * 100) / 100);
                                } else {
                                    newObject[$scope.fieldData[j]] = data[i][$scope.fieldData[j]];
                                }
                            }
                            newTableData.push(newObject);
                        }
                        $scope.tableData = newTableData;
                        $scope.originalList = newTableData;

                        break;
                    case "Google Maps Branches":
                        break;
                    case "Pivot Summary":
                        $scope.fieldData = [];
                        var newTableData = [];
                        for (var i = 0; i < $rootScope.widget.widgetData.widData.fieldArray.length; i++) {
                            $scope.fieldData.push($rootScope.widget.widgetData.widData.fieldArray[i]);
                        }
                        for (var i = 0; i < $rootScope.widget.widgetData.widData.summary.length; i++) {
                            var newObject = {};
                            newObject["id"] = i;

                            for (var b = 0; b < $scope.fieldData.length; b++) {
                                var field = $scope.fieldData[b];
                                newObject[$scope.fieldData[b]] = $rootScope.widget.widgetData.widData.summary[i][field];
                            }
                            newTableData.push(newObject);

                        }
                        $scope.tableData = newTableData;
                        $scope.originalList = newTableData;
                        break;
                    default:
                        break;
                }
            }

        }

        $scope.updateFilteredList = function(search) {
            $scope.filtered = angular.copy($scope.originalList);
            if (search != "") {
                $scope.filtered.forEach(o => delete o.id)
                $scope.tableData = $filter("filter")($scope.filtered, search);
            } else {
                $scope.tableData = $filter("filter")($scope.filtered, search);
            }
        };

        $scope.downloadPDF = function(ev) {

            $mdDialog.show({
                controller: 'InputNameCtrl',
                templateUrl: 'views/getFileName.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function() {
                if ($rootScope.pdfFilename) {
                    var tableDataString = "";
                    var header = "<thead>";

                    for (var i = 0; i < $scope.fieldData.length; i++) {
                        header += "<th>" + $scope.fieldData[i].toString() + "</th>";
                    }

                    header += "</thead>"
                    tableDataString = "<table>" + header + "<tbody>";

                    for (var i = 0; i < $scope.tableData.length; i++) {
                        console.log($scope.tableData[i]);
                        var rowData = "<tr>";
                        for (var j = 0; j < $scope.fieldData.length; j++) {
                            console.log($scope.tableData[i][$scope.fieldData[j]]);
                            rowData += "<td>" + $scope.tableData[i][$scope.fieldData[j]].toString() + "</td>";
                        }
                        rowData += "</tr>";
                        tableDataString += rowData
                    }

                    tableDataString += "</tbody></table>"

                    var htmlElement = $(".table-area").get(0);
                    var config = {
                        title: $rootScope.pdfFilename,
                        titleLeft: 50,
                        titleTop: 20,
                        tableLeft: 20,
                        tableTop: 30
                    };

                    generatePDF1.generate(htmlElement, config, tableDataString);
                    $rootScope.pdfFilename = "";
                }
            });
        }

        $scope.$watch('tableData', function(newValue, oldValue) {
            if (newValue) {
                $scope.eventHndler.isLoadingChart = false;
            }
        });

        $scope.close = function() {

            $mdDialog.hide();
        };

    }
	
	*/