////////////////////////////////
// File : metricChartServices
// Owner  : Dilani
// Last changed date : 2017/01/03
// Version : 3.1.0.2
// Modified By : Dilani
////////////////////////////////

// Services for chart functionalities
routerApp.service('metricChartServices',function($filter) {
	// Apply colour settings for metric widget
	this.applyMetricSettings = function(selectedChart) {
	    if (typeof selectedChart.initObj.value != "number") var value = parseInt(selectedChart.initObj.value.replace(/,/g,''));
	    var highRange = selectedChart.initObj.targetValue * selectedChart.initObj.rangeSliderOptions.maxValue / 100;
	    var lowerRange = selectedChart.initObj.targetValue * selectedChart.initObj.rangeSliderOptions.minValue / 100;
	    if (value <= lowerRange) {
	        if (selectedChart.initObj.colorTheme == "rog") {
	            if (selectedChart.initObj.targetRange == "high") {
	                selectedChart.initObj.color = "red"
	            } else {
	                selectedChart.initObj.color = "green"
	            }
	        } else if (selectedChart.initObj.colorTheme == "cgy") {
	            if (selectedChart.initObj.targetRange == "high") {
	                selectedChart.initObj.color = "cyan"
	            } else {
	                selectedChart.initObj.color = "yellowgreen"
	            }
	        } else if (selectedChart.initObj.colorTheme == "opg") {
	            if (selectedChart.initObj.targetRange == "high") {
	                selectedChart.initObj.color = "orange"
	            } else {
	                selectedChart.initObj.color = "green"
	            }
	        }
	    } else if (value >= highRange) {
	        if (selectedChart.initObj.colorTheme == "rog") {
	            if (selectedChart.initObj.targetRange == "high") {
	                selectedChart.initObj.color = "green"
	            } else {
	                selectedChart.initObj.color = "red"
	            }
	        } else if (selectedChart.initObj.colorTheme == "cgy") {
	            if (selectedChart.initObj.targetRange == "high") {
	                selectedChart.initObj.color = "yellowgreen"
	            } else {
	                selectedChart.initObj.color = "cyan"
	            }                    
	        } else if (selectedChart.initObj.colorTheme == "opg") {
	            if (selectedChart.initObj.targetRange == "high") {
	                selectedChart.initObj.color = "green"
	            } else {
	                selectedChart.initObj.color = "orange"
	            }
	        }
	    } else {
	        if (selectedChart.initObj.colorTheme == "rog") {
	            selectedChart.initObj.color = "orange"
	        } else if (selectedChart.initObj.colorTheme == "cgy") {
	            selectedChart.initObj.color = "green"
	        } else if (selectedChart.initObj.colorTheme == "opg") {
	            selectedChart.initObj.color = "purple"
	        }
	    }
	}

	this.mapMetricTrendChart = function(selectedChart,namespace,trendValue){
		var seriesData = [];
        var tempArr = [];
        angular.forEach(trendValue,function(key){
            var utc = moment(key[selectedChart.initObj.groupByField]).utc().valueOf();
            tempArr = [utc,key[namespace]];
            seriesData.push(tempArr);
        });
        if (selectedChart.initObj.timeAttribute == 'quarter') {
            units = [['month',[3]]];
        } else {
            units = [[selectedChart.initObj.timeAttribute,[1]]];
        }
        selectedChart.initObj.trendChart.series = [{
            color: 'black',
            data: seriesData,
            dataGrouping: {
                approximation: "sum",
                enabled: true,
                forced: true,
                units: units
            },
            turboThreshold: 0,
            cropThreshold: trendValue.length
        }]
	}

})