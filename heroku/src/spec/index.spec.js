'use strict';

const
	root = require('app-root-path'),

	chai = require('chai'),
	expect = chai.expect;

describe('index.js', () => {

	it('should return an empty object', () => {

		// given - when
		const index = require(root + '/src/lib/index');

		// then
		expect(index).to.eql({});

	});

});
