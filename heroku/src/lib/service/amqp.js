'use strict';

const
	amqp = require('amqplib'),
	debug = require('debug-plus')('df17~heroku~compute:messaging:shared:channel'),

	URL = process.env.CLOUDAMQP_URL || 'amqp://localhost',

	logError = error => {
		debug('Error: %s', error.message);
	},

	getOrCreateConnection = () => {
		const me = this;

		return Promise
			.resolve()
			.then(() => {
				if (me._connection) {
					return null;
				}

				return amqp.connect(URL)
					.then(connection => {
						me._connection = connection;
					});
			})
			.then(() => {
				return me._connection;
			});
	},

	closeConnection = () => {
		const connection = this._connection;
		if (connection) {
			connection.close();
		}
	};

class Amqp {

	constructor(config) {
		this._closeConnection = config.closeConnection;
	}

	apply(action) {
		const me = this;

		return getOrCreateConnection()
			.then(connection => connection.createChannel())
			.then(action)
			.catch(logError)
			.then(() => {
				if (me._closeConnection) {
					closeConnection();
				}
			});
	}
}

module.exports = Amqp;
