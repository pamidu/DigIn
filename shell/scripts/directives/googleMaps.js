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
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers.length = 0;
            }

            scope.getLocations = function(data) {
                var mapCanvas = document.getElementById('gmap');
                if (mapCanvas != null) {
                    var mapOptions = {
                        center: new google.maps.LatLng(7.8731,  80.7718),
                        zoom: 6,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                    geocoder = new google.maps.Geocoder();
                    map = new google.maps.Map(mapCanvas, mapOptions);
                    var mc = new MarkerClusterer(map);
                    clearOverlays();
                }

                function Geocode(locItem) {
                    console.log(locItem);
                    if ('total_sales' in locItem) {
                        var sales = locItem.total_sales;
                        var custName = locItem.customername;
                    }
                    var address = locItem.add;
                    if ('likeCount' in locItem) {
                        var likeCount = locItem.likeCount;
                    }

                    if (geocoder) {
                        geocoder.geocode({
                            'address': address
                        }, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                                    //alert(JSON.stringify(results));
                                    map.setCenter(results[0].geometry.location);
                                    if (typeof(sales) !== "undefined" && sales !== null) {


                                        var infowindow = new google.maps.InfoWindow({
                                            content: '<div><b>' + custName + '</b><br/><span style="text-align:center;">Sales Amount: ' + sales + '</span></div>',
                                            size: new google.maps.Size(150, 50)
                                        });
                                    }

                                    if (typeof(likeCount) !== "undefined" && likeCount !== null) {
                                        var infowindow = new google.maps.InfoWindow({
                                            content: '<div><b>' + address + '</b><br/><span style="text-align:center;">Like Count: ' + likeCount + '</span></div>',
                                            size: new google.maps.Size(150, 50)
                                        });

                                    }
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
                data.forEach(function(locItem) {
                    Geocode(locItem);
                });
                if (mapCanvas != null) {
                    var markerCluster = new MarkerClusterer(map, markers);
                }
            };
            scope.$on('getLocations', function(event, data) {
                scope.getLocations(data.addData);
            });
        }
    }
});

routerApp.directive("pageImage", function() {
    return {
        restrict: 'EA',
        scope: {
            id: "@"
        },
        template: "<img ng-src='{{cover}}' class='fb-page-img'/>",
        link: function(scope, element, attributes) {
            console.log(scope.id);
            FB.api(scope.id + '/picture?width=150&height=150', function(response) {
                if (response) {
                    scope.cover = response.data.url;
                }

            });
        }
    }
});
