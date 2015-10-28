'use strict';
var passport = require('passport');
module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var danceevents = require('../../app/controllers/danceevents.server.controller');
	var multer = require('multer'),
		s3 = require('multer-s3');

	var upload = multer({
		storage: s3({
			dirname: 'uploads/photos',
			bucket: 'danceappprod',
			secretAccessKey: 'oVxZ4jxEUD8jtkX5Kj02TDQH5ItXvVMi4ZYVAE6R',
			accessKeyId: 'AKIAJ5JIDBFBZNPTJERQ',
			region: 'us-east-1',
			filename: function (req, file, cb) {
				cb(null, Date.now());
			}
		})
	});

	// Danceevents Routes
	// GET method route


	app.route('/danceevents')
		.get(danceevents.list)
		.post(users.requiresLogin,  upload.single('flyer'), danceevents.create);

	app.route('/danceevents/:danceeventId')
		.get(danceevents.read)
		.put(users.requiresLogin, danceevents.hasAuthorization, danceevents.update)
		.delete(users.requiresLogin, danceevents.hasAuthorization, danceevents.delete);

	app.route('/mydances')
		.get(danceevents.list)
		.post(users.requiresLogin, danceevents.create);

	// Finish by binding the Danceevent middleware
	app.param('danceeventId', danceevents.danceeventByID);

};
//CORS Implementation code
//app.use(function(req, res, next) {
//	res.header("Access-Control-Allow-Origin", "*");
//	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//	next();
//});
//
//app.get('/', function(req, res, next) {
//	// Handle the get for this route
//});
//
//app.post('/', function(req, res, next) {
//	// Handle the post for this route
//});


