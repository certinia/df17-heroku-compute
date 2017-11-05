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

@IsTest(SeeAllData=false)
private class PrimesControllerTest
{
	@IsTest
	private static void requestPrimes_nullInputAndSelectorReturnsNull_connectorCalledWithNulls()
	{
		// given
		StubProvider mocks = new StubProvider();
		HerokuConnector connector = (HerokuConnector)mocks.mock(HerokuConnector.class);
		PrimeSelector selector = (PrimeSelector)mocks.mock(PrimeSelector.class);

		HerokuConnector.instance = connector;
		PrimeSelector.instance = selector;

		HttpResponse response = new HttpResponse();

		mocks.stub(selector, 'getCurrentMax', new Type[]{}, new Object[]{}, null);
		mocks.stub(connector, 'requestPrimes', new Type[]{Integer.class, Integer.class, Integer.class}, new Object[]{null, null, null}, response);

		// when
		Object actual = PrimesController.requestPrimes(null);

		// then
		System.assert(response === actual, 'Unexpected response. Expected: ' + response + '. Actual: ' + actual);
	}

	@IsTest
	private static void requestPrimes_valueInputAndSelectorReturnsNull_connectorCalledWithCountAndNulls()
	{
		// given
		StubProvider mocks = new StubProvider();
		HerokuConnector connector = (HerokuConnector)mocks.mock(HerokuConnector.class);
		PrimeSelector selector = (PrimeSelector)mocks.mock(PrimeSelector.class);

		HerokuConnector.instance = connector;
		PrimeSelector.instance = selector;

		HttpResponse response = new HttpResponse();

		mocks.stub(selector, 'getCurrentMax', new Type[]{}, new Object[]{}, null);
		mocks.stub(connector, 'requestPrimes', new Type[]{Integer.class, Integer.class, Integer.class}, new Object[]{5, null, null}, response);
		
		// when
		Object actual = PrimesController.requestPrimes(5);

		// then
		System.assert(response === actual, 'Unexpected response. Expected: ' + response + '. Actual: ' + actual);
	}

	@IsTest
	private static void requestPrimes_valueInputAndSelectorReturnsAPrime_connectorCalledWithCountAndPrimeValues()
	{
		// given
		StubProvider mocks = new StubProvider();
		HerokuConnector connector = (HerokuConnector)mocks.mock(HerokuConnector.class);
		PrimeSelector selector = (PrimeSelector)mocks.mock(PrimeSelector.class);

		HerokuConnector.instance = connector;
		PrimeSelector.instance = selector;

		HttpResponse response = new HttpResponse();

		mocks.stub(selector, 'getCurrentMax', new Type[]{}, new Object[]{}, new Prime__c(Value__c = 11, Index__c = 6));
		mocks.stub(connector, 'requestPrimes', new Type[]{Integer.class, Integer.class, Integer.class}, new Object[]{5, 11, 6}, response);
		
		// when
		Object actual = PrimesController.requestPrimes(5);

		// then
		System.assert(response === actual, 'Unexpected response. Expected: ' + response + '. Actual: ' + actual);
	}
}