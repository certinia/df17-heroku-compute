'use strict';

const
	_ = require('lodash'),
	debug = require('debug-plus')('df17~heroku~compute:service:salesforceWriter'),
	jsforce = require('jsforce');

class SalesforceWriter {
	static insert(info) {
		const
			/* beautify ignore:start */
			{ instanceUrl, recordsByType, accessToken } = info,
			/* beautify ignore:end */
			connection = new jsforce.Connection({
				instanceUrl,
				accessToken
			}),
			insertPromises = _.map(recordsByType, (records, objectType) => {
				return connection
					.sobject(objectType)
					.insert(records)
					.catch(error => {
						debug(error);
					});
			});

		return Promise.all(insertPromises);
	}
}

module.exports = SalesforceWriter;
