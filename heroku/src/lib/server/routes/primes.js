'use strict';

const
	_ = require('lodash'),
	{ publish } = require('../../messaging/publish'),

	PRIMES_URI = '/primes',
	CREATE_PRIMES_TOPIC = 'CREATE_PRIMES';

module.exports = app => {
	app.post(PRIMES_URI, (request, response) => {
		const body = request.body;

		Promise
			.resolve()
			.then(() => {
				if (!_.includes(body, 'currentMax')) {
					throw new Error('Missing required parameter: currentMax');
				}

				if (!_.includes(body, 'count')) {
					throw new Error('Missing required parameter: count');
				}
			})
			.then(() => publish(CREATE_PRIMES_TOPIC, body))
			.then(publishResult => response.json(publishResult))
			.catch(error => response.status(400).send(error.message));
	});
};
