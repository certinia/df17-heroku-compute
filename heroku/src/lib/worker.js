'use strict';

const
	primes = require('./service/primes'),
	{ subscribe } = require('./messaging/subscribe'),

	{ PRIMES_REQUESTED } = require('./messaging/topics');

subscribe(PRIMES_REQUESTED, primes.handle);
