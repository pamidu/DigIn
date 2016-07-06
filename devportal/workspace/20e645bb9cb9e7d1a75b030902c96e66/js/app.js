/* use strict */

var app = angular.module('processdesigner', [
  'ui.router',
  'ngMaterial',
  'ngMdIcons',
  'ngAnimate',
  'ngScrollbars',
  'uiMicrokernel',
    'ngSanitize',
    'angular.filter',
    'ngCsv',
    'ngFileUpload'
  ]);

d_color = sessionStorage.getItem("color") || "blue";

Config.$inject = ['$mdThemingProvider'];

function Config($mdThemingProvider) {

    // Create the other theme options
    var themes = ThemeService();
    for (var index = 0; index < themes.length; ++index) {
        //console.log(themes[index] + '-theme');

        $mdThemingProvider.theme(themes[index] + '-theme')
            .primaryPalette(themes[index]);
    }

    $mdThemingProvider.alwaysWatchTheme(true);

};

app.config(Config);

function ThemeService() {
    var themes = [
      'red',
      'pink',
      'purple',
      'deep-purple',
      'indigo',
      'blue',
      'light-blue',
      'cyan',
      'teal',
      'green',
      'light-green',
      'lime',
      'yellow',
      'amber',
      'orange',
      'deep-orange',
      'brown',
      'grey',
      'blue-grey'
    ];

    return themes;
}


