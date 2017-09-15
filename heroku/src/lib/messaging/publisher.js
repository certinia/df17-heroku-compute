'use strict';

const
	Amqp = require('../service/amqp'),

	publishFunction = ({ topic, message, channel }) => {
		return Amqp.apply(channel => {
			// Convert the message into a Buffer and enqueue against the topic
			channel.sendToQueue(topic, Buffer.from(message));
		});
	};

class Publisher {
	static publish(topic, message) {
		// Opens a connection to the RabbitMQ server, and publish the message
		return Amqp.apply(channel => publishFunction({ topic, message, channel }));
	}
}

module.exports = Publisher;
