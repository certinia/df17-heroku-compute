'use strict';

const
	_ = require('lodash'),
	debug = require('debug-plus')('df17~heroku~compute:service:salesforceWriter'),
	jsforce = require('jsforce'),

	BATCH_SIZE = 10;

class SalesforceWriter {
	static insert(info) {
		const
			/* beautify ignore:start */
			{ accessToken, instanceUrl, recordsByType } = info,
			/* beautify ignore:end */
			// Create a Connection to the Force.com
			connection = new jsforce.Connection({
				instanceUrl,
				accessToken
			}),
			// Create promises to insert the records in Salesforce in batches
			insertPromises = _.flatMap(recordsByType, (records, objectType) => {
				return _.map(_.chunk(records, BATCH_SIZE), batch => {
					return connection
						.sobject(objectType)
						.insert(batch)
						.catch(error => {
							debug(error);
						});
				});
			});

		// Perform inserts in Salesforce
		return Promise.all(insertPromises);
	}
}

module.exports = SalesforceWriter;
