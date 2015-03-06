(function(){
  var linxupLoginApiUrl = 'https://www.linxup.com/ibis/rest/linxupmobile/login';
  var linxupMapApiUrl = 'https://www.linxup.com/ibis/rest/linxupmobile/map';

  var app = angular.module('linxup-streetview', []);
  
  app.directive('driverInfo', function() {
    return {
      link: function (scope, element, attr) {
      },
      templateUrl: '/templates/driver-info.html'
    };
  });

  app.directive('driverMap', ['$interval', '$http', function($interval, $http) {
    return {
      link: function (scope, element, attr) {
        element.attr('id', 'drivermap_' + scope.driver.id);
        driverIndex = 'driver' + scope.driver.id;
        mapOptions = {
          zoom: 13
        };
        scope.googleMap[driverIndex] = new google.maps.Map(element[0], mapOptions);
      }
    }
  }]);

  app.directive('driverView', ['$interval', '$http', function($interval, $http) {
    return {
      link: function (scope, element, attr) {
        element.attr('id', 'driverview_' + scope.driver.id);
        driverIndex = 'driver' + scope.driver.id;
        panoramaOptions = {
          pov: {
            heading: 0,
            pitch: 0
          }
        };
        scope.googleView[driverIndex] = 
          new google.maps.StreetViewPanorama(
            document.getElementById('driverview_' + scope.driver.id), 
            panoramaOptions
          );
        scope.googleMap[driverIndex].setStreetView(scope.googleView[driverIndex]);
      }
    }
  }]);
  
  app.controller('LinxupController', ['$interval', '$http', '$scope', function($interval, $http, $scope) {
    $scope.linxup = this;
    $scope.linxup.drivers = {};
    $scope.googleMap = {}
    $scope.googleView = {}

    // --- query all drivers ---
    function fetchDrivers() {
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
            driverIndex = 'driver'+driverId;
            $scope.linxup.drivers[driverIndex].position = position;

            // --- update map
            var driverPosition = new google.maps.LatLng(
              position.latitude, 
              position.longitude
            );     
            if ($scope.googleMap[driverIndex]) {
              $scope.googleMap[driverIndex].panTo(driverPosition);
            }
            if ($scope.googleView[driverIndex]) {
             $scope.googleView[driverIndex].setPosition(driverPosition);
             $scope.googleView[driverIndex].setPov({
               heading: position.direction,
               pitch: 10
             });
            }
          }
        });


      });
    }

    fetchDrivers();
    timeoutId = $interval(function() {
      fetchDrivers();
    }, 1000 * 20);

  }]);
})();

