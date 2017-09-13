'use strict';

const
	Promise = require('bluebird'),
	amqp = require('amqplib/callback_api'),
	debug = require('debug-plus')('df17~heroku~compute:messaging:publish'),

	TIMEOUT = 2000,

	connect = Promise.promisify(amqp.connect),

	sendToQueue = ({ topic, message, connection }) => {
		return new Promise(resolve => {
			connection
				.createChannel((error, channel) => {
					if (error) {
						throw error;
					}

					resolve(channel);
				})
				.then(channel => channel.sendToQueue(topic, Buffer.from(message)));
		});
	},

	publish = (topic, message) => {
		let connection;

		return connect('amqp://localhost')
			.timeout(TIMEOUT)
			.then(newConnection => {
				connection = newConnection;
			})
			.then(() => sendToQueue({ topic, message, connection }))
			.catch(error => {
				debug('Publish error: %s', error.message);
			})
			.then(() => connection.close());
	};

Promise.config({
	cancellation: true
});

module.exports = {
	publish
};
