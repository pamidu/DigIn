DiginApp.controller('gmapsCtrl', ['$scope', '$rootScope', '$mdDialog', '$state', '$http', '$timeout',
    function($scope, $rootScope, $mdDialog, $state, $http, $timeout) {
        $scope.arrAdds = [];
        $scope.arrAdds = [{
            "customerid": "46837",
            "customername": "Maryann Huddleston",
            "total_sales": "93,6698 Rs",
            "add": "Colombo"
        }, {
            "customerid": "23983",
            "customername": "Sointu Savonheimo",
            "total_sales": "80,7523 Rs",
            "add": "Jafna"
        }, {
            "customerid": "32367",
            "customername": "Debbie Molina",
            "total_sales": "29,0392 Rs",
            "add": "Mount Lavinia"
        }, {
            "customerid": "3409",
            "customername": "Anindya Ghatak",
            "total_sales": "15,6281 Rs",
            "add": "Galle"
        }, {
            "customerid": "23742",
            "customername": "Jai Lamble",
            "total_sales": "27, 9327 Rs",
            "add": "Yakkala"
        }, {
            "customerid": "63000",
            "customername": "Radha Barua",
            "total_sales": "16,995 Rs",
            "add": "Matugama"
        }, {
            "customerid": "83280",
            "customername": "Edmee Glissen",
            "total_sales": "31,5608 Rs",
            "add": "Dehiwala"
        }, {
            "customerid": "92868",
            "customername": "Baran Jonsson",
            "total_sales": "54, 0102 Rs",
            "add": "Ratnapura"
        }, {
            "customerid": "22445",
            "customername": "Magdalena Michnova",
            "total_sales": "89, 3444 Rs",
            "add": "Kottawa"
        }, {
            "customerid": "47603",
            "customername": "Chandrashekhar Dasgupta",
            "total_sales": "31, 4401 Rs",
            "add": "Kandy"
        }];


        $scope.setMap = function() {
            $timeout(function() {
                $rootScope.$broadcast('getLocations', {
                    addData: $scope.arrAdds
                });
            })
        }
    }
]);