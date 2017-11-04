'use strict';

const
	chai = require('chai'),
	chaiAsPromised = require('chai-sinon'),
	chaiSinon = require('chai-sinon'),
	sinon = require('sinon'),

	jsforce = require('jsforce'),

	SalesforceWriter = require('../../lib/service/salesforceWriter'),

	mocks = {},

	sandbox = sinon.sandbox.create(),
	expect = chai.expect;

chai.use(chaiSinon);
chai.use(chaiAsPromised);

describe('service/salesforceWriter', () => {

	beforeEach(() => {
		const Connection = jsforce.Connection;
		mocks.SObject = {
			insert: sandbox.stub().yields(null, 'Success'),
			insertBulk: sandbox.stub().yields(null, 'Success')
		};
		mocks.Connection = {
			create: sandbox.spy(Connection.prototype, 'create'),
			sobject: sandbox.stub(Connection.prototype, 'sobject').returns(mocks.SObject)
		};

	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('insert', () => {

		it('should resolve on successful insert', () => {
			// given
			const
				record = { testField: 'testValue' },
				info = {
					accessToken: 'testAccessToken',
					instanceUrl: 'testInstanceUrl',
					bulk: false,
					objectType: 'testObject',
					records: record
				};

			// when - then
			return expect(SalesforceWriter.insert(info))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(mocks.Connection.sobject).calledOnce;
					expect(mocks.Connection.sobject).calledWith('testObject');
					expect(mocks.SObject.insert).calledOnce;
					expect(mocks.SObject.insert).calledWith(record);
				});
		});

		it('should resolve on successful bulk insert', () => {
			// given
			const
				record = { testField: 'testValue' },
				info = {
					accessToken: 'testAccessToken',
					instanceUrl: 'testInstanceUrl',
					bulk: true,
					objectType: 'testObject',
					records: record
				};

			// when - then
			return expect(SalesforceWriter.insert(info))
				.to.eventually.be.fulfilled
				.then(() => {
					expect(mocks.Connection.sobject).calledOnce;
					expect(mocks.Connection.sobject).calledWith('testObject');
					expect(mocks.SObject.insertBulk).calledOnce;
					expect(mocks.SObject.insertBulk).calledWith(record);
				});
		});

		describe('should handle errors', () => {

			it('on sobject', () => {
				// given
				const
					record = { testField: 'testValue' },
					info = {
						accessToken: 'testAccessToken',
						instanceUrl: 'testInstanceUrl',
						bulk: false,
						objectType: 'testObject',
						records: record
					};

				mocks.Connection.sobject.rejects(new Error('Bad'));

				// when - then
				return expect(SalesforceWriter.insert(info))
					.to.eventually.be.rejectedWith('Bad')
					.then(() => {
						expect(mocks.Connection.sobject).calledOnce;
						expect(mocks.Connection.sobject).calledWith('testObject');
						expect(mocks.SObject.insert).notCalled;
					});
			});

			it('on insert', () => {
				// given
				const
					record = { testField: 'testValue' },
					info = {
						accessToken: 'testAccessToken',
						instanceUrl: 'testInstanceUrl',
						bulk: false,
						objectType: 'testObject',
						records: record
					};

				mocks.SObject.insert.yields('Bad');

				// when - then
				return expect(SalesforceWriter.insert(info))
					.to.eventually.be.rejectedWith('Bad')
					.then(() => {
						expect(mocks.Connection.sobject).calledOnce;
						expect(mocks.Connection.sobject).calledWith('testObject');
						expect(mocks.SObject.insert).calledOnce;
						expect(mocks.SObject.insert).calledWith(record);
					});
			});

			it('on insertBulk', () => {
				// given
				const
					record = { testField: 'testValue' },
					info = {
						accessToken: 'testAccessToken',
						instanceUrl: 'testInstanceUrl',
						bulk: true,
						objectType: 'testObject',
						records: record
					};

				mocks.SObject.insertBulk.yields('Bad');

				// when - then
				return expect(SalesforceWriter.insert(info))
					.to.eventually.be.rejectedWith('Bad')
					.then(() => {
						expect(mocks.Connection.sobject).calledOnce;
						expect(mocks.Connection.sobject).calledWith('testObject');
						expect(mocks.SObject.insertBulk).calledOnce;
						expect(mocks.SObject.insertBulk).calledWith(record);
					});
			});
		});
	});
});
