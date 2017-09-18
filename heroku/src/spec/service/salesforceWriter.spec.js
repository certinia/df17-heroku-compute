'use strict';

const
	_ = require('lodash'),
	chai = require('chai'),
	chaiAsPromised = require('chai-sinon'),
	chaiSinon = require('chai-sinon'),
	sinon = require('sinon'),

	jsforce = require('jsforce'),

	SalesforceWriter = require('../../lib/service/salesforceWriter'),

	mocks = {},

	sandbox = sinon.sandbox.create(),
	expect = chai.expect,
	match = sandbox.match,

	isMatch = expected => {
		return match(actual => {
			return _.isMatch(actual, expected);
		}, `Expected: ${expected}`);
	},

	createSObjects = (fieldName, count) => {
		const result = [];
		_.times(count, index => {
			result.push({
				[fieldName]: index
			});
		});

		return result;
	};

chai.use(chaiSinon);
chai.use(chaiAsPromised);

describe('service/salesforceWriter', () => {

	beforeEach(() => {
		const Connection = jsforce.Connection;
		mocks.Connection = {
			create: sandbox.spy(Connection.prototype, 'create'),
			sobject: sandbox.stub(Connection.prototype, 'sobject').returnsThis(),
			insert: sandbox.stub(Connection.prototype, 'insert').resolves()
		};
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('insert', () => {

		it('should not insert if no records supplied', () => {
			// given
			const info = {
				accessToken: 'testAccessToken',
				instanceUrl: 'testInstanceUrl',
				recordsByType: {}
			};

			// when
			return expect(SalesforceWriter.insert(info))
				.to.eventually.be.fulfilled
				// then
				.then(() => {
					expect(mocks.Connection.sobject).notCalled;
					expect(mocks.Connection.insert).notCalled;
				});
		});

		it('should chunk records by type and batch size', () => {
			// given
			const info = {
				accessToken: 'testAccessToken',
				instanceUrl: 'testInstanceUrl',
				recordsByType: {
					objectTypeA: createSObjects('fieldA', 20),
					objectTypeB: createSObjects('fieldB', 5)
				}
			};

			// when
			return expect(SalesforceWriter.insert(info))
				.to.eventually.be.fulfilled
				// then
				.then(() => {
					expect(mocks.Connection.sobject).calledThrice;
					expect(mocks.Connection.sobject).calledWith('objectTypeA');
					expect(mocks.Connection.sobject).calledWith('objectTypeB');
					expect(mocks.Connection.insert).calledThrice;
					expect(mocks.Connection.insert).calledWith(isMatch([
						{ fieldA: 0 }, { fieldA: 1 }, { fieldA: 2 }, { fieldA: 3 }, { fieldA: 4 }, { fieldA: 5 }, { fieldA: 6 }, { fieldA: 7 }, { fieldA: 8 }, { fieldA: 9 }
					]));
					expect(mocks.Connection.insert).calledWith(isMatch([
						{ fieldA: 10 }, { fieldA: 11 }, { fieldA: 12 }, { fieldA: 13 }, { fieldA: 14 }, { fieldA: 15 }, { fieldA: 16 }, { fieldA: 17 }, { fieldA: 18 }, { fieldA: 19 }
					]));
					expect(mocks.Connection.insert).calledWith(isMatch([
						{ fieldB: 0 }, { fieldB: 1 }, { fieldB: 2 }, { fieldB: 3 }, { fieldB: 4 }
					]));

				});
		});

		describe('should handle errors', () => {

			it('on sobject', () => {
				// given
				const info = {
					accessToken: 'testAccessToken',
					instanceUrl: 'testInstanceUrl',
					recordsByType: { testObject: [{ testField: 'testValue' }] }
				};

				mocks.Connection.sobject.rejects();

				// when
				return expect(SalesforceWriter.insert(info))
					.to.eventually.be.fulfilled
					// then
					.then(() => {
						expect(mocks.Connection.sobject).calledOnce;
						expect(mocks.Connection.sobject).calledWith('testObject');
						expect(mocks.Connection.insert).notCalled;
					});
			});

			it('on insert', () => {
				// given
				const info = {
					accessToken: 'testAccessToken',
					instanceUrl: 'testInstanceUrl',
					recordsByType: { testObject: [{ testField: 'testValue' }] }
				};

				mocks.Connection.insert.rejects();

				// when
				return expect(SalesforceWriter.insert(info))
					.to.eventually.be.fulfilled
					// then
					.then(() => {
						expect(mocks.Connection.sobject).calledOnce;
						expect(mocks.Connection.sobject).calledWith('testObject');
						expect(mocks.Connection.insert).calledOnce;
						expect(mocks.Connection.insert).calledWith(isMatch([{ testField: 'testValue' }]));
					});
			});

		});
	});
});
