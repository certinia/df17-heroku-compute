'use strict';

const
	_ = require('lodash'),
	debug = require('debug-plus')('df17~heroku~compute:server:routes:primes'),
	Publisher = require('../../messaging/publisher'),

	{ PRIMES_REQUESTED } = require('../../messaging/topics'),
	PRIMES_URI = '/primes',
	REQUIRED_PROPERTIES = ['currentMax', 'index', 'count', 'accessToken', 'instanceUrl'],

	requestHandler = (request, response) => {
		const body = _.get(request, 'body', {});

		return Promise
			.resolve()
			.then(() => {
				// Validate the request body has the expected properties
				_.each(REQUIRED_PROPERTIES, property => {
					if (body[property] == null) {
						throw new Error(`Missing required parameter: ${property}`);
					}
				});

				// Create a message by converting the body into a JSON String
				return JSON.stringify(_.pick(body, REQUIRED_PROPERTIES));
			})
			.then(message => {
				// Publish the message
				return Publisher.publish(PRIMES_REQUESTED, message);
			})
			.then(() => {
				// Send a success response
				response.sendStatus(200);
			})
			.catch(error => {
				const errorMessage = error.message;

				// Log the error
				debug.error(errorMessage);

				// Send an error response
				response.status(400).send(errorMessage);
			});
	};

class Primes {
	static addRoute(app) {
		// Add "/primes" route
		return app.post(PRIMES_URI, requestHandler);
	}
}

module.exports = Primes;
