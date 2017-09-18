'use strict';

const
	Amqp = require('../service/amqp'),
	debug = require('debug-plus')('df17~heroku~compute:messaging:publisher'),

	publishAction = ({ topic, message, channel }) => {
		// Convert the message into a Buffer and enqueue against the topic
		return channel.sendToQueue(topic, Buffer.from(message));
	};

class Publisher {
	static publish(topic, message) {
		debug('publishing to: %s, message: %s', topic, message);
		// Opens a connection to the RabbitMQ server, and publish the message
		return Amqp.apply(channel => publishAction({ topic, message, channel }));
	}
}

module.exports = Publisher;