app.controller('mainController', ['$scope', '$rootScope', '$http', '$mdDialog', '$mdToast', '$animate', '$mdBottomSheet', '$mdSidenav', 'dataHandler', '$state', '$interval', '$timeout', '$auth', '$objectstore', '$v6urls', function ($scope, $rootScope, $http, $mdDialog, $mdToast, $animate, $mdBottomSheet, $mdSidenav, dataHandler, $state, $interval, $timeout, $auth, $objectstore, $v6urls) {

    console.log("Starting controller")
    var session = $auth.checkSession();

    $scope.SessionDetails = $auth.getSession();
    console.log("Session Details: ");
    console.log($scope.SessionDetails);

    function module(library_id, schema_id, parentView, name, description, x, y, icon, variables, type, category, controldisabled, endpoints, targetendpoints, otherdata, annotation, displayname, author) {
        this.library_id = library_id,
            this.schema_id = schema_id,
            this.parentView = parentView,
            this.Name = name,
            this.Icon = icon,
            this.Description = description,
            this.Variables = variables,
            this.Type = type,
            this.Category = category,
            this.X = x,
            this.Y = y,
            this.ControlEditDisabled = controldisabled,
            this.SourceEndpoints = endpoints,
            this.TargetEndpoints = targetendpoints,
            this.OtherData = otherdata,
            this.Annotation = annotation,
            this.DisplayName = displayname
    }

    $scope.currentstate = "";
    $scope.allowAddManualConnections = true;
    $scope.allowDetachManualConnections = true;

    $scope.changeState = function (Tostate) {
        var currentState = $state.current.name;
        if (Tostate != currentState) {
            var setdata = $scope.getSaveJsonForState(currentState);
            $scope.allowDetachManualConnections = false;
            jsPlumb.reset();
            $scope.jsplumbInitiate();
            //jsPlumb.repaintEverything();
            $scope.allowDetachManualConnections = true;
            if (setdata != null) {
                dataHandler.setFlowObject(setdata);
            }
            $state.transitionTo(Tostate);
            $scope.createBreadcrumb(Tostate);
        }
    };

    $scope.saveStateData = function () {
        var currentState = $state.current.name;
        var setdata = $scope.getSaveJsonForState(currentState);
        if (setdata != null) {
            dataHandler.setFlowObject(setdata);
        }
        console.log(currentState, setdata);
    };

    $scope.$on('uiStateChanged', function (event, data) {
        if (dataHandler.getCurrentState() != data.stateName) {
            dataHandler.setCurrentState(data.stateName);
            console.log('Broadcast recived:', data);
            $scope.getFlowDataForState($state.current.name);
        }
    });

    $scope.getSaveJsonForState = function (state) {

        var nodes = [];

        var statenodes = dataHandler.getNodesForState(state);
        $.each(statenodes, function (idx, elem) {
            var element = document.getElementById(elem.schema_id);
            var endpoints = jsPlumb.getEndpoints(element);

            var offset = $('#container').offset();
            var stage = $('#container');
            var scaleData = getZoom(stage);
            var zoom = scaleData.curScale;
            elem.X = element.style.left.substring(0, element.style.left.length - 2);
            console.log(elem.X);
            elem.X = elem.X * zoom;
            elem.X = parseInt(elem.X) + parseInt(offset.left);
            //console.log(offset.left,elem.X);

            elem.Y = element.style.top.substring(0, element.style.top.length - 2);
            elem.Y = elem.Y * zoom;
            elem.Y = parseInt(elem.Y) + parseInt(offset.top);

            //jsPlumb.repaintEverything();
            nodes.push(elem);
            console.log(elem.X, elem.Y, zoom, offset.left);
        });

        var plumbConnections = dataHandler.getConnectionsForState(state);

        var flowChart = {};
        flowChart.nodes = nodes;
        flowChart.connections = plumbConnections;

        return flowChart;
    };

    $scope.getTargetEndpointUUID = function (id) {
        var returnValue = "";
        var endpoints = jsPlumb.getEndpoints(id);
        $.each(endpoints, function (idx, conendpnt) {
            if (conendpnt.anchor.type == "TopCenter") {
                returnValue = conendpnt.getUuid();
            }
        });
        return returnValue;
    };

    $scope.ShowBusyContainer = function (message) {
        document.getElementById("loading").style.display = "flex";
        var element = document.getElementById("busycontent");
        element.innerHTML = "<p>" + message + "</p>";
    }

    $scope.HideBusyContainer = function () {
        document.getElementById("loading").style.display = "none";
    }

    $scope.processConnections = function () {
        var plumbConnections = dataHandler.getConnectionsForState($state.current.name);
        $.each(plumbConnections, function (idx, connection) {
            var sourcemoduleObj = dataHandler.getModuleByID(connection.sourceId);
            var targetmoduleObj = dataHandler.getModuleByID(connection.targetId);
            var sourceUUID = "",
                targetUUID = "";

            if (sourcemoduleObj.library_id == "2") {
                var data = $.inArray(connection.sourceId, $scope.GlobalExecutedIfs);
                if (data == -1) {

                    var ifcondition = $scope.getIfConditionByID(connection.sourceId);
                    var sourceUUIDleft = dataHandler.getEndpointsForItem(connection.sourceId, "source", "left");
                    $scope.addConnection(connection.id, connection.sourceId, connection.targetId, sourceUUIDleft, ifcondition.falseUUID);

                    var sourceUUIDright = dataHandler.getEndpointsForItem(connection.sourceId, "source", "right");
                    $scope.addConnection(connection.id, connection.sourceId, connection.targetId, sourceUUIDright, ifcondition.trueUUID);
                    $scope.GlobalExecutedIfs.push(connection.sourceId);

                }
            } else {
                sourceUUID = dataHandler.getEndpointsForItem(connection.sourceId, "source", "default");
                targetUUID = dataHandler.getEndpointsForItem(connection.targetId, "target", "default");

                $scope.addConnection(connection.id, connection.sourceId, connection.targetId, sourceUUID, targetUUID);
            }
        });
    }

    $scope.addConnection = function (connectionid, sourceId, targetId, sourceUUID, targetUUID) {
        $('#container').panzoom("disable");
        var connObj = {
            id: connectionid,
            sourceId: sourceId,
            targetId: targetId,
            sourceUUID: sourceUUID,
            targetUUID: targetUUID,
            parentView: $state.current.name
        };
        dataHandler.addtoConnections(connObj);

    }

    $scope.getIfConditionByID = function (id) {
        var returnObj;
        for (var i = 0; i < GlobalIfConditions.length; i++) {
            if (GlobalIfConditions[i].id == id) {
                returnObj = GlobalIfConditions[i];
                break;
            }
        }
        return returnObj;
    };

    $scope.testMethod = function (text) {
        var obj = dataHandler.sayHello(text);
        alert(obj.name);
    }

    $scope.changeserviceData = function (text) {
        var obj = dataHandler.changeData(text);
        alert(obj.name);
    }

    $scope.addDynamicState = function () {
        /*app.stateProvider.state('other', {
                url: "/other",
                templateUrl: "partials/drawbox.html"
            });*/
        alert("internal function called.");
    }

    $scope.scrollbarconfig = {
        autoHideScrollbar: false,
        theme: 'minimal-dark',
        advanced: {
            updateOnContentResize: true
        },
        scrollInertia: 300
    }

    $scope.navscrollbarconfig = {
        autoHideScrollbar: false,
        theme: 'minimal-dark',
        advanced: {
            updateOnContentResize: true
        },
        scrollInertia: 300
    }

    $('#era').mCustomScrollbar({
        theme: "dark-3"
    });


    $scope.displayToolbox = true;
    $scope.loadedProcessObj = null;
    $scope.library = [];
    $scope.library_uuid = 0;
    $scope.schema_uuid = 0;
    $scope.library_topleft = {
        x: 15,
        y: 145,
        item_height: 50,
        margin: 5,
    };

    $scope.module_css = {
        width: 150,
        height: 100, // actually variable
    };

    $scope.activitylist = [];
    $scope.userlist = [];

    $scope.pmbendpoints = [];

    $scope.GlobalConnections = [];
    $scope.GlobalIfConditions = [];
    $scope.GlobalExecutedIfs = [];

    /*$scope.connectiontypeObj = ["Flowchart", {
        stub: [20, 30],
        gap: 3,
        cornerRadius: 5,
        alwaysRespectStubs: true
    }];*/

    $scope.current_con_style = sessionStorage.getItem("ccs");
    $scope.connectiontypeObj = $scope.current_con_style || ["Straight", {
        stub: [20, 30],
        gap: 3
    }];
    //console.log($scope.connctiontypeobj);
    $rootScope.changeConStyle = function (val) {
        if (val == 1) {
            $scope.connectiontypeObj = ["Straight", {
                stub: [20, 30],
                gap: 3
            }];
            $scope.ccs = $scope.connectiontypeObj;
            sessionStorage.setItem("ccs", $scope.ccs);
            console.log($scope.connectiontypeObj);
        } else if (val == 2) {
            console.log("2");
            $scope.connectiontypeObj = ["StateMachine", {
                curviness: 600,
                margin: 20,
                proximityLimit: 90
            }];
            $scope.ccs = $scope.connectiontypeObj;
            sessionStorage.setItem("ccs", $scope.ccs);
        } else if (val == 3) {
            console.log("3");
            $scope.connectiontypeObj = ["Bezier ", {
                curviness: 60
            }];
            $scope.ccs = $scope.connectiontypeObj;
            sessionStorage.setItem("ccs", $scope.ccs);
        }
    };

    //$scope.connectiontypeObj = [ "StateMachine", { curviness:600, margin:20, proximityLimit:90 } ];
    //$scope.connectiontypeObj = [ "Bezier ", { curviness:60 } ];


    $scope.data = {
        selectedIndex: 0,
        secondLocked: true,
        secondLabel: "Item Two"
    };
    $scope.next = function () {
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
    };
    $scope.previous = function () {
        $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };


    $scope.getIfStyle = function (id) {
        var controlstyle;

        if (id == 0) {
            controlstyle = {
                endpoint: "Dot",
                paintStyle: {
                    strokeStyle: "grey",
                    fillStyle: "transparent",
                    radius: 7,
                    lineWidth: 3
                },
                isSource: true,
                connector: $scope.connectiontypeObj,
                connectorStyle: $scope.connectorPaintStyle,
                hoverPaintStyle: $scope.endpointHoverStyle,
                connectorHoverStyle: $scope.connectorHoverStyle,
                dragOptions: {},
                overlays: [
            ["Label", {
                        location: [1.5, 1.5],
                        label: "True",
                        cssClass: "endpointSourceLabel"
              }]
          ]
            };
        }

        if (id == 1) {
            controlstyle = {
                endpoint: "Dot",
                paintStyle: {
                    strokeStyle: "grey",
                    fillStyle: "transparent",
                    radius: 7,
                    lineWidth: 3
                },
                isSource: true,
                connector: $scope.connectiontypeObj,
                connectorStyle: $scope.connectorPaintStyle,
                hoverPaintStyle: $scope.endpointHoverStyle,
                connectorHoverStyle: $scope.connectorHoverStyle,
                dragOptions: {},
                overlays: [
            ["Label", {
                        location: [-0.5, 1.5],
                        label: "False",
                        cssClass: "endpointSourceLabel"
              }]
          ]
            };
        }

        return controlstyle;
    };

    $scope.endpointHoverStyle = {
        fillStyle: "#22A7F0",
        strokeStyle: "#22A7F0"
    };

    $scope.connectorHoverStyle = {
        lineWidth: 4,
        strokeStyle: "#61B7CF",
        outlineWidth: 2,
        outlineColor: "white"
    };

    $scope.connectorPaintStyle = {
        lineWidth: 2,
        strokeStyle: "grey",
        joinstyle: "round",
        outlineColor: "white",
        outlineWidth: 2
    };

    $scope.defaultStyleSource = {
        endpoint: "Dot",
        paintStyle: {
            strokeStyle: "grey",
            fillStyle: "transparent",
            radius: 7,
            lineWidth: 3
        },
        isSource: true,
        connector: $scope.connectiontypeObj,
        connectorStyle: $scope.connectorPaintStyle,
        hoverPaintStyle: $scope.endpointHoverStyle,
        connectorHoverStyle: $scope.connectorHoverStyle,
        dragOptions: {},
    };

    $scope.defaultStyleTarget = {
        endpoint: "Dot",
        paintStyle: {
            fillStyle: "grey",
            radius: 11
        },
        hoverPaintStyle: $scope.endpointHoverStyle,
        maxConnections: -1,
        dropOptions: {
            hoverClass: "hover",
            activeClass: "active"
        },
        isTarget: true
    };

    $scope.selectedModule = null;

    $scope.redraw = function () {
        console.log("-- Redraw function executed");
        $scope.schema_uuid = 0;
        jsPlumb.detachEveryConnection();
        dataHandler.resetFactory();
        $scope.library = [];
        $scope.activitylist = [];
        $scope.userlist = [];

        $http({
            url: "./json/controldata.json",
            dataType: "json",
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
                "Content-Type": "text/json"
            }
        }).success(
            function (response) {
                console.log("");
                console.log("Control JSON Received : ");
                console.log(response);
                for (var i = 0; i < response.Controls.length; i++) {
                    var control = response.Controls[i];
                    /*var obj = {
                        "Key": "Display Name",
                        "Value": "{{selectedModule.Name}}",
                        "Type": "Textbox"
                    }
                    control.Variables.push(obj);*/

                    $scope.addModuleToLibrary(control);
                    //console.log(control);

                }
            }).error(function (e) {
            console.log(e);
        });

        $scope.getallActivities();
        //$scope.getallUsers();
    };


    $scope.getallActivities = function () {
        $scope.activitylist = null;
        var client = $objectstore.getClient("process_activities");
        client.onGetMany(function (data) {
            if (data) {
                console.log("");
                console.log("Activity JSON Received : ");
                console.log(data);
                $scope.activitylist = data;
                for (i = 0; i < $scope.activitylist.length; i++) {
                    for (j = 0; j < $scope.library.length; j++) {
                        if ($scope.library[j].library_id == $scope.activitylist[i].library_id) {
                            $scope.library.splice(j, 1);
                        };
                    };
                    $scope.library.push($scope.activitylist[i]);
                };
                //Fmenuconsole.log($scope.library);
            }
        });
        client.getByFiltering("*");

    };

    /*$scope.getallUsers = function () {
        $scope.userlist = null;
        var templist = [];
        var client = $objectstore.getClient("com.duosoftware.auth", "users", true);
        client.onGetMany(function (data) {
            if (data) {
                console.log("");
                console.log("User JSON Received : ");
                console.log(data);

                $.each(data, function (idx, user) {
                    if (user.UserID != "" && user.Name != "") {
                        var schema_id = $scope.createuuid();
                        var control = {
                            "library_id": user.UserID,
                            "Name": user.Name,
                            "Description": user.EmailAddress,
                            "Icon": "person",
                            "Variables": [],
                            "Type": "user",
                            "Category": "flowcontrol",
                            "ControlEditDisabled": false,
                            "SourceEndpoints": [{
                                "id": 0,
                                "location": "BottomCenter"
                            }],
                            "TargetEndpoints": [{
                                "id": 0,
                                "location": "TopCenter"
                            }],
                            "OtherData": {}
                        }
                        var m = $scope.createNewModule(schema_id, 0, 0, control, $state.current.name);
                        templist.push(m);
                    }
                });
                $scope.userlist = templist;
            }
        });
        client.getByFiltering("*");
    }*/

    // add a module to the library
    $scope.addModuleToLibrary = function (module) {
        //console.log("Add module " + module.Name + " to library, at position " + module.X + "," + module.Y + ", variables: " + module.Variables.length + " Type: " + module.Type);
        var library_id = $scope.library_uuid++;
        var schema_id = -1;
        module.schema_id = schema_id;
        $scope.library.push(module);
    };



    // add a module to the schema
    $scope.addModuleToSchema = function (library_id, posX, posY) {
        var schema_id = $scope.createuuid();
        var control;
        for (var i = 0; i < $scope.library.length; i++) {
            if ($scope.library[i].library_id == library_id) {
                control = angular.copy($scope.library[i]);
                break;
            }
        }
        if (angular.isUndefined(control)) {
            for (var i = 0; i < $scope.activitylist.length; i++) {
                if ($scope.activitylist[i].library_id == library_id) {
                    control = angular.copy($scope.activitylist[i]);
                }
            }
        }
        var m = $scope.createNewModule(schema_id, posX, posY, control, $state.current.name);
        dataHandler.addtoNodes(m);
    };



    $scope.addModuletoUI = function (library_id, posX, posY, data, jsPlumbInstance, loadingType) {

        var schema_id;
        var control;

        if (loadingType == "external") {
            schema_id = data.schema_id;
            control = data;
        } else if (loadingType == "internal") {
            schema_id = $scope.createuuid();
            for (var i = 0; i < $scope.library.length; i++) {
                if ($scope.library[i].library_id == library_id) {
                    control = angular.copy($scope.library[i]);
                    break;
                }
            }
            if (angular.isUndefined(control)) {
                for (var i = 0; i < $scope.activitylist.length; i++) {
                    if ($scope.activitylist[i].library_id == library_id) {
                        control = angular.copy($scope.activitylist[i]);
                        break;
                    }
                }
                for (var i = 0; i < $scope.userlist.length; i++) {
                    if ($scope.userlist[i].library_id == library_id) {
                        control = angular.copy($scope.userlist[i]);
                        break;
                    }
                }
            }
        }



        var output = document.getElementById('container');
        var element = document.createElement("div");
        var eleTitle = document.createElement("div");
        var ele2 = document.createElement("label");

        var eleIcon = document.createElement("md-icon");
        // var eleIcon = document.createElement("ng-md-icon");
        var eleAnnotaion = document.createElement("md-icon");
        //var eleBreak = document.createElement("br");
        //var eleAnnotationDetail = document.createElement("label");

        var eleTrue = document.createElement("md-icon");
        var eleFalse = document.createElement("md-icon");
        var eleForeach = document.createElement("div");

        element.setAttribute("id", schema_id);
        element.setAttribute("class", "item " + control.Type);
        element.setAttribute("style", "left:0px ; top: 10px");

        eleIcon.setAttribute("class", control.Icon);
        eleIcon.setAttribute("style", "height:100% !important");
        //eleIcon.setAttribute("size","15");
        //eleIcon.setAttribute("class","toolheader");

        eleAnnotaion.setAttribute("class", "ion-information-circled");
        eleAnnotaion.setAttribute("style", "display: inline-block !important;color:green;height: 18px;");
        //eleAnnotaion.setAttribute("ng-init", "show = false");
        //eleAnnotationDetail.setAttribute("ng-if", "show");
        //eleAnnotationDetail.innerHTML = control.Name;

        eleTitle.setAttribute("class", "title");
        //control.Name = "{{selectedModule.Name}}";
        eleTitle.innerHTML = control.DisplayName;
        if (control.library_id == "2") {
            var truesideUUID = "";
            var falsesideUUID = "";
            if (control.OtherData.TrueStateUUID != "" && control.OtherData.FalseStateUUID != "") {
                truesideUUID = control.OtherData.TrueStateUUID;
                falsesideUUID = control.OtherData.FalseStateUUID;
            } else {
                truesideUUID = $scope.createuuid();
                falsesideUUID = $scope.createuuid();
                control.OtherData.TrueStateUUID = truesideUUID;
                control.OtherData.FalseStateUUID = falsesideUUID;
            }
            dataHandler.addState(truesideUUID, $state);
            dataHandler.addState(falsesideUUID, $state);

            dataHandler.addToViews(truesideUUID);
            dataHandler.addToViews(falsesideUUID);

            var ifconnectionObj = {
                id: schema_id,
                "true": truesideUUID,
                "false": falsesideUUID
            };
            dataHandler.addtoIfConnections(ifconnectionObj);

            eleTrue.setAttribute("id", truesideUUID);
            eleTrue.setAttribute("class", "ion-checkmark-circled");
            eleTrue.setAttribute("style", "font-size:20px;color:white;");

            eleFalse.setAttribute("id", falsesideUUID);
            eleFalse.setAttribute("class", "ion-close-circled");
            eleFalse.setAttribute("style", "font-size:20px;color:white;");

            element.appendChild(eleFalse);
            element.appendChild(eleIcon);
            element.appendChild(eleTitle);
            element.appendChild(eleAnnotaion);
            element.appendChild(eleTrue);
            //element.appendChild(eleAnnotaion);
            //element.appendChild(eleAnnotationDetail);

            $(eleTrue).bind('click', moduleObj, function (event) {
                $scope.changeState(truesideUUID);
            });

            $(eleFalse).bind('click', moduleObj, function (event) {
                $scope.changeState(falsesideUUID);
            });

            $(eleAnnotaion).hover(
                function () {
                    $(this).append($("<div style='background-color:rgba(240, 248, 255, 0.78); padding:2px; border:solid 1px black;    box-shadow: 0px 0px 10px #aaa; width:250px;z-index:100;'>" + control.Annotation + "</div>"));
                },
                function () {
                    $(this).find("div:last").remove();
                }
            );

        } else if (control.library_id == "5") {
            var foreachUUID = "";
            if (control.OtherData.ForeachUUID != "") {
                foreachUUID = control.OtherData.ForeachUUID;
            } else {
                foreachUUID = $scope.createuuid();
                control.OtherData.ForeachUUID = foreachUUID;
            }

            dataHandler.addState(foreachUUID, $state);
            dataHandler.addToViews(foreachUUID);
            eleForeach.setAttribute("id", foreachUUID);
            eleForeach.setAttribute("class", "connect");

            element.appendChild(eleIcon);
            element.appendChild(eleTitle);
            element.appendChild(eleAnnotaion);
            element.appendChild(eleForeach);

            $(eleForeach).bind('click', moduleObj, function (event) {
                $scope.changeState(foreachUUID);
            });

            $(eleAnnotaion).hover(
                function () {
                    $(this).append($("<div style='background-color:rgba(240, 248, 255, 0.78); padding:2px; border:solid 1px black;    box-shadow: 0px 0px 10px #aaa; width:250px;z-index:100;'>" + control.Annotation + "</div>"));
                },
                function () {
                    $(this).find("div:last").remove();
                }
            );


            var forloop = {
                id: schema_id,
                "forloopState": foreachUUID,
            };
            dataHandler.addtoForloop(forloop);

        } else {
            element.appendChild(eleIcon);
            element.appendChild(eleTitle);

            if (control.ControlEditDisabled == false) {

                element.appendChild(eleAnnotaion);
                $(eleAnnotaion).hover(
                    function () {
                        $(this).append($("<div style='background-color:rgba(240, 248, 255, 0.78); padding:2px; border:solid 1px black;    box-shadow: 0px 0px 10px #aaa; width:250px;z-index:100;'>" + control.Annotation + "</div>"));
                    },
                    function () {
                        $(this).find("div:last").remove();
                    }
                );
            }
        }

        if (control.Annotation == "") {
            $(eleAnnotaion).hide();
        } else {
            $(eleAnnotaion).show();
        };

        output.appendChild(element);

        var tempObj = document.getElementById(schema_id);
        var offset = $('#container').offset();
        var stage = $(this);
        var scaleData = getZoom(stage);
        var zoom = scaleData.curScale;
        var newX = (posX - offset.left) / zoom;
        var newY = (posY - offset.top) / zoom;
        console.log(zoom, offset.left, posX, posY, newX, newY);
        tempObj.setAttribute("style", "left:" + newX + "px ; top: " + newY + "px");
        //jsPlumb.setId(element,schema_id);
        jsPlumb.repaintEverything();
        jsPlumbInstance.draggable(element, {
            containment: "parent"
        });

        function getZoom(el) {

            var curZoom = $('#container').css('zoom');
            var curScale = $('#container').css('transform') ||
                $('#container').css('-webkit-transform') ||
                $('#container').css('-moz-transform') ||
                $('#container').css('-o-transform') ||
                $('#container').css('-ms-transform');
            if (curScale === 'none') {
                curScale = 1;
            } else {
                //Parse retarded matrix string into array of values
                var scaleArray = $.parseJSON(curScale.replace(/^\w+\(/, "[").replace(/\)$/, "]"));
                //We only need one of the two scaling components as we are always scaling evenly across both axes
                curScale = scaleArray[0];
            }

            //jsPlumb.repaintEverything();
            return {
                curZoom: curZoom,
                curScale: curScale
            };
        }
        //end of it


        //jsPlumb.draggable(jsPlumb.getSelector(".container .item"), { grid: [20, 20] });	


        for (var i = 0; i < control.SourceEndpoints.length; i++) {
            var sourceEndpointID;
            if (control.SourceEndpoints[i].id == 0) {
                sourceEndpointID = $scope.createuuid();
                control.SourceEndpoints[i].id = sourceEndpointID;
            }
            jsPlumbInstance.addEndpoint(element, $scope.defaultStyleSource, {
                anchor: control.SourceEndpoints[i].location,
                uuid: control.SourceEndpoints[i].id
            });
        }
        for (var j = 0; j < control.TargetEndpoints.length; j++) {
            var targetEndpointID;
            if (control.TargetEndpoints[j].id == 0) {
                targetEndpointID = $scope.createuuid();
                control.TargetEndpoints[j].id = targetEndpointID;
            }
            jsPlumbInstance.addEndpoint(element, $scope.defaultStyleTarget, {
                anchor: control.TargetEndpoints[j].location,
                uuid: control.TargetEndpoints[j].id
            });
        }

        var moduleObj;
        if (loadingType == "internal") {
            moduleObj = $scope.createNewModule(schema_id, posX, posY, control, $state.current.name);
            dataHandler.addtoNodes(moduleObj);
        } else {
            moduleObj = control;
        }
        $(element).bind('click', moduleObj, function (event) {
            //moduleObj.Name = moduleObj.Variables[3].Value;
            $scope.openModule(moduleObj);
        });

        $(element).bind('drag', moduleObj, function (event) {
            console.log("done");
            $('#container').panzoom("disable");
        });

    };



    $scope.addConnectionToUI = function (event, connection, loadType) {

        if (loadType == "auto") {
            jsPlumb.connect({
                id: connection.id,
                uuids: [connection.sourceUUID, connection.targetUUID]
            });
        } else if (loadType == "manual") {
            var connection = event.connection;
            var type = event.connection.getType();
            var sourcemoduleObj = dataHandler.getModuleByID(connection.sourceId);
            var targetmoduleObj = dataHandler.getModuleByID(connection.targetId);
            var sourceUUID = "",
                targetUUID = "";

            /*if (sourcemoduleObj.library_id == "2") {
                var ifcondition = $scope.getIfConditionByID(connection.sourceId);
                var sourceUUIDleft = dataHandler.getEndpointsForItem(connection.sourceId, "source", "left");
                $scope.addConnection(connection.id, connection.sourceId, connection.targetId, sourceUUIDleft, ifcondition.falseUUID);

                var sourceUUIDright = dataHandler.getEndpointsForItem(connection.sourceId, "source", "right");
                $scope.addConnection(connection.id, connection.sourceId, connection.targetId, sourceUUIDright, ifcondition.trueUUID);
                $scope.GlobalExecutedIfs.push(connection.sourceId);
            } else {
                
            }*/

            sourceUUID = dataHandler.getEndpointsForItem(connection.sourceId, "source", "default");
            targetUUID = dataHandler.getEndpointsForItem(connection.targetId, "target", "default");

            $scope.addConnection(connection.id, connection.sourceId, connection.targetId, sourceUUID, targetUUID);
        }
    };

    $scope.removeControl = function (selectedModule, event) {
        var endpoints = jsPlumb.getEndpoints(selectedModule.schema_id);

        var confirm = $mdDialog.confirm()
            .title('Are you sure?')
            .content('The "' + selectedModule.Name + '" control will be removed with its data. Are you sure you want to continue?')
            .ariaLabel('Lucky day')
            .ok('Remove it!')
            .cancel('OMG! No')
            .targetEvent(event);

        $mdDialog.show(confirm).then(function () {

            for (var j = 0; j < endpoints.length; j++) {
                jsPlumb.deleteEndpoint(endpoints[j]);
            }

            jsPlumb.detachAllConnections(selectedModule.schema_id);

            var elem = document.getElementById(selectedModule.schema_id);
            elem.remove();
            dataHandler.removeFromSchema(selectedModule);
            $scope.selectedModule = null;
            $mdSidenav('right').close()
                .then(function () {
                    console.log("close LEFT is done");
                });

            // stop event propagation, so it does not directly generate a new state
            event.stopPropagation();

            $scope.showToast("Control removed.");
            console.log("control removed.");

        }, function () {

        });
    };

    $scope.createNewModule = function (schema_id, posX, posY, control, parentView) {
        var m = new module(
            control.library_id,
            schema_id,
            parentView,
            control.Name,
            control.Description,
            posX,
            posY,
            control.Icon,
            control.Variables,
            control.Type,
            control.Category,
            control.ControlEditDisabled,
            control.SourceEndpoints,
            control.TargetEndpoints,
            control.OtherData,
            control.Annotation,
            control.DisplayName
        );
        return m;
    }

    $scope.jsplumbInitiate = function () {
        jsPlumb.importDefaults({
            // default drag options
            DragOptions: {
                cursor: 'pointer'
            },
            // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
            // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
            ConnectionOverlays: [
         ["Arrow", {
                    location: 1
                }]
        ],
            Container: "container"
        });

        console.log("Set up jsPlumb listeners (should be only done once)");
        jsPlumb.bind("connection", function (info) {
            if ($scope.allowAddManualConnections) {


            }
            console.log(info);
            $scope.addConnectionToUI(info, {}, "manual");
            $('#container').panzoom("disable");
        });

        jsPlumb.bind("connectionDetached", function (info) {
            if ($scope.allowDetachManualConnections) {
                //alert("connection detached.");
                console.log(info);
                dataHandler.removeConnection(info.connection);
            }
        });
    }


    jsPlumb.bind("connectionDrag", function (info) {
        $('#container').panzoom("disable");
    });

    jsPlumb.bind("connectionDragStop", function (info, $rootScope) {
        if ($rootScope.settings.panning == true) {
            $('#container').panzoom("enable");
        };
    });

    // the initiateing method of the application
    $scope.init = function () {
        $scope.initiateApp();
        $scope.redraw();
        jsPlumb.bind("ready", function () {
            $scope.jsplumbInitiate();
            $interval(function () {

            }, 1000);
            $scope.HideBusyContainer();
        });
    }

    $scope.initiateApp = function () {
        if ($scope.IsinIframe() == true) {
            console.log("App running mode : Inside IFrame");
        } else {
            console.log("App running mode : External");
            var logoutObj = {
                link: '',
                title: 'Logout',
                icon: 'exit_to_app'
            }
            $scope.admin.push(logoutObj);
            //$scope.validateLogin();
            console.log("user logged in");
            var name = $scope.SessionDetails.Name;
            $scope.showToast("Welcome back " + name + "");
        }
        console.log("");
    }

    $scope.IsinIframe = function () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    $scope.validateLogin = function () {
        //sessionStorage.setItem("LoggedUser","shehanproductions@ymail.com");
        //sessionStorage.removeItem("LoggedUser");
        var session = sessionStorage.getItem("LoggedUser");
        if (session != null) {
            console.log("user logged in");
            $scope.showToast("Welcome back " + sessionStorage.getItem("LoggedUser") + "");
        } else {
            console.log("user not logged in. Redirecting to login page.");
            window.location = "login.html";
        }
    }

    $scope.ZoomIn = function () {
        var ZoomInValue = parseInt(document.getElementById("container").style.zoom) + 10 + '%'
        document.getElementById("container").style.zoom = ZoomInValue;
        return false;
    }

    $scope.ZoomOut = function () {
        var ZoomOutValue = parseInt(document.getElementById("container").style.zoom) - 10 + '%'
        document.getElementById("container").style.zoom = ZoomOutValue;
        return false;
    }

    $scope.Zoomorg = function () {
        var ZoomOutValue = parseInt(100) + '%'
        document.getElementById("container").style.zoom = ZoomOutValue;
        return false;
    }

    $scope.openBox = function () {
        var left = document.getElementById("toolboxControl").style.left;
        if (left == "") {
            document.getElementById("toolboxControl").style.left = "45px";
        } else if (left == "-350px") {
            document.getElementById("toolboxControl").style.left = "45px";
        } else if (left == "45px") {
            document.getElementById("toolboxControl").style.left = "-350px";
        }
    }

    $scope.closeBox = function () {
        document.getElementById("toolboxControl").style.left = "-350px";
    }

    $scope.openModule = function (module) {
        module.Variables = dataHandler.checkFormat(module.Variables);
        if (angular.isDefined(module)) {
            $scope.$apply(function () {
                if (module.Name == "Start" || module.Name == "Stop") {
                    $scope.tabdata.selectedIndex = 1;
                    $scope.tabdata.propertiesLocked = true;
                    $scope.tabdata.manageLocked = false;
                } else {
                    $scope.tabdata.selectedIndex = 0;
                    $scope.tabdata.propertiesLocked = false;
                    $scope.tabdata.manageLocked = false;
                }

                $scope.selectedModule = null;
                $scope.selectedModule = angular.fromJson(module);
            });
            $mdSidenav('right').toggle()
                .then(function () {
                    console.log("toggle RIGHT is done");
                });
            //$scope.createNewState(module.schema_id);
            console.log("Element clicked : ", module);
            $scope.breadcrumbModule = module;
            //$scope.createNewState(module.OtherData.FalseStateUUID);
        }
    }

    $scope.$on('propertyUpdated', function (event, data) {
        console.log('Broadcast recived:', data);
        dataHandler.updateCollectionData(data);
    });

    $scope.parentState = [];
    $scope.availability = '';


    $scope.createBreadcrumb = function (cs) {
        //cs - current state
        //ps- parent state
        setTimeout(function () {
            console.log(cs);
            console.log($scope.breadcrumbModule);
            l = $scope.parentState.length;
            $scope.ps = $scope.parentState[l];
            console.log($scope.parentState);
            if (cs == 'drawboard') {
                $scope.breadcrumb = "Drawboard";
                //console.log("Drawboard");
                $scope.parentState = [];
                //$scope.parentState[0] = cs;
            } else {
                console.log($scope.parentState);
                for (i = 0; i < l; i++) {
                    if (cs == $scope.parentState[i].cs) {
                        console.log("found");
                        $scope.availability = "available";
                        $scope.aid = i + 1;
                    }
                };
                console.log($scope.availability);
                if ($scope.availability == 'available') {
                    console.log($scope.aid, l);
                    $scope.parentState.splice($scope.aid, l);
                    console.log($scope.parentState);
                    $scope.availability = '';
                } else {
                    er = $scope.breadcrumbModule.Name;

                    if (er == "If" && cs == $scope.breadcrumbModule.OtherData.FalseStateUUID) {
                        condition = "false";
                    } else if (er == "If" && cs == $scope.breadcrumbModule.OtherData.TrueStateUUID) {
                        condition = "true";
                    } else {
                        condition = "conditions"
                    }
                    obj = {
                        cs, er, condition
                    };
                    $scope.parentState.push(obj);
                    console.log($scope.parentState);
                };
            }
        }, 100);

    };


    $scope.insertPairToObject = function (newPair, event) {
        if (angular.isDefined(newPair)) {
            if (angular.isDefined($scope.selectedModule) && $scope.selectedModule != null) {
                console.log("New Pair added : ", newPair);
                $scope.selectedModule.Variables.push({
                    Key: newPair.Key,
                    Value: newPair.Value,
                    Type: "Textbox"
                });
                newPair.Key = "";
                newPair.Value = "";
            } else {
                $scope.showAlert(event, "Please select a control module to insert data.", "Opps..");
            }
        } else {
            $scope.showAlert(event, "Please fill the above fields before inserting.", "Opps..");
        }
    }


    $scope.closeVariableWindow = function (pair) {
        $scope.clearPair(pair);
        $scope.hideVariableDialog();
    }

    $scope.removePair = function (pair) {
        var index = $scope.selectedModule.Variables.indexOf(pair)
        $scope.selectedModule.Variables.splice(index, 1);
        console.log("The following variable removed : ", pair);
    }

    $scope.clearVariables = function (ev) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure?')
            .content('All of the variables will be removed. Are you sure you want to continue?')
            .ariaLabel('Lucky day')
            .ok('Yes Please!')
            .cancel('OMG! No')
            .targetEvent(ev);

        $mdDialog.show(confirm).then(function () {
            $scope.selectedModule.Variables = [];
            console.log("Variable list cleared.");
            $scope.showToast("Variable list cleared.");
        }, function () {

        });
    }

    $scope.showVariableData = function (query) {
        var Arg = dataHandler.retrieveArguments();
        console.log('arguments' + Arg);
        var results = query ? Arg.filter(createFilterForVariable(query)) : [];
        return results;
    };


    function createFilterForVariable(query) {
        //var lowercaseQuery = angular.lowercase(query);
        return function filterFn(variable) {
            return (variable.Key.indexOf(query) === 0);
        };
    }

    $scope.execute = function (event) {
        if ($scope.validateCanvas()) {
            $scope.saveFlowchart(event);
        }
    }

    $scope.validateCanvas = function () {
        console.log("Validate method executed.");
        return true;
    }

    $scope.jsonObjtoLoad = {
        "ID": "079e",
        "Name": "Sample one",
        "Description": "sample one which can take a very long sentance",
        "JSONData": "{\"nodes\":[{\"blockId\":\"2f17\",\"nodedata\":{\"library_id\":0,\"schema_id\":\"2f17\",\"Name\":\"Start\",\"Icon\":\"http://icons.iconarchive.com/icons/custom-icon-design/mini/48/Cut-icon.png\",\"Description\":\"this is a test description\",\"Variables\":[],\"Type\":\"start\",\"Category\":\"flowcontrol\",\"X\":\"425px\",\"Y\":\"45px\",\"ControlEditDisabled\":true,\"SourceEndpoints\":[{\"id\":\"ba72\",\"location\":\"BottomCenter\"}],\"TargetEndpoints\":[]}},{\"blockId\":\"55f0\",\"nodedata\":{\"library_id\":1,\"schema_id\":\"55f0\",\"Name\":\"Stop\",\"Icon\":\"http://icons.iconarchive.com/icons/custom-icon-design/mini/48/Faq-icon.png\",\"Description\":\"this is a test description\",\"Variables\":[],\"Type\":\"stop\",\"Category\":\"flowcontrol\",\"X\":\"476px\",\"Y\":\"252px\",\"ControlEditDisabled\":true,\"SourceEndpoints\":[],\"TargetEndpoints\":[{\"id\":\"c06b\",\"location\":\"TopCenter\"}]}}],\"connections\":[{\"id\":\"con_25\",\"sourceId\":\"2f17\",\"targetId\":\"55f0\"}],\"ifconditions\":[]}"
    };

    $scope.getFlowDataForState = function (stateName) {
        // get objects which is regarding to the statename and return the object
        var nodes = dataHandler.getNodesForState(stateName);
        var connections = dataHandler.getConnectionsForState(stateName);
        var data = {
            JSONData: {
                "nodes": nodes,
                "connections": connections
            }
        }
        $scope.loadFlowchart(data);

    }

    $scope.loadFlowchart = function (data) {
        console.log("Loaded JSON data :", JSON.stringify(data.JSONData));
        var output = document.getElementById('container');
        output.innerHTML = "";
        //$scope.loadedProcessObj = data;
        var flowChartJson = data.JSONData;
        var flowChart = angular.fromJson(flowChartJson);
        var nodes = flowChart.nodes;
        var connections = flowChart.connections;

        $.each(nodes, function (index, elem) {
            //var posX = elem.nodedata.X.substring(0, elem.nodedata.X.length - 2);
            //var posY = elem.nodedata.Y.substring(0, elem.nodedata.Y.length - 2);

            var posX = elem.X;
            var posY = elem.Y;

            $scope.addModuletoUI(elem.library_id, posX, posY, elem, jsPlumb, "external");
        });

        // $scope.allowAddManualConnections = false;
        $.each(connections, function (index, elem) {
            $scope.addConnectionToUI({}, elem, "auto");
        });
        //$scope.allowAddManualConnections = true;
        /*if (nodes.length > 0) {
            $scope.showToast("Process design loaded successfully.");
        }*/
        $scope.HideBusyContainer();
    }

    $scope.clearFlowChart = function (ev) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure mate?')
            .content('All the content on the canvas will be removed. cannot revert this action once done!')
            .ariaLabel('Lucky day')
            .ok('Please do it!')
            .cancel('OMG! No')
            .targetEvent(ev);

        $mdDialog.show(confirm).then(function () {
            $scope.clearcanvas();
            $scope.showToast("Reset successful.");
            $scope.workflowName = "Untitled";
            $scope.workflowVersion = "";

        }, function () {

        });
    };

    $scope.clearcanvas = function () {
        dataHandler.resetFactory();
        dataHandler.removeArguments();

        $scope.allowDetachManualConnections = false;
        jsPlumb.reset();
        $scope.jsplumbInitiate();
        var output = document.getElementById('container');
        output.innerHTML = "";
        $scope.selectedModule = null;
        $scope.closeBox();
        $scope.loadedProcessObj = null;
        $scope.allowDetachManualConnections = true;
        $scope.workflowName = "Untitled";
        $scope.workflowVersion = "";
        // clear all method should be added to factory
    }

    $scope.showAlert = function (ev, message, title) {
        $mdDialog.show(
            $mdDialog.alert()
            .title(title)
            .content(message)
            .ariaLabel('Password notification')
            .ok('Got it!')
            .targetEvent(ev)
        );
    };

    $scope.showDialog = function (ev, message, title) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: title,
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                message: message
            }
        });
    };

    function DialogController($scope, $sce, $mdDialog, message) {
        $scope.data = message;
        $scope.message = $sce.trustAsHtml(message.ReturnData.WorkflowTrace);

        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    };

    $scope.showToast = function (message) {
        $mdToast.show(
            $mdToast.simple()
            .content(message)
            .position("bottom right")
            .hideDelay(3000)
        );
    };

    $scope.createuuid = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    $scope.publishProcessDesign = function (saveObject, event) {

        /*var saveObject = {
            "ID": $scope.loadedProcessObj.ID,
            "Name": $scope.loadedProcessObj.Name,
            "Description": $scope.loadedProcessObj.Description,
            "JSONData": flowChartJson
        }*/
        //$scope.loadedProcessObj = saveObject;
        var flowChartJson = JSON.stringify(saveObject.JSONData);
        var flowname = saveObject.Name;
        flowname = flowname.replace(' ', '');
        var URL = "http://localhost:8093/processengine/BuildFlow/";
        var actualURL = URL + flowname + "/1234";

        $http.post(actualURL, saveObject.JSONData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).
        success(function (data, status, headers, config) {
            console.log(data);
            if (data.Status) {
                console.log(data);
                $scope.showDialog(event, data, 'partials/publish_success.html');
            } else {
                $scope.showDialog(event, data, 'partials/publish_fail.html');
            }
            $scope.HideBusyContainer();
        }).
        error(function (data, status, headers, config) {
            $scope.showToast("Opps.. There was an error");
            console.log("");
            console.log(data);
            console.log("..........");
            console.log(status);
            console.log("..........");
            console.log(headers);
            console.log("..........");
            console.log(config);
            console.log("");
            $scope.HideBusyContainer();
        });


        /*$http({method: 'POST',url: actualURL, body:saveObject.JSONData, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
        			  success(function(data, status, headers, config) {
                            if (data.Status) {
                                $scope.showDialog(event, data.Message, 'partials/publish_success.html');
                            } else {
                                $scope.showDialog(event, data.Message, 'partials/publish_fail.html');
                            }
                            $scope.HideBusyContainer();

        			  }).
        			  error(function(data, status, headers, config) {
                            $scope.showToast("Opps.. There was an error");
                            console.log("");
                            console.log(data);
                            console.log("..........");
                            console.log(status);
                            console.log("..........");
                            console.log(headers);
                            console.log("..........");
                            console.log(config);
                            console.log("");
                            $scope.HideBusyContainer();
        			  });*/


        console.log("Starting flow publish..");
        console.log(JSON.stringify(flowChartJson));
        console.log("");
    };

    $scope.showAdvancedMessage = function (ev) {
        $mdDialog.show({
                controller: 'MessageController',
                templateUrl: './partials/dialog-template.html',
                targetEvent: ev,
            })
            .then(function (answer) {
                $scope.alert = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.alert = 'You cancelled the dialog.';
            });
    };

    $scope.showActivityWindow = function (ev) {
        $mdDialog.show({
                controller: 'ActivityController',
                templateUrl: './partials/manage-activity-template.html',
                targetEvent: ev,
            })
            .then(function (obj) {
                console.log(obj);
                if (obj.event.currentTarget.name == "save") {
                    $scope.ShowBusyContainer("Saving activitiy details");
                    $scope.saveActivity(obj);
                } else if (obj.event.currentTarget.name == "update") {
                    $scope.ShowBusyContainer("Saving activitiy details");
                    $scope.updateActivity(obj);
                } else if (obj.event.currentTarget.name == "remove") {
                    $scope.ShowBusyContainer("Deleting activitiy");
                    $scope.deleteActivityFromObjectStore(obj.data);
                }
            }, function () {

                $scope.getallActivities();
            });
    };

    $scope.workflowName = "Untitled";
    $scope.workflowVersion = "";

    $scope.showOpenWindow = function (ev) {
        $mdDialog.show({
                controller: 'OpenController',
                templateUrl: './partials/open-template.html',
                targetEvent: ev,
            })
            .then(function (open) {
                    console.log(open);
                    if (open.mode == 'open') {
                        var element = document.getElementById("container");
                        if (element.childNodes.length == 0) {
                            $scope.ShowBusyContainer("Opening workflow to your environment");
                            open.data = $scope.formatModule(open.data);
                            $scope.loadedProcessObj = open.data;
                            dataHandler.setFlowObject(open.data.JSONData);
                            $scope.getFlowDataForState($state.current.name);
                            $scope.workflowName = open.data.DisplayName;
                            $scope.workflowVersion = open.data.version;
                            dataHandler.setArguments(open.data.JSONData.arguments);
                            console.log(open.data, $scope.workflowName);
                        } else {
                            var confirm = $mdDialog.confirm()
                                .title('Are you sure?')
                                .content('Opening this process will clear out the canvas. Are you sure you want to continue?')
                                .ariaLabel('Lucky day')
                                .ok('Please do it!')
                                .cancel('OMG! No')
                                .targetEvent(ev);

                            $mdDialog.show(confirm).then(function () {
                                $scope.clearcanvas();
                                open.data = $scope.formatModule(open.data);
                                $scope.loadedProcessObj = open.data;
                                dataHandler.setFlowObject(open.data.JSONData);
                                $scope.getFlowDataForState($state.current.name);
                                $scope.workflowName = open.data.DisplayName;
                                $scope.workflowVersion = open.data.version;
                                console.log(open.data, $scope.workflowName);
                                dataHandler.setArguments(open.data.JSONData.arguments);
                                //$scope.loadFlowchart(open.data);
                            }, function () {

                            });
                        }
                    } else {
                        if (angular.isDefined(open)) {
                            var data = open;
                            var saveObj = new module(
                                data.data.ID,
                                0,
                                'default',
                                data.data.Name,
                                data.data.Description,
                                0,
                                0,
                                'ion-ios-photos', data.data.JSONData.arguments,
                                'defaultitem',
                                'partial Workflows',
                                true, [{
                                    "id": 0,
                                    "location": "BottomCenter"
                                            }], [{
                                    "id": 0,
                                    "location": "TopCenter"
                                            }], {

                                },
                                "",
                                data.data.Name
                            );
                            console.log(saveObj);
                            if (saveObj.Variables == undefined) {
                                saveObj.Variables = [];
                            };
                            $scope.library.push(saveObj);
                            $scope.showToast('partial workflow added to toolbar ');
                        };
                    };
                },
                function () {
                    // call the function which should call after the window is closed.
                });
    };

    $scope.formatModule = function (data) {
        if (data.Author == undefined) {
            data.Author = {
                Name: 'anonymous',
                Email: 'default',
                MobileNo: 'default',
                Company: 'default'
            };
        };

        return data;
    };

    $scope.validateBeforeSave = function () {
        var result = true;
        var errors = dataHandler.validateWorkflow();
        if (errors.length > 0) {
            result = false;
            $mdDialog.show({
                    controller: 'ErrorController',
                    templateUrl: './partials/error-template.html'
                })
                .then(function () {
                    result = true;
                });
        };
        return result;
    };

    $scope.showSaveWindow = function (ev, mode) {
        $scope.saveStateData();

        var errors = dataHandler.validateWorkflow();
        console.log(errors);
        if (errors.length > 0) {
            result = false;
            $mdDialog.show({
                    controller: 'ErrorController',
                    templateUrl: './partials/error-template.html',
                    targetEvent: ev,
                })
                .then(function (data) {
                    console.log(data);
                    if (data = 'skip') {
                        //console.log(dataHandler.getSaveJson(), dataHandler.getViews());
                        showSaveWorkflowDialog(ev, mode);
                    };
                });
        } else {
            showSaveWorkflowDialog(ev, mode);
        };
    };

    function showSaveWorkflowDialog(ev, mode) {
        if ($scope.loadedProcessObj != null) {
            //$scope.updateFlowchart(ev, mode);
            $mdDialog.show({
                    controller: 'SaveController',
                    templateUrl: './partials/update_template.html',
                    targetEvent: ev,
                })
                .then(function (saveEvent) {
                    $scope.ShowBusyContainer("Updating workflow, hold on a minute");
                    $scope.updateFlowchart(saveEvent, mode, ev);
                }, function () {

                });
        } else {
            $mdDialog.show({
                    controller: 'SaveController',
                    templateUrl: './partials/save-template.html',
                    targetEvent: ev,
                })
                .then(function (saveEvent) {

                    $scope.ShowBusyContainer("Saving workflow, hold on a minute");
                    $scope.saveNewFlowchart(saveEvent, mode, ev);

                }, function () {

                });
        }
    };

    $scope.saveNewPartialWorkflow = function (data) {
        data.data.Variables = dataHandler.retrieveArguments();


        console.log("Saving partial workflow...");
        if (angular.isDefined(data)) {
            var saveObj = new module(
                $scope.createuuid(),
                0,
                'default',
                data.data.name,
                data.data.description,
                0,
                0,
                'ion-ios-photos', data.data.Variables,
                'partial',
                'partial',
                true, [{
                    "id": 0,
                    "location": "BottomCenter"
                }], [{
                    "id": 0,
                    "location": "TopCenter"
                }], {
                    Name: data.data.OtherData.Name,
                    MobileNo: data.data.OtherData.MobileNo,
                    Email: "default",
                    Company: "default"
                },
                "",
                data.data.name
            );
            console.log(saveObj);

            $scope.sendPartialToObjectStore(saveObj);
        } else {
            $scope.showAlert(data.event, "Please fill the Partial details before inserting.", "Opps..");
            $scope.HideBusyContainer();
        }
    };



    $scope.showSettingsWindow = function (ev, mode) {
        console.log(sessionStorage.getItem("zooming"));
        $mdDialog.show({
            controller: 'SettingsController',
            templateUrl: './partials/settings-template.html',
            targetEvent: ev
        });
    };

    //dynamic themeing
    $scope.theme = sessionStorage.cur_theme || 'default';
    $rootScope.changeColorMain = function () {
        $scope.theme = sessionStorage.cur_theme || 'default';
        $scope.themeList = ThemeService();
        console.log('Current Theme', $scope.theme);
        $scope.clickIconMorph = function (value) {
            console.log(value);
            if (value != undefined) {
                $scope.theme = value + '-theme';
                sessionStorage.setItem("cur_theme", $scope.theme);
                console.log('Changed theme', $scope.theme, value);
                $scope.accent_color = value;
            }
        };
    }

    $rootScope.changeColor = function () {
            $scope.theme = sessionStorage.cur_theme || 'default';
            $scope.themeList = ThemeService();
            console.log('Current Theme', $scope.theme);
            $scope.clickIconMorph = function (value) {
                console.log(value);
                if (value != undefined) {
                    $scope.theme = value + '-theme';
                    sessionStorage.setItem("cur_theme", $scope.theme);
                    console.log('Changed theme', $scope.theme, value);
                    $scope.accent_color = value;
                }
            };
        } //end of dynamic themeing

    $rootScope.settings = {
        panning: false,
        zooming: false,
        breadcrumb: true
    };

    if (sessionStorage.getItem("panning") == "true") {
        $rootScope.settings.panning = true;
    } else {
        $rootScope.settings.panning = false;
    };
    if (sessionStorage.getItem("zooming") == "true") {
        $rootScope.settings.zooming = true;
    } else {
        $rootScope.settings.zooming = false;
    };
    if (sessionStorage.getItem("breadcrumb") == "true") {
        $rootScope.settings.breadcrumb = true;
    } else {
        $rootScope.settings.breadcrumb = false;
    };

    //default settings
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

        //jsPlumb.repaintEverything();
        return {
            curZoom: curZoom,
            curScale: curScale
        };
    }
    //end of default settings

    $scope.showHelpWindow = function (ev) {
        $mdDialog.show({
            controller: 'mainController',
            templateUrl: './partials/help-template.html',
            targetEvent: ev
        });
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };



    $scope.showPublishWindow = function (ev) {

        var errors = dataHandler.validateWorkflow();
        console.log(errors);
        if (errors.length > 0) {
            result = false;
            $mdDialog.show({
                    controller: 'ErrorController',
                    templateUrl: './partials/error-template.html',
                    targetEvent: ev,
                })
                .then(function (data) {
                    console.log(data);
                    if (data = 'skip') {
                        //console.log(dataHandler.getSaveJson(), dataHandler.getViews());
                        showPublishWorkflowDialog(ev);
                    };
                });
        } else {
            showPublishWorkflowDialog(ev);
        };

    };

    function showPublishWorkflowDialog(ev) {
        $mdDialog.show({
                controller: 'PublishController',
                templateUrl: './partials/publish-template.html',
                targetEvent: ev,
            })
            .then(function (open) {
                $scope.ShowBusyContainer("Publishing workflow, hold on a minute");
                console.log(open);
                var processcode = open.data.ProcessCode;
                var flowChartJson = dataHandler.getSaveJson();
                var flowID = "";
                var flowname = "";
                var flowdescription = "";
                if ($scope.loadedProcessObj == null) {
                    flowID = $scope.createuuid();
                    flowname = "TempPublish_" + $scope.createuuid();
                    flowdescription = "Temp flow which is not being saved.";
                } else {
                    flowID = $scope.loadedProcessObj.ID;
                    flowname = $scope.loadedProcessObj.DisplayName;
                    flowdescription = $scope.loadedProcessObj.Description;
                }

                //camel case
                var authorDetails = {
                    "Name": $scope.SessionDetails.Name,
                    "Email": $scope.SessionDetails.Email,
                    "Domain": $scope.SessionDetails.Domain
                }

                var saveObject = {
                    "ID": $scope.createuuid(),
                    "Name": $scope.getWFName(flowname),
                    "DisplayName": flowname,
                    "Description": flowdescription,
                    "JSONData": flowChartJson,
                    "AuthorDetails": authorDetails
                }
                $scope.publishProcessDesign(saveObject, ev);

                var processMapping = {
                    "ID": $scope.createuuid(),
                    "ProcessCode": processcode,
                    "WorkflowID": flowID
                }

                if (open.availability == true) {
                    processMapping.ID = open.data.ID;
                    $scope.updateMappingToObjectStore(processMapping, ev);
                } else {
                    $scope.sendMappingToObjectStore(processMapping, ev);
                };
            }, function () {
                // call the function which should call after the window is closed.
            });
    };

    $scope.camelize = function (str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    };

    $scope.getWFName = function (flowname) {
        var conc_username = $scope.SessionDetails.Username
        var sourceString = conc_username + "_" + flowname
        var outString = sourceString.replace(/[` ~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        return outString;
    }

    $scope.saveNewFlowchart = function (saveevent, mode, event) {
        console.log("");
        console.log("Saving chart..");

        var flowChartJson = dataHandler.getSaveJson();
        $rootScope.WFID = $scope.createuuid();

        var authorDetails = {
            "Name": $scope.SessionDetails.Name,
            "Email": $scope.SessionDetails.Email,
            "Domain": $scope.SessionDetails.Domain
        }
        var saveObject = {
            "ID": $scope.createuuid(),
            "WFID": $rootScope.WFID,
            "Name": $scope.getWFName(saveevent.data.name),
            "DisplayName": saveevent.data.name,
            "comment": "creating new workflow",
            "Description": saveevent.data.description,
            "version": saveevent.data.version,
            "DateTime": new Date(),
            "UserName": $scope.SessionDetails.Username,
            "JSONData": flowChartJson,
            "AuthorDetails": authorDetails
        }

        if (angular.isUndefined(saveevent.data.description)) {
            saveObject.Description = ""
        }

        var saveObjectParent = {
            "ID": $rootScope.WFID,
            "Name": $scope.getWFName(saveevent.data.name),
            "DisplayName": saveevent.data.name,
            "Description": saveevent.data.description,
            "version": [],
            "DateTime": new Date(),
            "UserName": $scope.SessionDetails.Username,
            "AuthorDetails": authorDetails
        }

        var version = [saveObject.ID];
        saveObjectParent.version = version;

        if (angular.isDefined(parent.codiad)) {
            parent.codiad.editor.setContent(saveObject);
            $scope.showToast("Successfully exported to DevStudio.");
        } else {
            $scope.sendProcessToObjectStore(saveObject, mode, event);
            $scope.sendProcessVersionToObjectStore(saveObjectParent, mode, saveevent);
        }
        console.log("Saved WF object:");
        console.log(saveObject, saveObjectParent);
    }

    $scope.updateFlowchart = function (saveevent, mode) {
        console.log("Updating chart..");
        var flowChartJson = dataHandler.getSaveJson();

        var authorDetails = {
            "Name": $scope.SessionDetails.Name,
            "Email": $scope.SessionDetails.Email,
            "Domain": $scope.SessionDetails.Domain
        }
        var saveObject = {
            "ID": $scope.createuuid(),
            "WFID": $rootScope.WFID,
            "Name": $scope.getWFName($scope.loadedProcessObj.DisplayName),
            "DisplayName": $scope.loadedProcessObj.DisplayName,
            "comment": saveevent.data.comment,
            "Description": saveevent.data.description,
            "version": saveevent.data.version,
            "DateTime": new Date(),
            "UserName": $scope.SessionDetails.Username,
            "JSONData": flowChartJson,
            "AuthorDetails": authorDetails
        }

        if (angular.isUndefined(saveevent.data.description)) {
            saveObject.Description = ""
        }

        $rootScope.parentWorkflowData.version.push(saveObject.ID);

        // var version = [saveObject.ID];
        //saveObjectParent.version = version;

        if (angular.isDefined(parent.codiad)) {
            parent.codiad.editor.setContent(saveObject);
            $scope.showToast("Successfully exported to DevStudio.");
        } else {
            $scope.sendProcessToObjectStore(saveObject, mode, saveevent);
            $scope.updateProcessVersionInObjectStore($rootScope.parentWorkflowData, mode, saveevent);
        }
        console.log(JSON.stringify(saveObject));
    };


    $scope.sendProcessToObjectStore = function (saveObj, mode, event) {
        var client = $objectstore.getClient("process_flows");
        client.onComplete(function (data) {
            $scope.HideBusyContainer();
            $scope.loadedProcessObj = saveObj;
            $scope.showToast("Successfully saved in Objectstore.");
            if (mode == "save") {
                $scope.clearcanvas();
            }
            if (mode == "publish") {
                $scope.publishProcessDesign(saveObj, event);
            }
        });
        client.onError(function (data) {
            $scope.showToast("Oppss. There was an error storing in objectstore.");
        });
        client.insert([saveObj], {
            KeyProperty: "ID"
        });
    }

    $scope.sendProcessVersionToObjectStore = function (saveObj, mode, event) {
        var client = $objectstore.getClient("process_flows_versions");
        client.onComplete(function (data) {
            $scope.HideBusyContainer();
            $scope.loadedProcessObj = saveObj;
            //$scope.showToast("Successfully saved in Objectstore.");
            if (mode == "save") {
                $scope.clearcanvas();
            }
            if (mode == "publish") {
                $scope.publishProcessDesign(saveObj, event);
            }
        });
        client.onError(function (data) {
            //$scope.showToast("Oppss. There was an error storing in objectstore.");
        });
        client.insert([saveObj], {
            KeyProperty: "ID"
        });
    }

    $scope.updateProcessVersionInObjectStore = function (saveObj, mode, event) {
        var client = $objectstore.getClient("process_flows_versions");
        client.onComplete(function (data) {
            //$scope.showToast("Successfully updated in Objectstore.");
            if (mode == "publish") {
                $scope.publishProcessDesign(saveObj, event);
            }
        });
        client.onError(function (data) {
            //$scope.showToast("Oppss. There was an error storing in objectstore.");
        });
        client.update([saveObj], {
            KeyProperty: "ID"
        });
    }

    $scope.sendMappingToObjectStore = function (saveObj, event) {
        var client = $objectstore.getClient("process_mapping");
        client.onComplete(function (data) {
            $scope.showToast("Workflow mapped to the given processcode.");
        });
        client.onError(function (data) {
            $scope.showToast("Oppss. There was an error storing in objectstore.");
        });
        client.insert([saveObj], {
            KeyProperty: "ID"
        });
    };

    $scope.updateMappingToObjectStore = function (saveObj, event) {
        var client = $objectstore.getClient("process_mapping");
        client.onComplete(function (data) {
            $scope.showToast("Workflow mapped to the given processcode.");
        });
        client.onError(function (data) {
            $scope.showToast("Oppss. There was an error storing in objectstore.");
        });
        client.update([saveObj], {
            KeyProperty: "ID"
        });
    }

    $scope.saveActivity = function (saveevent) {

        //console.log("");
        console.log("Saving activity...");
        if (angular.isDefined(saveevent)) {
            var saveObj = new module(
                $scope.createuuid(),
                0,
                'default',
                saveevent.data.Name,
                saveevent.data.Description,
                0,
                0,
                'ion-ios-photos', saveevent.data.Variables,
                'activity',
                'activity',
                true, [{
                    "id": 0,
                    "location": "BottomCenter"
                }], [{
                    "id": 0,
                    "location": "TopCenter"
                }], {
                    Name: saveevent.data.OtherData.Name,
                    MobileNo: saveevent.data.OtherData.MobileNo,
                    Email: "default",
                    Company: "default"
                },
                "",
                saveevent.data.Name
            );
            console.log(saveObj);

            $scope.sendActivityToObjectStore(saveObj);
        } else {
            $scope.showAlert(saveevent.event, "Please fill the activity details before inserting.", "Opps..");
            $scope.HideBusyContainer();
        }
    };

    $scope.updateActivity = function (saveevent) {

        //console.log("");
        console.log("Updating activity...");
        if (angular.isDefined(saveevent)) {
            //            var saveObj = new module(
            //                saveevent.data.library_id,
            //                0,
            //                'default',
            //                saveevent.data.Name,
            //                saveevent.data.Description,
            //                0,
            //                0,
            //                'extension', saveevent.data.Variables,
            //                'activity',
            //                'activity',
            //                true, [{
            //                    "id": 0,
            //                    "location": "BottomCenter"
            //                }], [{
            //                    "id": 0,
            //                    "location": "TopCenter"
            //                }], {}
            //            );
            //console.log(saveObj);

            $scope.sendActivityToObjectStore(saveevent.data);
        } else {
            $scope.showAlert(saveevent.event, "Please fill the activity details before inserting.", "Opps..");
            $scope.HideBusyContainer();
        }
    };

    $scope.sendActivityToObjectStore = function (saveObj) {
        var client = $objectstore.getClient("process_activities");
        client.onComplete(function (data) {
            $scope.HideBusyContainer();
            $scope.showToast("Successfully saved in Objectstore.");

            $scope.getallActivities();

        });
        client.onError(function (data) {
            $scope.HideBusyContainer();
            $scope.showToast("Oppss. There was an error storing in objectstore.");
        });
        client.insert([saveObj], {
            KeyProperty: "library_id"
        });
    };

    $scope.showTestWorkflowWindow = function (ev) {
        $mdDialog.show({
                controller: 'TestWorkflowController',
                templateUrl: './partials/TestWorkflow-template.html',
                targetEvent: ev,
            })
            .then(function (saveEvent) {
                $scope.testProcessDesign(saveEvent);
            }, function () {

            });
    };

    $scope.testProcessDesign = function (data) {

        /*var saveObject = {
            "ID": $scope.loadedProcessObj.ID,
            "Name": $scope.loadedProcessObj.Name,
            "Description": $scope.loadedProcessObj.Description,
            "JSONData": flowChartJson
        }*/
        //$scope.loadedProcessObj = saveObject;
        //        var flowChartJson = JSON.stringify(saveObject.JSONData);
        //        var flowname = saveObject.Name;
        //        flowname = flowname.replace(' ', '');
        //        var URL = "http://localhost:8093/BuildFlow/";
        //        var actualURL = URL + flowname + "/1234";
        //
        //        $http.post(actualURL, saveObject.JSONData).
        //        success(function (data, status, headers, config) {
        //            if (data.Status) {
        //                $scope.showDialog(event, data.Message, 'partials/publish_success.html');
        //            } else {
        //                $scope.showDialog(event, data.Message, 'partials/publish_fail.html');
        //            }
        //            $scope.HideBusyContainer();
        //        }).
        //        error(function (data, status, headers, config) {
        //
        //        });
        console.log(data);
    };

    $scope.deleteActivityFromObjectStore = function (saveObj) {
        console.log(saveObj);
        var client = $objectstore.getClient("process_activities");
        client.onComplete(function (data) {
            $scope.HideBusyContainer();
            $scope.showToast("Successfully Deleted in Objectstore.");

            $scope.getallActivities();
            console.log("done");
        });
        client.onError(function (data) {
            $scope.HideBusyContainer();
            $scope.showToast("Oppss. There was an error deleting from objectstore.");
            console.log("not done");
        });
        client.deleteSingle(saveObj.library_id, "library_id");
    };


    $scope.showAddVariableWindow = function (ev) {

        $mdDialog.show({
                controller: 'VariableController',
                templateUrl: './partials/add-variable-template.html',
                targetEvent: ev,
            })
            .then(function (saveEvent) {
                $scope.insertPairToObject(saveEvent.data, saveEvent.event);
            }, function () {

            });
    };

    $scope.showArgumentPanel = function (ev) {
        $mdDialog.show({
                controller: 'ArgumentController',
                templateUrl: './partials/argumentPanel.html',
                targetEvent: ev,
            })
            .then(function (saveEvent) {

            }, function () {

            });
    };

    $scope.logoutUser = function () {
        sessionStorage.removeItem("LoggedUser");
        window.location = "index.html";
    };

    $scope.showImportExportWindow = function (ev) {
        $mdDialog.show({
                controller: 'ImportExportController',
                templateUrl: './partials/ImportExport-template.html',
                targetEvent: ev,
            })
            .then(function (open) {
                var element = document.getElementById("container");
                if (element.childNodes.length == 0) {
                    $scope.ShowBusyContainer("Opening workflow to your environment");
                    $scope.loadedProcessObj = open.data;
                    dataHandler.setFlowObject(open.data.JSONData);
                    $scope.getFlowDataForState($state.current.name);
                    $scope.workflowName = open.data.DisplayName;
                    $scope.workflowVersion = open.data.version;
                    dataHandler.setArguments(open.data.JSONData.arguments);
                    console.log(open.data, $scope.workflowName);
                } else {
                    var confirm = $mdDialog.confirm()
                        .title('Are you sure?')
                        .content('Opening this process will clear out the canvas. Are you sure you want to continue?')
                        .ariaLabel('Lucky day')
                        .ok('Please do it!')
                        .cancel('OMG! No')
                        .targetEvent(ev);

                    $mdDialog.show(confirm).then(function () {
                        $scope.clearcanvas();
                        $scope.loadedProcessObj = open.data;
                        dataHandler.setFlowObject(open.data.JSONData);
                        $scope.getFlowDataForState($state.current.name);
                        $scope.workflowName = open.data.DisplayName;
                        $scope.workflowVersion = open.data.version;
                        console.log(open.data, $scope.workflowName);
                        dataHandler.setArguments(open.data.JSONData.arguments);
                        //$scope.loadFlowchart(open.data);
                    }, function () {

                    });
                }
            }, function () {

            });
    };

    $scope.menu = [
        {
            link: '',
            title: 'Toolbar',
            icon: 'create'
    },
        {
            link: '',
            title: 'Back to Drawboard',
            icon: 'navigate_before'
    },
        {
            link: '',
            title: 'Reset',
            icon: 'clear'
    },
        {
            link: '',
            title: 'Activities',
            icon: 'swap_vert_circle'
    }
  ];
    $scope.admin = [
        {
            link: '',
            title: 'Save',
            icon: 'save'
    },
        {
            link: '',
            title: 'Open',
            icon: 'folder_open'
    },
        {
            link: '',
            title: 'Publish',
            icon: 'launch'
    }, {
            link: '',
            title: 'Import & Export',
            icon: 'import_export'
    }, {
            link: '',
            title: 'Test Workflow',
            icon: 'settings_input_composite'
    },
        {
            link: '',
            title: 'Settings',
            icon: 'settings'
    },
        {
            link: '',
            title: 'Help',
            icon: 'help'
    }
  ];


    $scope.mainMenuClick = function ($index, $event) {
        var clickedItem = $scope.menu[$index];
        if (clickedItem.title == "Toolbar") {
            $scope.openBox();
        } else if (clickedItem.title == "Reset") {
            $scope.clearFlowChart($event);
        } else if (clickedItem.title == "Activities") {
            $scope.showActivityWindow($event);
        } else if (clickedItem.title == "Back to Drawboard") {
            $scope.changeState('drawboard');
        }
    }

    $scope.adminMenuClick = function ($index, $event) {
        var clickedItem = $scope.admin[$index];
        if (clickedItem.title == "Save") {
            $scope.showSaveWindow($event, "save");
        } else if (clickedItem.title == "Publish") {
            $scope.showPublishWindow($event);
        } else if (clickedItem.title == "Open") {
            $scope.showOpenWindow($event);
        } else if (clickedItem.title == "Logout") {
            $scope.logoutUser();
        } else if (clickedItem.title == "Settings") {
            $scope.showSettingsWindow($event, "settings");
        } else if (clickedItem.title == "Help") {
            $scope.showHelpWindow($event);
        } else if (clickedItem.title == "Import & Export") {
            $scope.showImportExportWindow($event);
        } else if (clickedItem.title == "Test Workflow") {
            $scope.showTestWorkflowWindow($event);
        }
    }


            }]);


app.directive('postRender', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'A',
        terminal: true,
        transclude: true,
        link: function ($scope, element, attrs) {
            $timeout($scope.redraw, 0); //Calling a $scoped method
        }
    };
    return def;
}]);





//
// This directive should allow an element to be dragged onto the main canvas. Then after it is dropped, it should be
// painted again on its original position, and the full module should be displayed on the dragged to location.
//
app.directive('plumbMenuItem', function () {
    return {
        replace: true,
        controller: 'mainController',
        link: function ($scope, element, attrs) {
            //console.log("Add plumbing for the 'menu-item' element");

            // jsPlumb uses the containment from the underlying library, in our case that is jQuery.

            jsPlumb.draggable(element, {
                containment: "parent"
            });
        }
    };
});

app.directive('droppable', function ($compile, $rootScope) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {


            element.droppable({
                drop: function (event, ui) {
                    if ($rootScope.settings.panning == true) {
                        $('#container').panzoom("enable");
                    };
                    console.log("Make this element droppable");
                    // angular uses angular.element to get jQuery element, subsequently data() of jQuery is used to get
                    // the data-identifier attribute
                    var dragIndex = angular.element(ui.draggable).data('identifier'),
                        dragEl = angular.element(ui.draggable),
                        dropEl = angular.element(this);

                    // if dragged item has class menu-item and dropped div has class drop-container, add module 
                    if (dragEl.hasClass('menu-item') && dropEl.hasClass('container')) {
                        console.log("Drag event on " + dragIndex);
                        $scope.addModuletoUI(dragIndex, event.pageX, event.pageY, {}, jsPlumb, "internal");
                    }
                    /*$scope.$apply();*/
                }
            });
        }
    };
});

app.directive('draggable', function () {
    return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        restrict: 'A',
        //The link function is responsible for registering DOM listeners as well as updating the DOM.
        link: function ($scope, element, attrs) {
            //console.log("Let draggable item snap back to previous position");
            element.draggable({
                // let it go back to its original position
                revert: true,
            });
        }
    };
}); // Code goes here
