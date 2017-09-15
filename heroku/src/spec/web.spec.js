'use strict';

const
	chai = require('chai'),
	sinonChai = require('sinon-chai'),
	sinon = require('sinon'),
	Server = require('../lib/server/server'),

	mocks = {},

	sandbox = sinon.sandbox.create(),
	expect = chai.expect;

chai.use(sinonChai);

describe('web', () => {
	beforeEach(() => {
		mocks.Server = {
			init: sandbox.stub(Server, 'init')
		};
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should call Server.init', () => {
		require('../lib/web');
		expect(mocks.Server.init).to.have.been.calledOnce;
	});
});
