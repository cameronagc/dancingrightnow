'use strict';

(function() {
	// Danceevents Controller Spec
	describe('Danceevents Controller Tests', function() {
		// Initialize global variables
		var DanceeventsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Danceevents controller.
			DanceeventsController = $controller('DanceeventsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Danceevent object fetched from XHR', inject(function(Danceevents) {
			// Create sample Danceevent using the Danceevents service
			var sampleDanceevent = new Danceevents({
				name: 'New Danceevent'
			});

			// Create a sample Danceevents array that includes the new Danceevent
			var sampleDanceevents = [sampleDanceevent];

			// Set GET response
			$httpBackend.expectGET('danceevents').respond(sampleDanceevents);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.danceevents).toEqualData(sampleDanceevents);
		}));

		it('$scope.findOne() should create an array with one Danceevent object fetched from XHR using a danceeventId URL parameter', inject(function(Danceevents) {
			// Define a sample Danceevent object
			var sampleDanceevent = new Danceevents({
				name: 'New Danceevent'
			});

			// Set the URL parameter
			$stateParams.danceeventId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/danceevents\/([0-9a-fA-F]{24})$/).respond(sampleDanceevent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.danceevent).toEqualData(sampleDanceevent);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Danceevents) {
			// Create a sample Danceevent object
			var sampleDanceeventPostData = new Danceevents({
				name: 'New Danceevent'
			});

			// Create a sample Danceevent response
			var sampleDanceeventResponse = new Danceevents({
				_id: '525cf20451979dea2c000001',
				name: 'New Danceevent'
			});

			// Fixture mock form input values
			scope.name = 'New Danceevent';

			// Set POST response
			$httpBackend.expectPOST('danceevents', sampleDanceeventPostData).respond(sampleDanceeventResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Danceevent was created
			expect($location.path()).toBe('/danceevents/' + sampleDanceeventResponse._id);
		}));

		it('$scope.update() should update a valid Danceevent', inject(function(Danceevents) {
			// Define a sample Danceevent put data
			var sampleDanceeventPutData = new Danceevents({
				_id: '525cf20451979dea2c000001',
				name: 'New Danceevent'
			});

			// Mock Danceevent in scope
			scope.danceevent = sampleDanceeventPutData;

			// Set PUT response
			$httpBackend.expectPUT(/danceevents\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/danceevents/' + sampleDanceeventPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid danceeventId and remove the Danceevent from the scope', inject(function(Danceevents) {
			// Create new Danceevent object
			var sampleDanceevent = new Danceevents({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Danceevents array and include the Danceevent
			scope.danceevents = [sampleDanceevent];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/danceevents\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDanceevent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.danceevents.length).toBe(0);
		}));
	});
}());