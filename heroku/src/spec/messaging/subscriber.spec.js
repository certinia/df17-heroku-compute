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
	chaiSinon = require('chai-sinon'),
	sinon = require('sinon'),

	Amqp = require('../../lib/service/amqp'),

	Subscriber = require('../../lib/messaging/subscriber'),

	mocks = {},

	sandbox = sinon.sandbox.create(),
	expect = chai.expect,
	anyFunction = sinon.match.func;

chai.use(chaiSinon);

describe('messaging/subscriber', () => {

	beforeEach(() => {
		mocks.Amqp = {
			apply: sandbox.stub(Amqp, 'apply')
		};
		mocks.channel = {
			ack: sandbox.stub(),
			assertQueue: sandbox.stub(),
			consume: sandbox.stub()
		};
		mocks.handler = sandbox.stub();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('subscribe', () => {

		it('should supply messages to the handler', () => {

			// given
			const
				topic = 'TestTopic',
				message = 'TestMessage';

			mocks.channel.consume.callsFake((topic, callback) => {
				return callback(message);
			});
			mocks.handler.resolves();
			mocks.Amqp.apply.callsFake(action => {
				return Promise.resolve(action(mocks.channel));
			});

			// when
			return Subscriber.subscribe(topic, mocks.handler)
				// then
				.then(() => {
					expect(mocks.Amqp.apply).to.have.been.calledOnce;
					expect(mocks.Amqp.apply).to.have.been.calledWith(anyFunction);
					expect(mocks.channel.ack).to.have.been.calledOnce;
					expect(mocks.channel.ack).to.have.been.calledWith(message);
					expect(mocks.channel.assertQueue).to.have.been.calledOnce;
					expect(mocks.channel.assertQueue).to.have.been.calledWith(topic);
					expect(mocks.channel.consume).to.have.been.calledOnce;
					expect(mocks.channel.consume).to.have.been.calledWith(topic, anyFunction);
					expect(mocks.handler).to.have.been.calledOnce;
					expect(mocks.handler).to.have.been.calledWith(message);
				});
		});

		it('should handle handler errors', () => {

			// given
			const
				topic = 'TestTopic',
				message = 'TestMessage';

			mocks.channel.consume.callsFake((topic, callback) => {
				return callback(message);
			});
			mocks.handler.rejects();
			mocks.Amqp.apply.callsFake(action => {
				return Promise.resolve(action(mocks.channel));
			});

			// when
			return Subscriber.subscribe(topic, mocks.handler)
				// then
				.then(() => {
					expect(mocks.Amqp.apply).to.have.been.calledOnce;
					expect(mocks.Amqp.apply).to.have.been.calledWith(anyFunction);
					expect(mocks.channel.ack).to.have.been.calledOnce;
					expect(mocks.channel.ack).to.have.been.calledWith(message);
					expect(mocks.channel.assertQueue).to.have.been.calledOnce;
					expect(mocks.channel.assertQueue).to.have.been.calledWith(topic);
					expect(mocks.channel.consume).to.have.been.calledOnce;
					expect(mocks.channel.consume).to.have.been.calledWith(topic, anyFunction);
					expect(mocks.handler).to.have.been.calledOnce;
					expect(mocks.handler).to.have.been.calledWith(message);
				});
		});

	});
});
