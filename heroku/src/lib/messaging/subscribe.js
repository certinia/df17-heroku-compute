'use strict';

const
	amqp = require('../service/amqp'),
	subscribe = (topic, handler) => {
		return amqp.apply(channel => {
			channel.consume(topic, handler);
		});
	};

module.exports = {
	subscribe
};
