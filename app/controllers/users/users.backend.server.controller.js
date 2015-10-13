'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.all_users = function(req, res) {
	User.find().skip((req.query._page -1) * req.query._perPage).limit(req.query._perPage).exec(function (err, users) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			User.count('', function(err, response) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.set({'X-Total-Count': response});
					return res.status(200).send(users);
				}
			});
		}
	});
};

exports.get_user = function (req, res) {
	User.findOne({'_id': req.params.userId}).exec(function (err, user) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			return res.status(200).send(user);
		}
	});
};

exports.update_user = function(req, res) {
	User.findOne({'_id': req.params.userId}).exec(function (err, user) {
		var date_start, date_end;
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if(user) {
				user.username = req.body.username;
				user.email = req.body.email;
				user.created = (!!req.body.created ? new Date(req.body.created).toISOString() : new Date().toISOString());
				user.points = req.body.points;
				user.roles = req.body.roles.replace(/ /g,'').replace(/,,/g,'').replace(/,$/, '').split(',');
				user.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						return res.status(200).send({
							message: 'success'
						});
					}
				});
			}

		}
	});
};

exports.delete_user = function (req, res) {
	User.findOne({'_id': req.params.userId}).exec(function (err, user) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			user.remove(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					return res.status(200).send({
						message: 'deleted'
					});
				}
			});
		}
	});
};


exports.create_user = function (req, res) {
	var user = new User({
		provider: 'local',
		email: req.body.email,
		password: req.body.password,
		username: req.body.username,
		roles: req.body.roles.replace(/ /g,'').replace(/,,/g,'').replace(/,$/, '').split(',')
	});
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			return res.status(200).send({
				'_id': user._id
			});
		}
	});
};

