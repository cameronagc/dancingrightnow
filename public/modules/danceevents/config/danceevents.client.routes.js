'use strict';

//Setting up route
angular.module('danceevents').config(['$stateProvider',
	function($stateProvider) {
		// Danceevents state routing
		$stateProvider.
		state('listDanceevents', {
			url: '/danceevents',
			templateUrl: 'modules/danceevents/views/list-danceevents.client.view.html'
		}).
		state('createDanceevent', {
			url: '/danceevents/create',
			templateUrl: 'modules/danceevents/views/create-danceevent.client.view.html'
		}).
		state('viewDanceevent', {
			url: '/danceevents/:danceeventId',
			templateUrl: 'modules/danceevents/views/view-danceevent.client.view.html'
		}).
		state('editDanceevent', {
			url: '/danceevents/:danceeventId/edit',
			templateUrl: 'modules/danceevents/views/edit-danceevent.client.view.html'
		});
	}
]);