'use strict';

/* Filters */

angular.module('DiginD3.filters', [])

	.filter('categoryFilter', [function () {
	    return function (charts, category) {
            return charts.filter(function (chart){
            	return !chart.category() && category == 'Others' || chart.category() == category;
            });
	    };
	}]);