'use strict';

const
	Amqp = require('../service/amqp'),

	amqp = new Amqp({
		closeConnection: true
	}),

	publish = (topic, message) => {
		return amqp.apply(channel => {
			channel.sendToQueue(topic, Buffer.from(message));
		});
	};

module.exports = {
	publish
};
