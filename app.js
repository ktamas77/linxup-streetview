(function(){
  var linxupLoginApiUrl = 'https://www.linxup.com/ibis/rest/linxupmobile/login';
  var linxupMapApiUrl = 'https://www.linxup.com/ibis/rest/linxupmobile/map';

  var app = angular.module('linxup-streetview', []);
  
  app.directive('driverInfo', function() {
    return {
      link: function (scope, element, attr) {
      },
      templateUrl: 'driver-info.html'
    };
  });

  app.directive('driverMap', ['$interval', '$http', function($interval, $http) {
    return {
      link: function (scope, element, attr) {
        element.attr('id', 'drivermap_' + scope.driver.id);
        $http.post(
          linxupMapApiUrl,
          {
            username: configData.username,
            password: configData.password,
            driverId: scope.driver.id
          }
        ).success(function(response) {
          driverIndex = 'driver' + scope.driver.id;

          positions = response.data.positions;
          scope.driverPos[driverIndex] = positions[positions.length-1];
          var driverPosition = new google.maps.LatLng(
            scope.driverPos[driverIndex].latitude, 
            scope.driverPos[driverIndex].longitude
          );        
          var mapOptions = {
            center: driverPosition,
            zoom: 13
          };

          scope.googleMap[driverIndex] = new google.maps.Map(element[0], mapOptions);
          
          panoramaOptions = {
            position: driverPosition,
            pov: {
              heading: scope.driverPos[driverIndex].direction,
              pitch: 10
            }
          };
          
          scope.googleView[driverIndex] = 
            new google.maps.StreetViewPanorama(
              document.getElementById('driverview_' + scope.driver.id), 
              panoramaOptions
            );

          scope.googleMap[driverIndex].setStreetView(scope.googleView[driverIndex]);
        });
      }
    }
  }]);

  app.directive('driverView', ['$interval', '$http', function($interval, $http) {
    return {
      link: function (scope, element, attr) {
        element.attr('id', 'driverview_' + scope.driver.id);
      }
    }
  }]);
  
  app.controller('LinxupController', ['$http', '$scope', function($http, $scope) {
    $scope.linxup = this;
    $scope.linxup.drivers = {};
    $scope.googleMap = {}
    $scope.googleView = {}
    $scope.driverPos = {}

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
    });
  }]);
})();

