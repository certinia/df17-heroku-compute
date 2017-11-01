'use strict';

const
	_ = require('lodash'),
	jsforce = require('jsforce'),

	POLL_TIMEOUT = 60000;

class SalesforceWriter {
	static insert(info) {
		const { accessToken, instanceUrl, records, objectType, bulk } = info;

		return Promise
			.resolve(new jsforce.Connection({ accessToken, instanceUrl }))
			.then(connection => {
				connection.bulk.pollTimeout = POLL_TIMEOUT;
				return connection.sobject(objectType);
			})
			.then(sobject => {
				return new Promise((resolve, reject) => {
					const callback = (error, result) => {
						if (error) {
							reject(error);
						} else {
							resolve(result);
						}
					}

					if (bulk) {
						sobject.insertBulk(records, callback)
					} else {
						sobject.insert(records, callback);
					}
				});
			});
	}
}

module.exports = SalesforceWriter;
