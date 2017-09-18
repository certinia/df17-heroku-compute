'use strict';

const
	bodyParser = require('body-parser'),
	debug = require('debug-plus')('df17~heroku~compute:server:server'),
	express = require('express'),
	helmet = require('helmet'),

	Auth = require('./middleware/auth'),
	Primes = require('./routes/primes'),

	HELMET_CONFIG = Object.freeze({
		frameguard: { action: 'deny' },
		xssFilter: true
	});

class Server {
	static init() {
		const
			app = express(),
			port = process.env.PORT || 8080;

		// Reads request.body
		app.use(bodyParser.json());

		// Sets various HTTP headers that make the response
		// more secure
		app.use(helmet(HELMET_CONFIG));

		// Ensures header contains Salesforce org details
		// so we can send the response back to the correct org
		app.use(Auth.middleware);

		// Adds "/primes" route
		Primes.addRoute(app);

		// Start server.
		// Return it so that the caller can close it (helpful in tests)
		debug('server listening on port: %s', port);
		return app.listen(port);
	}
}

module.exports = Server;
