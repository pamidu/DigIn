// Services for chart functionalities
routerApp.service('chartServices',function() {
	// Apply colour settings for metruc widget
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
	                selectedChart.initObj.color = "yellow"
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

})