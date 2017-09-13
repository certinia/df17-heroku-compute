'use strict';

const
	Amqp = require('../service/amqp'),
	debug = require('debug-plus')('df17~heroku~compute:messaging:subscribe'),

	subscribe = (topic, handler) => {
		return Amqp.apply(channel => {
			channel.assertQueue(topic);
			channel.consume(topic, message => {
				return Promise.resolve(message)
					.then(handler)
					.catch(error => {
						debug('Error: %s', error.message);
					})
					.then(() => channel.ack(message));
			});
		});
	};

module.exports = {
	subscribe
};
