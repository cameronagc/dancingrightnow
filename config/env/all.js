'use strict';

module.exports = {
	app: {
		title: 'Dancing Right Now',
		description: 'Find or Create a Dance Event Near You',
		keywords: 'Dancing, Dance Compeitions, Dance Events'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/jquery-css/jquery-ui.css',
				'public/lib/angular-datepicker/dist/angular-datepicker.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/jquery/dist/jquery-1.10.2.js',
				'public/lib/jquery/dist/jquery-ui.js',
				'public/lib/angular-datepicker/dist/angular-datepicker.js',
				'public/lib/ng-file-upload/ng-file-upload-all.min.js',
				'public/geolocate/geolocate.js',
				'public/lib/autofill-directive/autofill-directive.js',
				'public/lib/angular-resource/angular-resource.js'
				//'public/lib/bootstrap/controls/pikaday.js',
				//'public/lib/bootstrap/controls/datepicker.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
