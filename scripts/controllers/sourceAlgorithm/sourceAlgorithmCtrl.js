/**
 * Created by Damith on 3/4/2016.
 */

routerApp.controller('sourceAlgorithmCtrl', function ($scope) {

    var mainFunEventHandler = (function () {
        return {}
    })();

    //#event
    var eventHandler = {
        isToggleHeader: false,
        isToggleRight: false,
        currentSelectedTool: {
            name: '',
            isAnalysis: false,
            isDataTool: false,
            isExport:false

        },
        clearAllSelectedTool: function () {
            this.currentSelectedTool.name = '';
            this.currentSelectedTool.isAnalysis = false;
            this.currentSelectedTool.isDataTool = false;
            this.currentSelectedTool.isExport = false;
        },
        onClickBack: function () {
            alert('event fire');
        },
        select2Options: {
            formatNoMatches: function (term) {
                var message = '<a ng-click="addTag()">Add tag:"' + term + '"</a>';
                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.noResultsTag = term;
                    });
                }
                return message;
            }
        },
        HeaderClick: function () {
            this.toggleOpen('1');
        },
        toggleOpen: function (openWindow) {
            $("#toggleTblHeader").hide(200);
            $("#toggleRightPanel").hide(200);
            switch (openWindow) {
                case '1':
                    if (this.isToggleHeader) {
                        $("#toggleTblHeader").hide(200);
                        $scope.eventHandler.isToggleHeader = false;
                    } else {
                        $("#toggleTblHeader").show(300);
                        this.isToggleHeader = true;
                    }
                    break;
                case '2':
                    if (this.isToggleRight) {
                        $("#toggleRightPanel").hide(200);
                        $scope.eventHandler.isToggleRight = false;
                    } else {
                        $("#toggleRightPanel").slideToggle(300);
                        this.isToggleRight = true;
                    }
                    break;
            }
        },
        closeToggleOpen: function (openWindow) {

            switch (openWindow) {
                case '1':
                    $("#toggleTblHeader").hide(200);
                    $scope.eventHandler.isToggleHeader = false;
                    break;
                case '2':
                    $("#toggleRightPanel").hide(200);
                    $scope.eventHandler.isToggleRight = false;
            }
        },
        onClickTool: function (tool) {
            this.clearAllSelectedTool();
            switch (tool) {
                case 'analysis':
                    this.currentSelectedTool.name = 'Analysis';
                    this.currentSelectedTool.isAnalysis = true;
                    break;
                case 'dataTool':
                    this.currentSelectedTool.name = 'Data Tool';
                    this.currentSelectedTool.isDataTool = true;
                    break;
                case 'export':
                    this.currentSelectedTool.name = 'Export';
                    this.currentSelectedTool.isExport = true;
                    break;
            }
            this.toggleOpen('2');
        }
    };
    $scope.eventHandler = eventHandler;

    //#source
    var source = {
        series: [
            {id: 0, name: "SKY", selected: true},
            {id: 1, name: "SKY2", selected: true}
        ],
        categories: [
            {id: 0, name: "SKY3", selected: true},
            {id: 1, name: "SKY4", selected: true}
        ]
    };
    $scope.source = source;


    $scope.$watch('noResultsTag', function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
            $timeout(function () {
                var noResultsLink = $('.select2-no-results');
                console.log(noResultsLink.contents());
                $compile(noResultsLink.contents())($scope);
            });
        }
    }, true);
});
