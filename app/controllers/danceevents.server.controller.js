'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Danceevent = mongoose.model('Danceevent'),
	_ = require('lodash');


/**
 * Create a Danceevent
 */
exports.create = function(req, res) {

	//req.body.flyer = req.file.url;

	var danceevent = new Danceevent(req.body);

//	if(_.get(req,'file.fieldname') === 'flyer'){
		body.flyer = 'https://s3.amazonaws.com/danceappprod/' + req.file.key; /*_.get(req,'file.key','');
*///	}else{
//		body.flyer = '';
//	}


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
