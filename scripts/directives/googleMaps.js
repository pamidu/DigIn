routerApp.directive('diginMap', function($http) {

   return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: 'views/mapView.html',
      link: function(scope, element) {
         var map = null;
         var geocoder = null;
         var markers = [];
         
      function clearOverlays() {
          for (var i = 0; i < markers.length; i++ ) {
            markers[i].setMap(null);
          }
          markers.length = 0;
        }
          
         scope.getLocations = function(data){
            var mapCanvas = document.getElementById('gmap');
           var mapOptions = {
             center: new google.maps.LatLng(-34.397, 150.644),
             zoom: 2,
             mapTypeId: google.maps.MapTypeId.ROADMAP
           }
           geocoder = new google.maps.Geocoder();
           map = new google.maps.Map(mapCanvas, mapOptions);
           var mc = new MarkerClusterer(map);   
           clearOverlays();
           function Geocode(locItem){
              var address = locItem.add;
               var likeCount = locItem.likeCount;
               if (geocoder) {
                geocoder.geocode({
                  'address': address
                }, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                    if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                       //alert(JSON.stringify(results));
                      map.setCenter(results[0].geometry.location);

                      var infowindow = new google.maps.InfoWindow({
                        content: '<div><b>' + address + '</b><br/><span style="text-align:center;">Like Count: ' + likeCount + '</span></div>',
                        size: new google.maps.Size(150, 50)
                      });

                      var marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map,
                        title: address
                      });
                      markers.push(marker);  
                       
                      google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map, marker);
                      });
                       
                      google.maps.event.addListener(map, "click", function(event) {
                         infowindow.close();
                      });
                       
                      

                    } else {
                      alert("No results found");
                    }
                  } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {    
                     setTimeout(function() {
                         Geocode(locItem);
                     }, 200);
                 } else {
                    //alert("Geocode was not successful for the following reason: " + status);
                  }
                });
              }         
           };
            data.forEach(function(locItem){
               Geocode(locItem);
            });
            var markerCluster = new MarkerClusterer(map, markers);  
          };
         scope.$on('getLocations',function(event, data){
            scope.getLocations(data.addData);
         });        
      }
   }
});