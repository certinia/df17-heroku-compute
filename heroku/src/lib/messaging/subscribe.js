'use strict';

const
	debug = require('debug-plus')('df17~heroku~compute:messaging:subscribe'),
	{ createChannel } = require('./shared/channel'),

	subscribe = (topic, handler) => {
		let closeMe;
		return createChannel()
			.then(({ connection, channel }) => {
				closeMe = connection;
				channel.consume(topic, handler);
			})
			.catch(error => {
				debug('Subscribe error: %s', error.message);
			})
			.then(() => closeMe.close());
	};

module.exports = {
	subscribe
};
