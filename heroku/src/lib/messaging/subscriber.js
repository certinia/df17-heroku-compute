'use strict';

const
	Amqp = require('../service/amqp'),
	debug = require('debug-plus')('df17~heroku~compute:messaging:subscribe'),

	subscribeAction = ({ topic, handler, channel }) => {
		// Ensure the topic exists
		channel.assertQueue(topic);

		// Subscribe to the topic
		channel.consume(topic, message => {
			return Promise.resolve()
				.then(() => {
					// Invoke the handler with the message
					return handler(message);
				})
				.catch(error => {
					// Log any errors
					debug('Error: %s', error.message);
				})
				.then(() => {
					// Acknowledge the event, regardless
					// of whether or not we had an error
					channel.ack(message);
				});
		});
	};

class Subscriber {
	static subscribe(topic, handler) {
		// Opens a connection to the RabbitMQ server, and subscribes to the topic
		return Amqp.apply(channel => subscribeAction({ topic, handler, channel }));
	}
}

module.exports = Subscriber;
