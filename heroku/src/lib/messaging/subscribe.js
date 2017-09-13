'use strict';

const
	Amqp = require('../service/amqp'),

	amqp = new Amqp({
		closeConnection: false
	}),

	subscribe = (topic, handler) => {
		return amqp.apply(channel => {
			channel.assertQueue(topic);
			channel.consume(topic, message => {
				handler(message);
			});
		});
	};

module.exports = {
	subscribe
};
