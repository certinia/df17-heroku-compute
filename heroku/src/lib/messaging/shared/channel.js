'use strict';

const
	_ = require('lodash'),
	Promise = require('bluebird'),
	amqp = require('amqplib/callback_api'),

	TIMEOUT = 2000,

	connect = Promise.promisify(amqp.connect),

	createChannel = () => {
		const result = {};

		return connect('amqp://localhost')
			.timeout(TIMEOUT)
			.then(connection => {
				result.connection = connection;
			})
			.then(() => {
				return new Promise((resolve, reject) => {
					result.connection
						.createChannel((error, channel) => {
							if (error) {
								reject(error);
							}

							result.channel = channel;
							resolve();
						});
				});
			})
			.then(() => _.constant(result));
	};

Promise.config({
	cancellation: true
});

module.exports = {
	createChannel
};
