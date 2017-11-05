'use strict';

const
	_ = require('lodash'),
	chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
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

chai.use(chaiAsPromised);
chai.use(chaiSinon);

describe('service/primes', () => {

	beforeEach(() => {
		mocks.SalesforceWriter = {
			insert: sandbox.stub(SalesforceWriter, 'insert').resolves()
		};
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('handle', () => {

		it('should call insert with the expected primes', () => {

			// given
			const
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

			// when - then
			return expect(PrimesService.handle(message))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(mocks.SalesforceWriter.insert).to.have.been.calledThrice;
					expect(mocks.SalesforceWriter.insert).to.have.been.calledWith(match({
						accessToken: content.accessToken,
						instanceUrl: content.instanceUrl,
						objectType: 'PrimeEvent__e',
						records: {
							['EventData__c']: JSON.stringify({ type: 'Info', message: 'Starting to insert 10 prime number(/s)' })
						}
					}));
					expect(mocks.SalesforceWriter.insert).to.have.been.calledWith(match({
						accessToken: content.accessToken,
						instanceUrl: content.instanceUrl,
						bulk: true,
						objectType: 'Prime__c',
						records: isMatch([
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
					}));
					expect(mocks.SalesforceWriter.insert).to.have.been.calledWith(match({
						accessToken: content.accessToken,
						instanceUrl: content.instanceUrl,
						objectType: 'PrimeEvent__e',
						records: {
							['EventData__c']: JSON.stringify({ type: 'Success', message: 'Successfully inserted 10 prime number(/s)' })
						}
					}));
				});
		});

		it('should log error and raise a platform event on inserting Primes', () => {

			// given
			const
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

			mocks.SalesforceWriter.insert
				.onFirstCall().resolves()
				.onSecondCall().rejects() //Error on the second call (i.e. to insert Primes)
				.resolves();

			// when - then
			return expect(PrimesService.handle(message))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(mocks.SalesforceWriter.insert).to.have.been.calledThrice;
					expect(mocks.SalesforceWriter.insert).to.have.been.calledWith(match({
						accessToken: content.accessToken,
						instanceUrl: content.instanceUrl,
						objectType: 'PrimeEvent__e',
						records: {
							['EventData__c']: JSON.stringify({ type: 'Info', message: 'Starting to insert 10 prime number(/s)' })
						}
					}));
					expect(mocks.SalesforceWriter.insert).to.have.been.calledWith(match({
						accessToken: content.accessToken,
						instanceUrl: content.instanceUrl,
						bulk: true,
						objectType: 'Prime__c',
						records: isMatch([
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
					}));
					expect(mocks.SalesforceWriter.insert).to.have.been.calledWith(match({
						accessToken: content.accessToken,
						instanceUrl: content.instanceUrl,
						objectType: 'PrimeEvent__e',
						records: {
							['EventData__c']: JSON.stringify({ type: 'Error', message: 'Error inserting 10 prime number(/s)' })
						}
					}));
				});
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

			// when - then
			return expect(PrimesService.handle(message))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(mocks.SalesforceWriter.insert).to.have.been.notCalled;
				});
		});

	});
});
