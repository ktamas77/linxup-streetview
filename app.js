(function(){
	var app = angular.module('linxup-streetview', []);

	app.controller('LinxupController', ['$http', function($http) {
		var linxup = this;
    linxup.drivers = {};

    $http.post(
        'https://www.linxup.com/ibis/rest/linxupmobile/login',
        {
          username: '###',
          password: '###'
        }
    ).success(function(response) {
        linxup.drivers = response.data.drivers;
    });
	}]);
})();