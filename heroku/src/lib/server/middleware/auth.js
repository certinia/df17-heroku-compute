'use strict';

const
	_ = require('lodash'),

	AUTH_HEADER = 'headers.authorization',
	BEARER_PREFIX = 'Bearer ',
	SALESFORCE_SESSION = 'body.salesforceSession';

function middleware(request, response, next) {
	const token = _.trimStart(_.get(request, AUTH_HEADER), BEARER_PREFIX);
	if (_.size(token)) {
		_.set(request, SALESFORCE_SESSION, token);
		next();
	} else {
		response.sendStatus(401);
	}
}

module.exports = { middleware };
