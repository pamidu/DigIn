/* use strict */

app.controller('SettingsController', ['$scope', '$rootScope', '$mdDialog', function ($scope, $rootScope, $mdDialog) {

    jsPlumb.setContainer("container");
    //console.log(settings);
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.publish = function () {
        console.log("Save button was clicked.");
    }
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.breadcrumb = function () {
        console.log($rootScope.settings.breadcrumb);
        if ($rootScope.settings.breadcrumb == true) {
            $rootScope.breadcrumb = true;
            sessionStorage.setItem("breadcrumb", true);
        } else {
            $rootScope.breadcrumb = false;
            sessionStorage.setItem("breadcrumb", false);
        };
    };

    $scope.panning = function () {
        if ($rootScope.settings.panning == true) {
            sessionStorage.setItem("panning", $rootScope.settings.panning);
            if ($('#container').panzoom("isDisabled") == true) {
                $('#container').panzoom("enable");
            } else {
                $('#container').panzoom();
            }
        } else if ($rootScope.settings.panning == false) {
            sessionStorage.setItem("panning", $rootScope.settings.panning);
            $('#container').panzoom("disable");
        };
    };

    $scope.zooming = function () {
        if ($rootScope.settings.zooming == true) {
            sessionStorage.setItem("zooming", $rootScope.settings.zooming);
            console.log("zooming enabled");
            var zoom = function () {
                var stage = $(this);
                var scaleData = getZoom(stage);
                console.log(scaleData)
                if (event.wheelDelta < 0) {
                    //Zoom out
                    setZoom(scaleData.curScale * '.9', stage);
                } else if (event.wheelDelta > 1) {
                    //Zoom in
                    setZoom(scaleData.curScale * '1.1', stage);
                }
                return false;
                event.stopPropagation();
            };
            $('#container').bind('mousewheel', zoom);
        } else if ($rootScope.settings.zooming == false) {
            sessionStorage.setItem("zooming", $rootScope.settings.zooming);
            $('#container').unbind('mousewheel', zoom);
        };
    };

    function setZoom(scale, el, instance, transformOrigin) {
        //console.log(scale)
        //Round scales to nearest 10th
        //jsPlumb.setContainer("container");
        scale = Math.round(scale * 10) / 10;
        instance = instance || jsPlumb;
        el = instance.getContainer();
        el.style["transform"] = "scale(" + scale + ")";
        el.style["transformOrigin"] = "100 100";
        //alert(left-scale);
        instance.setZoom(scale);
        instance.repaintEverything();
        resetZoomButton(scale);
    }


    function resetZoomButton(scale) {
        console.log("im");
        if (scale == '1') {
            $rootScope.resetZoom = false;
        } else {
            $rootScope.resetZoom = true;
        };
    }

    $rootScope.resetZoom = false;
    $scope.resetZoom = function () {
        var stage = $(this);
        setZoom(1, stage);

        function setZoom(scale, el, instance, transformOrigin) {
            //console.log(scale)
            //Round scales to nearest 10th
            //jsPlumb.setContainer("container");
            scale = Math.round(scale * 10) / 10;
            instance = instance || jsPlumb;
            el = instance.getContainer();
            el.style["transform"] = "scale(" + scale + ")";
            el.style["transformOrigin"] = "100 100";
            //alert(left-scale);
            instance.setZoom(scale);
            instance.repaintEverything();
            resetZoomButton(scale);
        }

    };

    //Helper to get the current scale factor of the stage
    function getZoom(el) {

        var curZoom = el.css('zoom');
        var curScale = el.css('transform') ||
            el.css('-webkit-transform') ||
            el.css('-moz-transform') ||
            el.css('-o-transform') ||
            el.css('-ms-transform');
        if (curScale === 'none') {
            curScale = 1;
        } else {
            //Parse retarded matrix string into array of values
            var scaleArray = $.parseJSON(curScale.replace(/^\w+\(/, "[").replace(/\)$/, "]"));
            //We only need one of the two scaling components as we are always scaling evenly across both axes
            curScale = scaleArray[0];
        }

        // jsPlumb.repaintEverything();
        return {
            curZoom: curZoom,
            curScale: curScale
        };
    }

    $scope.clickIcon = [];
    for (i = 0; i < 15; i++) {
        $scope.clickIcon[i] = "style";
    }

    $scope.connection = [];
    for (i = 0; i < 15; i++) {
        $scope.connection[i] = "trending_up";
    }


    $scope.clickIconMorph = function (x) {
        console.log(x);
        if (x == 'red') {
            $scope.clickIcon[1] = 'beenhere';
            $scope.themeChanger('red');
        } else {
            $scope.clickIcon[1] = 'style';
        }
        if (x == 'pink') {
            $scope.clickIcon[2] = 'beenhere';
            $scope.themeChanger('pink');
        } else
            $scope.clickIcon[2] = 'style';
        if (x == 'purple') {
            $scope.clickIcon[3] = 'beenhere';
            $scope.themeChanger('purple');
        } else
            $scope.clickIcon[3] = 'style';
        if (x == 'indigo') {
            $scope.clickIcon[4] = 'beenhere';
            $scope.themeChanger('indigo');
        } else
            $scope.clickIcon[4] = 'style';
        if (x == 'blue') {
            $scope.clickIcon[5] = 'beenhere';
            $scope.themeChanger('blue');
        } else
            $scope.clickIcon[5] = 'style';
        if (x == 'cyan') {
            $scope.clickIcon[6] = 'beenhere';
            $scope.themeChanger('cyan');
        } else
            $scope.clickIcon[6] = 'style';
        if (x == 'teal') {
            $scope.clickIcon[7] = 'beenhere';
            $scope.themeChanger('teal');
        } else
            $scope.clickIcon[7] = 'style';
        if (x == 'green') {
            $scope.clickIcon[8] = 'beenhere';
            $scope.themeChanger('green');
        } else
            $scope.clickIcon[8] = 'style';
        if (x == 'lime') {
            $scope.clickIcon[9] = 'beenhere';
            $scope.themeChanger('lime');
        } else
            $scope.clickIcon[9] = 'style';
        if (x == 'yellow') {
            $scope.clickIcon[10] = 'beenhere';
            $scope.themeChanger('yellow');
        } else
            $scope.clickIcon[10] = 'style';
        if (x == 'orange') {
            $scope.clickIcon[11] = 'beenhere';
            $scope.themeChanger('orange');
        } else
            $scope.clickIcon[11] = 'style';
        if (x == 'brown') {
            $scope.clickIcon[12] = 'beenhere';
            $scope.themeChanger('brown');
        } else
            $scope.clickIcon[12] = 'style';
    };


    //dynamic themeing
    $scope.theme = sessionStorage.cur_theme || 'default';
    $scope.themeList = ThemeService();
    console.log('Current Theme', $scope.theme);
    $scope.themeChanger = function (value) {
        console.log(value);
        if (value != undefined) {
            $scope.theme = value + '-theme';
            sessionStorage.setItem("cur_theme", $scope.theme);
            console.log('Changed theme', $scope.theme, value);
            $rootScope.changeColor();
            $rootScope.changeColorMain();

        }
    };

    $scope.changeCStyle = function (x) {
        if (x == 1) {
            $scope.connection[1] = 'launch';
            $rootScope.changeConStyle(1);
            console.log("calling 1");
        } else {
            $scope.connection[1] = 'trending_up';
        }
        if (x == 2) {
            $scope.connection[2] = 'launch';
            $rootScope.changeConStyle(2);
            console.log("calling 2");
        } else {
            $scope.connection[2] = 'trending_up';
        }
        if (x == 3) {
            $scope.connection[3] = 'launch';
            $rootScope.changeConStyle(3);
            console.log("calling 3");
        } else {
            $scope.connection[3] = 'trending_up';
        }
    }

    }]);
