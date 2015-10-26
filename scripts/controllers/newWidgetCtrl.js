routerApp.controller('WidgetCtrl', ['$scope', '$timeout', '$rootScope','$mdDialog','$sce','$http','$objectstore','dashboard',
  function($scope, $timeout, $rootScope, $mdDialog,$sce,$http,$objectstore,dashboard) {
    //$scope.dashboard = dashboard;
    $rootScope.dashboard = dashboard;

    getJSONData($http,'widgetType',function(data){
     $scope.WidgetTypes=data;
    });

    getJSONData($http,'widgets',function(data){
     $scope.Widgets=data;
    });
    
    $scope.hideDialog = function(){
      $mdDialog.hide();
    };

    $scope.filterWidgets = function(item)
    {
      if(item == null)
      {
        item.title = "Visualization";
      }
      $scope.selected = {};
      $scope.selected.type = item.title; 
      $rootScope.widgetType = $scope.selected.type;
    };

   $scope.openInitialConfig = function(ev,id){
      //alert($scope.currWidget.uniqueType);

    $mdDialog.show({
      controller: eval($scope.currWidget.initCtrl),
      templateUrl: 'views/'+$scope.currWidget.initTemplate+'.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals: {widId : id}
    })
    .then(function() {
      //$mdDialog.hide();
    }, function() {
      //$mdDialog.hide();
    });
   };


   $scope.addAllinOne = function(widget,ev) {

    console.log('type of selected widget:'+widget.title);
    $mdDialog.hide();

    getJSONDataByIndex($http,'widgetPositions',$rootScope.dashboard.widgets.length,function(data){
       $scope.leftPosition = data.leftPosition;
       $scope.topPosition = data.topPosition;
       $scope.ChartType = data.ChartType;
       $scope.currWidget = {
        widData:{},
        widChart: widget.widConfig,
        widView:widget.widView,
        initTemplate: widget.initTemplate,
        initCtrl: widget.initController,
    uniqueType: widget.title,
    expanded: true,
    seriesname :"",
    externalDataURL: "",
    dataname:"",
    d3plugin:"",
     divider: false,    
    chartSeries : $scope.chartSeries,
    query:"select * from testJay where Name!= 'Beast Master'",
    id: "chart" + Math.floor(Math.random()*(100-10+1)+10),
    type:"All",
    width : '350px',
    left :  $scope.leftPosition +'px',
    top :  $scope.topPosition +'px',
    height : '270px',
    chartTypes:[
  {"id": "line", "title": "Line"},
  {"id": "spline", "title": "Smooth line"},
  {"id": "area", "title": "Area"},
  {"id": "areaspline", "title": "Smooth area"},
  {"id": "column", "title": "Column"},
  {"id": "bar", "title": "Bar"},
  {"id": "pie", "title": "Pie"},
  {"id": "scatter", "title": "Scatter"}
  ],
       dashStyles:[
  {"id": "Solid", "title": "Solid"},
  {"id": "ShortDash", "title": "ShortDash"},
  {"id": "ShortDot", "title": "ShortDot"},
  {"id": "ShortDashDot", "title": "ShortDashDot"},
  {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
  {"id": "Dot", "title": "Dot"},
  {"id": "Dash", "title": "Dash"},
  {"id": "LongDash", "title": "LongDash"},
  {"id": "DashDot", "title": "DashDot"},
  {"id": "LongDashDot", "title": "LongDashDot"},
  {"id": "LongDashDotDot", "title": "LongDashDotDot"}
  ],

  chartStack : [
  {"id": '', "title": "No"},
  {"id": "normal", "title": "Normal"},
  {"id": "percent", "title": "Percent"}
  ],
    chartConfig : {
       exporting: {
         enabled: false
},
    options: {
    chart: {         
      type:  $scope.ChartType
    },
     
      plotOptions: {
        series: {
          stacking: ''
        }
      }
    },
   series: $scope.chartSeries,
    title: {
    text: widget.title,
    style: {
        display: 'none'
    }
    },
    subtitle: {
    text: '',
    style: {
        display: 'none'
    }
},
    credits: {
      enabled: false,
    
    },

    loading: false,
    size: {
       height :220,
     width :300
    }
  }
    
  }

         
         $rootScope.dashboard.widgets.push($scope.currWidget);
         
         if($scope.currWidget.uniqueType != "Predefined Analytics") 
         {
         //opening initial widget config dialog
         $scope.openInitialConfig(ev, $scope.currWidget.id);
         }

    });


    //save the type of the widget for the purpose of the socialMediaCtrl
    $rootScope.widgetType = widget.title;


  }; 
    }
    ]);