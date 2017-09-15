'use strict';

const
	bodyParser = require('body-parser'),
	debug = require('debug-plus')('df17~heroku~compute:server:server'),
	express = require('express'),
	helmet = require('helmet'),

	Auth = require('./middleware/auth'),

	Primes = require('./routes/primes'),

	PORT = process.env.PORT || 8080;

class Server {
	static init() {
		const app = express();

		// Reads request.body
		app.use(bodyParser.json());

		// Sets various HTTP headers that make the response
		// more secure
		app.use(helmet());

		// Ensures header contains Salesforce org details
		// so we can send the response back to the correct org
		app.use(Auth.middleware);

		// Adds "/primes" route
		Primes.addRoute(app);

		// Start server
		debug('server listening on port: %s', PORT);
		app.listen(PORT);
	}
}

module.exports = Server;
