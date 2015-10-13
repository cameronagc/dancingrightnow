'use strict';

//Danceevents service used to communicate Danceevents REST endpoints
angular.module('danceevents').factory('Danceevents', ['$resource',
	function($resource) {
		return $resource('danceevents/:danceeventId', { danceeventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);