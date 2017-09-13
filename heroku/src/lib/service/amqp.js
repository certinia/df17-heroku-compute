'use strict';

const
	amqp = require('amqplib'),
	debug = require('debug-plus')('df17~heroku~compute:service:amqp'),

	URL = process.env.CLOUDAMQP_URL || 'amqp://localhost',

	logError = error => {
		debug('Error: %s', error.message);
	};

let connection;

class Amqp {

	static apply(action) {

		return Promise.resolve()
			.then(() => {
				if (connection) {
					return connection;
				}

				return amqp.connect(URL);
			})
			.then(connection => connection.createChannel())
			.then(action)
			.catch(logError);
	}
}

module.exports = Amqp;
