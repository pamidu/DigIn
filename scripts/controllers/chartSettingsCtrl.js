 routerApp.controller('chartSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$mdDialog', '$sce',

     'widget',
     function($scope, $timeout, $rootScope, $mdDialog, $sce, widget) {
         $scope.datatab = {
             selectedIndex: 0,
             secondLocked: true,
             secondLabel: "Item Two"
         };

         $scope.widget = [];

         $scope.datasources = ['Object Store', 'Elastic search', 'CouchDB'];

         $scope.next = function() {
             $scope.datatab.selectedIndex = Math.min($scope.datatab.selectedIndex + 1, 2);
         };

         $scope.previous = function() {
             $scope.datatab.selectedIndex = Math.max($scope.datatab.selectedIndex - 1, 0);
         };

         $scope.form = {
             name: widget.name,
         };

         $scope.widget = widget;

         $scope.closeDialog = function() {
             // Easily hides most recent dialog shown...
             // no specific instance reference is needed.
              
             if ($rootScope.widgetType != "ElasticSearch") {
                 $scope.widget.d3plugin = $rootScope.d3Url;
             }
             $mdDialog.hide();

         };

         $scope.openDialog = function() {
             var selectedMenu = document.getElementsByClassName("menu-layer");
             selectedMenu[0].style.display = 'none';
             if ($rootScope.widgetType != "ElasticSearch") {
                 $scope.widget.d3plugin = $rootScope.d3Url;
             }
         };

         $scope.trustSrc = function(src) {
             return $sce.trustAsResourceUrl(src);
         }

         $scope.widget.d3plugin = '';

         $scope.remove = function() {
             $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
             $modalInstance.close();
         };

         $scope.showContent = function($fileContent) {
             // $scope.widget.data = $fileContent;
             // if(!$scope.$$phase) $scope.$apply();
             // console.log($scope.widget.data);
         };

         $scope.addPoints = function() {
             var seriesArray = widget.highchartsNG.series;
             var rndIdx = Math.floor(Math.random() * seriesArray.length);
             seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
         };

         $scope.addSeries = function() {
             var rnd = []
             for (var i = 0; i < 10; i++) {
                 rnd.push(Math.floor(Math.random() * 20) + 1)
             }
             widget.highchartsNG.series.push({
                 data: rnd
             })
         }

         $scope.removeRandomSeries = function() {
             var seriesArray = widget.highchartsNG.series;
             var rndIdx = Math.floor(Math.random() * seriesArray.length);
             seriesArray.splice(rndIdx, 1)
         }

         $scope.removeSeries = function(id) {
             var seriesArray = widget.highchartsNG.series;
             seriesArray.splice(id, 1)
         }

         $scope.toggleHighCharts = function() {
             this.highchartsNG.useHighStocks = !this.highchartsNG.useHighStocks
         }

         $scope.replaceAllSeries = function() {
             var data = [{
                 name: "first",
                 data: [10]
             }, {
                 name: "second",
                 data: [3]
             }, {
                 name: "third",
                 data: [13]
             }];
             widget.highchartsNG.series = data;
         };

         $scope.reflow = function() {
             $scope.$broadcast('highchartsng.reflow');
         };

         $scope.resize = function() {


         };

         $scope.submit = function() {
             angular.extend(widget, $scope.form);
             $modalInstance.close(widget);
         };

         $scope.init = function() {
             jsPlumb.bind("ready", function() {
                 console.log("Set up jsPlumb listeners (should be only done once)");
                 jsPlumb.bind("connection", function(info) {
                     $scope.$apply(function() {
                         console.log("Possibility to push connection into array");
                     });
                 });
             });
         };

         $scope.openD3 = function(ev) {
             $mdDialog.show({
                 controller: 'chartSettingsCtrl',
                 templateUrl: 'views/d3plugins.html',
                 resolve: {
                     widget: function() {
                         return widget;
                     }
                 }
             });

         };

         $scope.activitylist = [];

         $scope.activitylist.push({
             Name: "Population Pyramid",
             Description: "Population Pyramid",
             icon: "styles/css/images/icons/d3/Population_Pyramid.png",
             link: "http://bl.ocks.org/mbostock/raw/4062085/"
         });

         $scope.activitylist.push({
             Name: "Bubble Chart",
             Description: "Bubble Chart",
             icon: "styles/css/images/icons/d3/bubble.png",
             link: "http://bl.ocks.org/mbostock/raw/4063269/"
         });

         $scope.activitylist.push({
             Name: "Show reel",
             Description: "Show reel",
             icon: "styles/css/images/icons/d3/showreel.png",
             link: "http://bl.ocks.org/mbostock/raw/1256572/"
         });

         $scope.activitylist.push({
             Name: "Chord Diagram",
             Description: "Chord Diagram",
             icon: "styles/css/images/icons/d3/chord.png",
             link: "http://bl.ocks.org/mbostock/raw/4062006/"
         });

         $scope.activitylist.push({
             Name: "Circle Packing",
             Description: "Circle Packing",
             icon: "styles/css/images/icons/d3/circle_packing.png",
             link: "http://bl.ocks.org/mbostock/raw/4063530/"
         });

         $scope.activitylist.push({
             Name: "Sunburst Partition",
             Description: "Sunburst Partition",
             icon: "styles/css/images/icons/d3/sunburst.png",
             link: "http://bl.ocks.org/mbostock/raw/4063423/"
         });
         $scope.activitylist.push({
             Name: "Tree Map",
             Description: "Tree Map",
             icon: "styles/css/images/icons/d3/treemao.png",
             link: "http://bl.ocks.org/mbostock/raw/4063582/"
         });

         $scope.activitylist.push({
             Name: "Voronoi Tessellation",
             Description: "Voronoi Tessellation",
             icon: "styles/css/images/icons/d3/vorony.png",
             link: "http://bl.ocks.org/mbostock/raw/4060366/"
         });

         $scope.activitylist.push({
             Name: "Hierarchical Edge Bundling",
             Description: "Hierarchical Edge Bundling",
             icon: "styles/css/images/icons/d3/hierarchial.png",
             link: "http://mbostock.github.io/d3/talk/20111116/bundle.html"
         });

         $scope.activitylist.push({
             Name: "Epicyclic Gearing",
             Description: "Epicyclic Gearing",
             icon: "styles/css/images/icons/d3/epicycling.png",
             link: "http://bl.ocks.org/mbostock/raw/1353700/"
         });

         $scope.activitylist.push({
             Name: "Collision Detection",
             Description: "Collision Detection",
             icon: "styles/css/images/icons/d3/collision.png",
             link: "http://mbostock.github.io/d3/talk/20111018/collision.html"
         });

         $scope.activitylist.push({
             Name: "Collapsible Force ",
             Description: "Collapsible Force ",
             icon: "styles/css/images/icons/d3/Collapsible_Force.png",
             link: "http://mbostock.github.io/d3/talk/20111116/force-collapsible.html"
         });

         $scope.activitylist.push({
             Name: "Zoomable Sunburst",
             Description: "Zoomable Sunburst",
             icon: "styles/css/images/icons/d3/Zoomable_Sunburst.png",
             link: "http://bl.ocks.org/mbostock/raw/4348373/"
         });

         $scope.activitylist.push({
             Name: "Aster Plot",
             Description: "Aster Plot",
             icon: "styles/css/images/icons/d3/Aster_Plot.png",
             link: "http://bl.ocks.org/bbest/raw/2de0e25d4840c68f2db1/"
         });

         $scope.activitylist.push({
             Name: "Google maps",
             Description: "Google maps",
             icon: "styles/css/images/icons/d3/sunburst.png",
             link: "http://bl.ocks.org/mbostock/raw/899711/"
         });

         $scope.cancel = function() {
             $mdDialog.cancel();
         };

         $scope.setPlugin = function(plugin) {
             widget.d3plugin = plugin.link.toString();
             widget.highchartsNG.title.text = plugin.Name;
         };

     }
 ])
 routerApp.controller('imgCtrl', ['$scope', '$timeout', '$rootScope', '$mdDialog', '$sce',

     'widget',
     function($scope, $timeout, $rootScope, $mdDialog, $sce, widget) {


     }
 ]);
