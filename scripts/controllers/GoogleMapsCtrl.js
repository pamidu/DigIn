function googleMapsLoad(widId, $scope, $http, $rootScope, $mdDialog) {
   
    $scope.changeMap = function() {

        var objIndex = getRootObjectById(widId, $rootScope.dashboard.widgets);
        var longitude = $scope.longitude;
        var lattitude = $scope.lattitude;
        
        $mdDialog.hide();

        document.getElementById('map').innerHTML = "";

        var array = JSON.parse($rootScope.json_string);

        $scope.locationData = [];

        var k,j,temparray,chunk = 8;
        for (k=0,j=array.length; k<j; k+=chunk) {
            temparray = array.slice(k,k+chunk);

            var i;
            for(i=0;i < temparray.length ; i++){

                Geocode(temparray[i].PLACE_OF_ACCIDENT);   
            }
        
        }

        setTimeout(function(){ googleMap(); }, 5000);
                  
        $rootScope.longitude = longitude;
        $rootScope.lattitude = lattitude;

    };
    function Geocode(address) {
        var obj = {};
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({'address': address}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        obj = {
                            lat : results[0].geometry.location.G,
                            lng : results[0].geometry.location.K
                        };

                        setTimeout(function(){ $scope.locationData.push(obj); }, 100);
                                             
                    }
                    else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {    
                        setTimeout(function() {
                        Geocode(address);
                        }, 100); 
                    }
                    else if (status === google.maps.GeocoderStatus.ZERO_LIMIT) {    
                        setTimeout(function() {
                        Geocode(address);
                        }, 100); 
                    }
                    else {

                      alert('Geocode was not successful for the following reason: ' + status);
                    }

        });     
    }

   function googleMap() {

        var dataStore = $scope.locationData;

        var array = JSON.parse($rootScope.json_string);

         var map = new google.maps.Map(document.getElementById('map'),{
            center: {lat: 7.85, lng: 80.65},
            zoom: 6 });

        var pinImageGreen = new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
        var pinImageBlue = new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
        var marker = [];

        var k;

        for(k=0; k < array.length; k++){

            // if(array[k].state == "High"){

                    marker[k] = new google.maps.Marker({
                    position: {lat: dataStore[k].lat, lng: dataStore[k].lng},
                    map: map,
                    title: array[k].PLACE_OF_ACCIDENT,
                    icon: pinImageGreen,
                    VEHICLE_TYPE: array[k].VEHICLE_TYPE,
                    VEHICLE_USAGE: array[k].VEHICLE_USAGE,
                    // modal: array[k].modal,
                    VEHICLE_CLASS: array[k].VEHICLE_CLASS
                    });
                    
                    marker[k].addListener('click', function(data) {

                        var j;
                        for(j=0;j<array.length;j++){
                            
                            if((dataStore[j].lat == data.latLng.G)  && (dataStore[j].lng == data.latLng.K )){
                                
                               /* document.getElementById("details").innerHTML = 
                                array[j].PLACE_OF_ACCIDENT + "</br>" +
                                array[j].VEHICLE_TYPE + "</br>" +
                                array[j].VEHICLE_USAGE + "</br>" +
                                array[j].VEHICLE_CLASS + "</br>" ;*/
                            }  
                        }    
                    });
   
            }
            
    }


    $scope.cancel = function() {
        $mdDialog.hide();
    };

}