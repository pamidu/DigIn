var app = angular.module('dashApp',['ngMaterial','uiMicrokernel','highcharts-ng','FBAngular']);

app.controller('mainCtrl',function($scope,DashboardModel,Fullscreen){


    $scope.toggleFullScreen = function(state) {
        state = !state;
    }
});

