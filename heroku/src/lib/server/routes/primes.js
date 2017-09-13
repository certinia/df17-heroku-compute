'use strict';

const
	_ = require('lodash'),
	{ publish } = require('../../messaging/publish'),

	{ PRIMES_REQUESTED } = require('../../messaging/topics'),
	PRIMES_URI = '/primes';

module.exports = app => {
	app.post(PRIMES_URI, (request, response) => {
		const body = request.body || {};

		Promise
			.resolve()
			.then(() => {
				if (!_.isNumber(body.currentMax)) {
					throw new Error('Missing required parameter: currentMax');
				}

				if (!_.isNumber(body.count)) {
					throw new Error('Missing required parameter: count');
				}

				return [body.currentMax, body.count];
			})
			.then(message => publish(PRIMES_REQUESTED, message))
			.then(publishResult => response.json(publishResult))
			.catch(error => response.status(400).send(error.message));
	});
};
