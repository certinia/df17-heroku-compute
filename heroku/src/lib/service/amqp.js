'use strict';

const
	amqp = require('amqplib'),
	debug = require('debug-plus')('df17~heroku~compute:messaging:shared:channel'),

	URL = process.env.CLOUDAMQP_URL || 'amqp://localhost',

	logError = error => debug('Error: %s', error.message),

	apply = action => {
		return amqp
			.connect(URL)
			.then(connection => {
				return connection
					.createChannel()
					.then(action)
					.catch(logError)
					.then(connection => {
						connection.close();
					});
			})
			.catch(logError);
	};

module.exports = {
	apply
};
