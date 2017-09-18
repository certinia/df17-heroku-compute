'use strict';

const
	_ = require('lodash'),
	chai = require('chai'),
	chaiSinon = require('chai-sinon'),
	sinon = require('sinon'),
	SalesforceWriter = require('../../lib/service/salesforceWriter'),

	PrimesService = require('../../lib/service/primes'),

	mocks = {},

	sandbox = sinon.sandbox.create(),
	expect = chai.expect,
	match = sandbox.match,

	isMatch = expected => {
		return match(actual => {
			return _.isMatch(actual, expected);
		}, `Expected: ${expected}`);
	};

chai.use(chaiSinon);

describe('service/primes', () => {

	beforeEach(() => {
		mocks.SalesforceWriter = {
			insert: sandbox.stub(SalesforceWriter, 'insert')
		};
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('handle', () => {

		it('should call insert with the expected primes', () => {

			// given
			const
				primeObjectName = 'Prime__c',
				prime = (value, index) => ({
					['Value__c']: value,
					['Index__c']: index
				}),
				content = {
					accessToken: 'testAccessToken',
					count: 10,
					currentMax: 2,
					index: 1,
					instanceUrl: 'testInstanceUrl'
				},
				message = {
					content: JSON.stringify(content)
				};

			// when
			PrimesService.handle(message);

			// then
			expect(mocks.SalesforceWriter.insert).to.have.been.calledOnce;
			expect(mocks.SalesforceWriter.insert).to.have.been.calledWith(match({
				accessToken: content.accessToken,
				instanceUrl: content.instanceUrl,
				recordsByType: {
					[primeObjectName]: isMatch([
						prime(3, 2),
						prime(5, 3),
						prime(7, 4),
						prime(11, 5),
						prime(13, 6),
						prime(17, 7),
						prime(19, 8),
						prime(23, 9),
						prime(29, 10),
						prime(31, 11)
					])
				}
			}));
		});

		it('should not call insert when there are no primes to generate', () => {
			// given
			const
				content = {
					accessToken: 'testAccessToken',
					count: 0,
					currentMax: 2,
					instanceUrl: 'testInstanceUrl'
				},
				message = {
					content: JSON.stringify(content)
				};

			// when
			PrimesService.handle(message);

			// then
			expect(mocks.SalesforceWriter.insert).to.have.been.notCalled;
		});

	});
});
