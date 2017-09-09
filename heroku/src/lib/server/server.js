'use strict';

const
	_ = require('lodash'),
	bodyParser = require('body-parser'),
	debug = require('debug-plus')('df17~heroku~compute:server:server'),
	express = require('express'),
	helmet = require('helmet'),

	Primes = require('../service/primes'),

	PRIMES_URI = '/primes',
	PORT = process.env.PORT || 8080,

	server = express(),

	primesHandler = (request, response) => {
		const
			body = request.body || {},
			currentMax = body.currentMax,
			count = body.count;

		debug('Handling request with body %s', JSON.stringify(body));

		if (currentMax && count) {
			Primes.handle({ currentMax, count });
			response.sendStatus(200);
		} else {
			response.sendStatus(400);
		}
	};

class Server {

	static init() {
		server.use(bodyParser.json());
		server.use(helmet());

		server.post(PRIMES_URI, primesHandler);

		// start server
		debug('server listening on port: %s', PORT);
		server.listen(PORT);
	}

}

module.exports = Server;
