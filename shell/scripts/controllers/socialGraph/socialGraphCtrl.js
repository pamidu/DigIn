/* Summary:
 note: some of the scope variables are initialized inside fbInterface
 */

routerApp.controller('socialGraphCtrl', function ($scope,$sce,fbUrl) {

    $scope.fbUrl = $sce.trustAsResourceUrl(fbUrl);
});


function viewMapTableCtrl($scope, $mdDialog, dataAry, pageName) {
    $scope.mapTblData = dataAry;
    $scope.closeDialog = function () {
        $mdDialog.hide();
    }
}

function singlePostCtrl($scope, fbPost) {
    $scope.myPost = fbPost;
};

function viewTableCtrl($scope, $mdDialog, jsonData, pageName) {
    $scope.tableData = jsonData;
    $scope.pageName = pageName;

    var cvtUnixToDate = function (unix) {
        return moment(unix).format('LL');
    }

    var pageAnalysis = {
        isLoading: false,
        analysis: []
    };

    $scope.analysis = {};
    for (var i = 0; i < jsonData.length; i++) {
        $scope.analysis[jsonData[i].name] = {
            name: [],
            tot: [],
            data: []
        };
        $scope.analysis[jsonData[i].name].name.push(jsonData[i].name);

        var tot = 0;

        for (var c = 0; c < jsonData[i].data.length; c++) {
            var jsonObj = {
                'date': '',
                'like': ''
            };
            for (var b = 0; b < jsonData[i].data[c].length; b++) {
                if (b == 0) {
                    //date
                    var date = jsonData[i].data[c][b];
                    jsonObj.date = cvtUnixToDate(date);

                }
                if (b == 1) {
                    //like
                    var like = jsonData[i].data[c][b];
                    jsonObj.like = like;
                    tot = like;
                }
            }
            $scope.analysis[jsonData[i].name].data.push(jsonObj);
        }
        $scope.analysis[jsonData[i].name].tot.push(tot);
    }

    $scope.pageViewDta = [];
    for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i].name == 'Page Likes') {
            $scope.pageViewDta = $scope.analysis[jsonData[i].name].data;
        }
    }

    $scope.viewTypes = [{
        name: 'Page Likes',
        value: 'l1'
    }, {
        name: 'Page Stories',
        value: 's2'
    }, {
        name: 'Page  Views',
        value: 'v3'
    }];

    $scope.tblType = 'l1';
    $scope.selectTypeName = 'Page Likes';
    $scope.onChangeTblView = function (type) {
        var updatedNeed = $scope.tblType;
        $scope.pageViewDta = [];
        switch (updatedNeed) {
            case 'l1':
                $scope.selectTypeName = 'Page Likes';
                for (var i = 0; i < jsonData.length; i++) {
                    if (jsonData[i].name == 'Page Likes') {
                        $scope.pageViewDta = $scope.analysis[jsonData[i].name].data;
                    }
                }
                break;
            case 's2':
                $scope.selectTypeName = 'Page Stories';
                for (var i = 0; i < jsonData.length; i++) {
                    if (jsonData[i].name == 'Page Stories') {
                        $scope.pageViewDta = $scope.analysis[jsonData[i].name].data;
                    }
                }
                break;
            case 'v3':
                $scope.selectTypeName = 'Page  Views';
                for (var i = 0; i < jsonData.length; i++) {
                    if (jsonData[i].name == 'Page Views') {
                        $scope.pageViewDta = $scope.analysis[jsonData[i].name].data;
                    }
                }
                break;
            default:
                break;
        }
    };


    $scope.closeDialog = function () {
        $mdDialog.hide();
    }
};


//onScroll change table hader
routerApp.directive("fixOnScroll", function () {
    return function (scope, element, attrs) {
        var fixedDiv = attrs.fixedDiv;
        element.bind("scroll", function () {
            if (element.scrollLeft()) {
                var leftPos = element.scrollLeft();
                $(fixedDiv).scrollLeft(leftPos);
            }
        });
    }
}).directive('datep', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: 'MM d, yy',
                changeMonth: true,
                changeYear: true,
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    }
});