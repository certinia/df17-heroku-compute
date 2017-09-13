'use strict';

const
	debug = require('debug-plus')('df17~heroku~compute:messaging:publish'),
	{ createChannel } = require('./shared/channel'),

	subscribe = (topic, message) => {
		let closeMe;
		return createChannel()
			.then(({ connection, channel }) => {
				closeMe = connection;
				channel.sendToQueue(topic, Buffer.from(message))
			})
			.catch(error => {
				debug('Publish error: %s', error.message);
			})
			.then(() => closeMe.close());
	};

module.exports = {
	subscribe
};
