'use strict';

const
	Amqp = require('../service/amqp'),

	publish = (topic, message) => {
		return Amqp.apply(channel => {
			channel.sendToQueue(topic, Buffer.from(message));
		});
	};

module.exports = {
	publish
};
