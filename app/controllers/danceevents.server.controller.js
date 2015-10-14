'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Danceevent = mongoose.model('Danceevent'),
    Upload = require('s3-uploader'),
	_ = require('lodash');


/**
 * Create a Danceevent
 */
exports.create = function(req, res) {


	 //todo : store file to disk n the server and then use node-s3-uploader.
	//because with s3-multer we cannot set the rights / ACL during the upload. such a shame.
	/* todo for later use.
	* var client = new Upload('my_s3_bucket', {
	 aws: {
	 path: 'images/',
	 region: 'us-east-1',
	 acl: 'public-read'
	 },

	 cleanup: {
	 versions: true,
	 original: false
	 },

	 original: {
	 awsImageAcl: 'private'
	 },

	 versions: [{
	 maxHeight: 1040,
	 maxWidth: 1040,
	 format: 'jpg',
	 suffix: '-large',
	 quality: 80
	 },{
	 maxWidth: 780,
	 aspect: '3:2!h',
	 suffix: '-medium'
	 },{
	 maxWidth: 320,
	 aspect: '16:9!h',
	 suffix: '-small'
	 },{
	 maxHeight: 100,
	 aspect: '1:1',
	 format: 'png',
	 suffix: '-thumb1'
	 },{
	 maxHeight: 250,
	 maxWidth: 250,
	 aspect: '1:1',
	 suffix: '-thumb2'
	 }]
	 });


	 client.upload('/some/image.jpg', {}, function(err, versions, meta) {
	 if (err) { throw err; }

	 versions.forEach(function(image) {
	 console.log(image.width, image.height, image.url);
	 // 1234 4567 https://my-bucket.s3.amazonaws.com/path/ab/cd/ef.jpg
	 });
	 });
	* */
	if(_.get(req,'file.fieldname') === 'flyer'){
		req.body.flyer = 'https://s3.amazonaws.com/danceappprod/' + _.get(req,'file.key','');
	}else{
		req.body.flyer = '';
	}

	var danceevent = new Danceevent(req.body);

	danceevent.user = req.user;

	danceevent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(danceevent);
		}
	});
};

/**
 * Show the current Danceevent
 */
exports.read = function(req, res) {
	res.jsonp(req.danceevent);
};

/**
 * Update a Danceevent
 */
exports.update = function(req, res) {
	var danceevent = req.danceevent ;

	danceevent = _.extend(danceevent , req.body);

	danceevent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(danceevent);
		}
	});
};

/**
 * Delete an Danceevent
 */
exports.delete = function(req, res) {
	var danceevent = req.danceevent ;

	danceevent.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(danceevent);
		}
	});
};

/**
 * List of Danceevents
 */
exports.list = function(req, res) { 
	Danceevent.find().sort('-created').populate('user', 'displayName').exec(function(err, danceevents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(danceevents);
		}
	});
};

/**
 * Danceevent middleware
 */
exports.danceeventByID = function(req, res, next, id) { 
	Danceevent.findById(id).populate('user', 'displayName').exec(function(err, danceevent) {
		if (err) return next(err);
		if (! danceevent) return next(new Error('Failed to load Danceevent ' + id));
		req.danceevent = danceevent ;
		next();
	});
};

/**
 * Danceevent authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.danceevent.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
