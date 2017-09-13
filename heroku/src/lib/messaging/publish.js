'use strict';

const
	amqp = require('../service/amqp'),
	publish = (topic, message) => {
		return amqp.apply(channel => {
			channel.sendToQueue(topic, Buffer.from(message));
		});
	};

module.exports = {
	publish
};
