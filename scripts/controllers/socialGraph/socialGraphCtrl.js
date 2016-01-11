routerApp.controller('socialGraphCtrl', function($scope, config, fbGraphServices, $http, Digin_Engine_API1, $rootScope, $mdDialog) {

   $scope.totalLikes = 0;
   
   $scope.init = function() {

      setTimeout(function() {
         $('#content1').css("height", "100%");
      }, 3000);

   }
   $scope.accounts = [];

   $scope.pageSearchPara = {
      startDate: new Date(),
      endDate: new Date()
   };
   
   //getting the service response
   function getServiceResponse(serviceUrl, callback){
      console.log('Sevice URL:'+serviceUrl);
      $http({
         method : 'GET',
         url: serviceUrl
      }).success(function(data, status){
         callback(data);
      }).error(function(data, status){
         console.log('unexpected error occured');
      });
   };
   
   //generate the chart
   function generateChart(data){
      var configSeries = [];
      $scope.totalViews = 0;
      var colorObj = {'page_views':'#00796B','page_fans':'#B2DFDB','page_stories':'#FFFFFF'};
      data.forEach(function(entry) {
         $scope.configData = [];
         var seriesName = '';
         entry.data.forEach(function(value) {
            var x = value[0].split('T')[0];
            
            var enDate = x.replace(/-/g, ",").split(',');
            
            if(entry.name == 'page_views') {
               seriesName = 'Page Views';
               $scope.totalViews += value[1];
            }
            
            if(entry.name == 'page_fans') {
               seriesName = 'Page Likes';
               $scope.totalLikes = value[1];
            }
            
            if(entry.name == 'page_stories') seriesName = 'Page Stories';
            
            $scope.configData.push([
               Date.UTC(enDate[0], enDate[1], enDate[2]),
               value[1]
            ]);
         });         
         
         configSeries.push({
            type: 'column',
            name: seriesName,
            data: $scope.configData,
            color: colorObj[entry.name]
         });
      });
      
      $scope.highchartsNG = {options:{chart:{type:"column",backgroundColor:null,spacingBottom:15,spacingTop:10,spacingLeft:10,spacingRight:10,width:680,height:300},plotOptions:{column:{borderWidth:0,groupPadding:0,shadow:!1}}},credits:{enabled:false},xAxis:{type:"datetime"},yAxis:{labels:{style:{color:"#fff",fontSize:"12px",fontFamily:"Ek Mukta, sans-serif",fontWeight:"200"},formatter:function(){return this.value}}},plotOptions:{column:{pointPadding:.1,borderWidth:0}},title:{text:""},loading:!1};
      
      $scope.highchartsNG['series'] = configSeries;
   };
   
   //set the map
   function setMap(data){
      for (var key in data.value) {
        if (Object.prototype.hasOwnProperty.call(data.value, key)) {
           $scope.arrAdds.push({add:key, likeCount: data.value[key]});
        }
      }

      $rootScope.$broadcast('getLocations',{addData:$scope.arrAdds});
   };
   
   $scope.getPageDetails = function (page, pageTimestamps, changedTime){
      
      var serviceUrl = Digin_Engine_API1 + 'pageoverview?metric_names=[%27page_views%27,%27page_fans%27,%27page_stories%27]&token=' 
      + page.accessToken + '&since='+pageTimestamps.sinceStamp+'&until='+pageTimestamps.untilStamp;
      
      getServiceResponse(serviceUrl, function(data){
         console.log('chart data:'+JSON.stringify(data));
         generateChart(data);
         serviceUrl = Digin_Engine_API1 + 'fbpostswithsummary?token=' + page.accessToken + '&%27since%27='+pageTimestamps.sinceStamp+'&%27until%27='+pageTimestamps.untilStamp;
         getServiceResponse(serviceUrl, function(data){
            $scope.postsObj = data;
            $scope.arrAdds = [];
            $scope.postCount = data.length;
            serviceUrl = Digin_Engine_API1 + 'demographicsinfo?token=' + page.accessToken;
            getServiceResponse(serviceUrl, function(data){
               setMap(data);
               $scope.page = page;
               if(!changedTime)
               $scope.activePageSearch = !$scope.activePageSearch;
            });
         });
      });   
   };
   
   //on load current page details
   $scope.page = null;
   $scope.activePageSearch = true;
   
   $scope.viewPageDetails = function(page) {
      $scope.untilDate = new Date();
      var secondDate = new Date();
      secondDate.setDate($scope.untilDate.getDate() - 60);
      $scope.sinceDate = secondDate;
      $scope.getPageDetails(page, getBoundaryTimestamps(60, new Date()));
   };
   
   $scope.changeTimeRange = function(){
      var since = new Date($scope.sinceDate);
      var until = new Date($scope.untilDate);
      //alert(typeof(since));
      var timeObj = {
           sinceStamp: Math.floor(since / 1000),
           untilStamp: Math.floor(until / 1000)
       };
      $scope.getPageDetails($scope.page, timeObj, true);
   };

   //Search fb page
   $scope.isSearchingPage = false;
   $scope.loginWithFb = function() {
      if (fbInterface.state != 'connected') {
         fbInterface.loginToFb($scope);
      } else {
         fbInterface.logoutFromFb($scope);
      }
   };
   
   /*Post and Visitors */
   $scope.chooseView = {
      Post: 'Posts'
   };

   
   //when select view post or visitors
   $scope.viewLayout = {
      'isPost': true,
      'isVisitor': false
   };
   
   //viewing a single post
   $scope.viewSinglePost = function(post){
      $mdDialog.show({
          controller: singlePostCtrl,
          templateUrl: 'views/socialGraph/fbPost_template.html',
          clickOutsideToClose: true,
          locals: {
             fbPost: post
          }
      });
   };

});


function singlePostCtrl($scope,fbPost){
   $scope.myPost = fbPost;
};



