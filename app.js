(function(){
	var app = angular.module('linxup-streetview', [ ]);

	app.controller('LinxupController', function(){
		this.vehicles = demoPositions;
	});

	var demoPositions = {
                   "data": {
                       "positions": [ {
                           "date": 1381254908000,
                           "label": "Vehicle One",
                           "latitude": 38.6558,
                           "longitude": -90.5618,
                           "heading": "S",
                           "direction": 163,
                           "speed": 80,
                           "speeding": true,
                           "behaviorCd": "HAC",
                           "estSpeedLimit": 70
                       }, {
                           "date": 1383775826000,
                           "label": "Vehicle Two",
                           "latitude": 38.598,
                           "longitude": -90.4347,
                           "heading": "N",
                           "direction": 0,
                           "speed": 0,
                           "speeding": null,
                           "behaviorCd": null,
                           "estSpeedLimit": null
                       }, {
                           "date": 1383743827000,
                           "label": "Vehicle Three",
                           "latitude": 38.6553,
                           "longitude": -90.5619,
                           "heading": "SE",
                           "direction": 146,
                           "speed": 45,
                           "speeding": null,
                           "behaviorCd": null,
                           "estSpeedLimit": null
					}] },
                   "responseType": "Success"
               }


})();