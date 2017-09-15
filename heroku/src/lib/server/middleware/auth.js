'use strict';

const
	_ = require('lodash'),

	HEADER_AUTHORIZATION = 'headers.authorization',
	HEADER_REFERER = 'headers.referer',
	BEARER_PREFIX = 'Bearer ',
	ACCESS_TOKEN = 'body.accessToken',
	INSTANCE_URL = 'body.instanceUrl';

class Auth {
	static middleware(request, response, next) {
		const
			instanceUrl = _.get(request, HEADER_REFERER),
			accessToken = _.trimStart(_.get(request, HEADER_AUTHORIZATION), BEARER_PREFIX);

		if (instanceUrl && accessToken) {
			// Copy the instanceUrl and accessToken into the body
			_.set(request, ACCESS_TOKEN, accessToken);
			_.set(request, INSTANCE_URL, instanceUrl);
			next();
		} else {
			// Send an error response (401 - unauthorized)
			response.sendStatus(401);
		}
	}
}

module.exports = Auth;
