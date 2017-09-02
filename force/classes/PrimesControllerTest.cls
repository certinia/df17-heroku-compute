/*
 * Copyright (c) 2017 FinancialForce.com, inc.  All rights reserved.
 */
@IsTest
private class PrimesControllerTest
{
	@IsTest
	private static void getPrimes_DelegatesToPrimeSelector()
	{
		// given
		StubProvider mocks = new StubProvider();
		PrimeSelector selector = (PrimeSelector)mocks.mock(PrimeSelector.class);
		PrimeSelector.instance = selector;

		Prime__c[] expected = new Prime__c[]{
			new Prime__c(Index__c = 2, Value__c = '3'),
			new Prime__c(Index__c = 1, Value__c = '2')
		};

		mocks.stub(selector, 'selectTop', new Type[]{Integer.class}, expected);

		// when
		Test.startTest();
		Prime__c[] actual = PrimesController.getPrimes(2);
		Test.stopTest();

		// then
		System.assert(expected === actual, 'Unexpected results. Expected: ' + expected + '. Actual: ' + actual);
	}
}