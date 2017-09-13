'use strict';

const
	primes = require('./service/primes'),
	{ subscribe } = require('./messaging/subscribe'),

	CREATE_PRIMES_TOPIC = 'CREATE_PRIMES';

subscribe(CREATE_PRIMES_TOPIC, primes.handle);
