(function(){
  var linxupLoginApiUrl = 'https://www.linxup.com/ibis/rest/linxupmobile/login';
  var linxupMapApiUrl = 'https://www.linxup.com/ibis/rest/linxupmobile/map';

  var app = angular.module('linxup-streetview', []);

  app.controller('LinxupController', ['$http', '$scope', function($http, $scope) {
    $scope.linxup = this;
    $scope.linxup.drivers = {};

    // --- query all drivers ---
    $http.post(
      linxupLoginApiUrl,
      {
        username: configData.username,
        password: configData.password
      }
    ).success(function(response) {
      drivers = response.data.drivers;
      for (driverIndex in drivers) {
        driver = drivers[driverIndex];
        driverId = driver.id;
        $scope.linxup.drivers['driver'+driverId] = driver;
      }

      // --- query current positions of all drivers ---
      $http.post(
        linxupMapApiUrl,
        {
          username: configData.username,
          password: configData.password,
        }
      ).success(function(response) {
        positions = response.data.positions;
        for (positionIndex in positions) {
          position = positions[positionIndex];
          driverId = position.driverId;
          $scope.linxup.drivers['driver'+driverId].position = position;

          // --- render map
          var driverPosition = new google.maps.LatLng(
            position.latitude, 
            position.longitude);
          var mapOptions = {
            center: driverPosition,
            zoom: 11
          };
          
          var mapDiv = document.createElement('div');
          mapDiv.id = 'map_' + driverId;
          mapDiv.className = 'map-canvas';
          document.body.appendChild(mapDiv);
          var map = new google.maps.Map(mapDiv, mapOptions);   
          var panoramaOptions = {
            position: driverPosition,
            pov: {
              heading: position.direction,
              pitch: 10
            }
          }

          var panoDiv = document.createElement('div');
          panoDiv.id = 'pano_' + driverId;
          panoDiv.className = 'pano';
          document.body.appendChild(panoDiv);
          var panorama = new google.maps.StreetViewPanorama(panoDiv, panoramaOptions);
          map.setStreetView(panorama);

        }
      });
    });

  }]);

})();

