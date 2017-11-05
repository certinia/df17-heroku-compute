/**
 * Copyright (c) 2017, FinancialForce.com, inc
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 *   are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 * - Neither the name of the FinancialForce.com, inc nor the names of its contributors
 *      may be used to endorse or promote products derived from this software without
 *      specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
 *  THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 *  OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 *  OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **/

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
