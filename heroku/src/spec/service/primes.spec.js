/* eslint-disable camelcase*/
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
				content = {
					accessToken: 'testAccessToken',
					count: 10,
					currentMax: 2,
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
					Prime__c: isMatch([
						{ Value__c: 3 },
						{ Value__c: 5 },
						{ Value__c: 7 },
						{ Value__c: 11 },
						{ Value__c: 13 },
						{ Value__c: 17 },
						{ Value__c: 19 },
						{ Value__c: 23 },
						{ Value__c: 29 },
						{ Value__c: 31 }
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
