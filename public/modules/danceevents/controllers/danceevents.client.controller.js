'use strict';
var myApp = angular.module('myApp', ['autofill-directive']);
// Danceevents controller
angular.module('danceevents').controller('DanceeventsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Danceevents', 'Upload',
	function($scope, $stateParams, $location, Authentication, Danceevents, Upload) {
		$scope.authentication = Authentication;
		$scope.params = {
			eventDate: null
		};
		$scope.newDanceEvent = {};
		$scope.flyer = {};

		// Create new Danceevent
		$scope.create = function(formData) {
			// Create new Danceevent object
			var danceevent = new Danceevents (formData);

			danceevent.flyer = $scope.flyer;

			//$scope.upload = function (file) {
				Upload.upload({
					url: 'danceevents',
					data: danceevent
				}).then(function (resp) {
					//console.log('Success ' + resp.config.data.file.name + 'uploaded.response: ' + resp.data);
					console.log(resp);
					$location.path('danceevents/' + resp.data._id);

					// Clear form fields
					$scope.name = '';
				}, function (resp) {
					console.log('Error status: ' + resp.status);
					$scope.error = resp.message;
				}, function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				});
			//};

			// Redirect after save
			/*danceevent.$save(function(response) {
				$location.path('danceevents/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});*/
		};

		// Remove existing Danceevent
		$scope.remove = function(danceevent) {
			if ( danceevent ) { 
				danceevent.$remove();

				for (var i in $scope.danceevents) {
					if ($scope.danceevents [i] === danceevent) {
						$scope.danceevents.splice(i, 1);
					}
				}
			} else {
				$scope.danceevent.$remove(function() {
					$location.path('danceevents');
				});
			}
		};

		// Update existing Danceevent
		$scope.update = function() {
			var danceevent = $scope.danceevent;

			danceevent.$update(function() {
				$location.path('danceevents/' + danceevent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Danceevents
		$scope.find = function() {
			$scope.danceevents = Danceevents.query();
		};

		// Find existing Danceevent
		$scope.findOne = function() {
			$scope.danceevent = Danceevents.get({ 
				danceeventId: $stateParams.danceeventId
			});
		};
	}
]);
