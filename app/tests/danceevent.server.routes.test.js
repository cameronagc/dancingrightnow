'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Danceevent = mongoose.model('Danceevent'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, danceevent;

/**
 * Danceevent routes tests
 */
describe('Danceevent CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Danceevent
		user.save(function() {
			danceevent = {
				name: 'Danceevent Name'
			};

			done();
		});
	});

	it('should be able to save Danceevent instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Danceevent
				agent.post('/danceevents')
					.send(danceevent)
					.expect(200)
					.end(function(danceeventSaveErr, danceeventSaveRes) {
						// Handle Danceevent save error
						if (danceeventSaveErr) done(danceeventSaveErr);

						// Get a list of Danceevents
						agent.get('/danceevents')
							.end(function(danceeventsGetErr, danceeventsGetRes) {
								// Handle Danceevent save error
								if (danceeventsGetErr) done(danceeventsGetErr);

								// Get Danceevents list
								var danceevents = danceeventsGetRes.body;

								// Set assertions
								(danceevents[0].user._id).should.equal(userId);
								(danceevents[0].name).should.match('Danceevent Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Danceevent instance if not logged in', function(done) {
		agent.post('/danceevents')
			.send(danceevent)
			.expect(401)
			.end(function(danceeventSaveErr, danceeventSaveRes) {
				// Call the assertion callback
				done(danceeventSaveErr);
			});
	});

	it('should not be able to save Danceevent instance if no name is provided', function(done) {
		// Invalidate name field
		danceevent.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Danceevent
				agent.post('/danceevents')
					.send(danceevent)
					.expect(400)
					.end(function(danceeventSaveErr, danceeventSaveRes) {
						// Set message assertion
						(danceeventSaveRes.body.message).should.match('Please fill Danceevent name');
						
						// Handle Danceevent save error
						done(danceeventSaveErr);
					});
			});
	});

	it('should be able to update Danceevent instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Danceevent
				agent.post('/danceevents')
					.send(danceevent)
					.expect(200)
					.end(function(danceeventSaveErr, danceeventSaveRes) {
						// Handle Danceevent save error
						if (danceeventSaveErr) done(danceeventSaveErr);

						// Update Danceevent name
						danceevent.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Danceevent
						agent.put('/danceevents/' + danceeventSaveRes.body._id)
							.send(danceevent)
							.expect(200)
							.end(function(danceeventUpdateErr, danceeventUpdateRes) {
								// Handle Danceevent update error
								if (danceeventUpdateErr) done(danceeventUpdateErr);

								// Set assertions
								(danceeventUpdateRes.body._id).should.equal(danceeventSaveRes.body._id);
								(danceeventUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Danceevents if not signed in', function(done) {
		// Create new Danceevent model instance
		var danceeventObj = new Danceevent(danceevent);

		// Save the Danceevent
		danceeventObj.save(function() {
			// Request Danceevents
			request(app).get('/danceevents')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Danceevent if not signed in', function(done) {
		// Create new Danceevent model instance
		var danceeventObj = new Danceevent(danceevent);

		// Save the Danceevent
		danceeventObj.save(function() {
			request(app).get('/danceevents/' + danceeventObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', danceevent.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Danceevent instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Danceevent
				agent.post('/danceevents')
					.send(danceevent)
					.expect(200)
					.end(function(danceeventSaveErr, danceeventSaveRes) {
						// Handle Danceevent save error
						if (danceeventSaveErr) done(danceeventSaveErr);

						// Delete existing Danceevent
						agent.delete('/danceevents/' + danceeventSaveRes.body._id)
							.send(danceevent)
							.expect(200)
							.end(function(danceeventDeleteErr, danceeventDeleteRes) {
								// Handle Danceevent error error
								if (danceeventDeleteErr) done(danceeventDeleteErr);

								// Set assertions
								(danceeventDeleteRes.body._id).should.equal(danceeventSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Danceevent instance if not signed in', function(done) {
		// Set Danceevent user 
		danceevent.user = user;

		// Create new Danceevent model instance
		var danceeventObj = new Danceevent(danceevent);

		// Save the Danceevent
		danceeventObj.save(function() {
			// Try deleting Danceevent
			request(app).delete('/danceevents/' + danceeventObj._id)
			.expect(401)
			.end(function(danceeventDeleteErr, danceeventDeleteRes) {
				// Set message assertion
				(danceeventDeleteRes.body.message).should.match('User is not logged in');

				// Handle Danceevent error error
				done(danceeventDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Danceevent.remove().exec();
		done();
	});
});