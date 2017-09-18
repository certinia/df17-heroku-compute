'use strict';

const
	_ = require('lodash'),
	debug = require('debug-plus')('df17~heroku~compute:service:salesforceWriter'),
	jsforce = require('jsforce'),

	BATCH_SIZE = 10,

	batchRecords = recordsByType => {
		return _.reduce(recordsByType, (result, allRecordsForType, objectType) => {
			const
				batches = _.chunk(allRecordsForType, BATCH_SIZE),
				batchesWithObjectType = _.map(batches, records => {
					return { objectType, records };
				});

			result.push(...batchesWithObjectType);
			return result;
		}, []);
	};

class SalesforceWriter {
	static insert(info) {
		const
			/* beautify ignore:start */
			{ accessToken, instanceUrl, recordsByType } = info,
			/* beautify ignore:end */
			batches = batchRecords(recordsByType);

		let connection;

		if (batches.length) {
			// Create a Connection to the Force.com
			connection = new jsforce.Connection({
				instanceUrl,
				accessToken
			});

			// Perform inserts in Salesforce
			return Promise.all(_.map(batches, batch => {
				return connection
					.sobject(batch.objectType)
					.insert(batch.records)
					.catch(error => {
						debug(error);
					});
			}));
		}

		return Promise.resolve();
	}
}

module.exports = SalesforceWriter;
