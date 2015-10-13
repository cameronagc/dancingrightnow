'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Danceevent Schema
 */
var DanceeventSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Event name',
		trim: true
	},
		venue: {
		type: String,
		default: '',
		//required: 'Please fill Venue name',
		trim: true
	},
		street: {
		type: String,
		default: '',
		trim: true
	},
		city: {
		type: String,
		default: '',
		//required: 'City Required',
		trim: true
	},
		state: {
		type: String,
		default: '',
		//required: 'State Required',
		trim: true
	},
		zip: {
		type: String,
		default: '',
		trim: true
	},
	    date: {
		type: Date,
		default: '',
		trim: true
	},
		
		startHour: {
		type: String,
		default: '',
		trim: true
	},
		startMinute: {
		type: String,
		default: '',
		trim: true
	},
		startPM: {
		type: String,
		default: '',
		trim: true
	},
		endHour: {
		type: String,
		default: '',
		trim: true
	},
		endMinute: {
		type: String,
		default: '',
		trim: true
	},
		endPM: {
		type: String,
		default: '',
		trim: true
	},
	flyer : {
		type: String,
		default: '',
		trim: true
	},
		description: {
		type: String,
		default: '',
		trim: true
	},
		longitude: {
		type: String,
		default: '',
		trim: true
	},
		latitude: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Danceevent', DanceeventSchema);
