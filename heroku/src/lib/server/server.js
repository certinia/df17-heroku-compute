'use strict';

const
	bodyParser = require('body-parser'),
	debug = require('debug-plus')('df17~heroku~compute:server:server'),
	express = require('express'),
	helmet = require('helmet'),

	auth = require('./middleware/auth'),

	primesRoute = require('./routes/primes'),

	PORT = process.env.PORT || 8080;

class Server {

	static init() {

		const app = express();

		// Reads request.body
		app.use(bodyParser.json());

		// Sets various HTTP headers that make the response
		// more secure
		app.use(helmet());

		// Checks authentication header, returns 401 if header not set
		app.use(auth.middleware);

		// Adds "/primes" route
		primesRoute(app);

		// Start server
		debug('server listening on port: %s', PORT);
		app.listen(PORT);
	}

}

module.exports = Server;
