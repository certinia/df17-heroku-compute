@IsTest
private class PrimeSelectorTest
{
	@IsTest
	private static void newInstance_ReturnsRealSelector_WhenInstanceNotStubbed()
	{
		// given/ when
		Test.startTest();
		PrimeSelector selector = PrimeSelector.newInstance();
		Test.stopTest();

		// then
		System.assertNotEquals(null, selector);
	}

	@IsTest
	private static void newInstance_ReturnsStubbedSelector_WhenInstanceStubbed()
	{
		// given
		StubProvider mocks = new StubProvider();
		PrimeSelector expected = (PrimeSelector)mocks.mock(PrimeSelector.class);
		PrimeSelector.instance = expected;

		// when
		Test.startTest();
		PrimeSelector actual = PrimeSelector.newInstance();
		Test.stopTest();

		// then
		System.assert(expected === actual, 'Unexpected stub. Expected: ' + expected + '. Actual: ' + actual);
	}

	@IsTest
	private static void selectAll_ReturnsEmpty_WhenNoRecords()
	{
		// given
		PrimeSelector selector = new PrimeSelector();
		Prime__c[] expected = new Prime__c[]{};

		// when
		Test.startTest();
		Prime__c[] actual = selector.selectTop(2);
		Test.stopTest();

		// then
		System.assertEquals(expected, actual);
	}
	
	@IsTest
	private static void selectAll_ReturnsMaxOrderedRecords()
	{
		// given
		insert new Prime__c[]{
			new Prime__c(Index__c = 2, Value__c = '3'),
			new Prime__c(Index__c = 1, Value__c = '2'),
			new Prime__c(Index__c = 3, Value__c = '5')
		};

		PrimeSelector selector = new PrimeSelector();
		
		// when
		Test.startTest();
		Prime__c[] actual = selector.selectTop(2);
		Test.stopTest();

		// then
		System.assertNotEquals(null, actual);
		System.assertEquals(2, actual.size(), 'Unexpected result size: ' + actual);
		
		System.assertEquals(3, actual[0].Index__c, 'Unexpected actual[0].Index__c - results: ' + actual);
		System.assertEquals('5', actual[0].Value__c, 'Unexpected actual[0].Value__c - results: ' + actual);

		System.assertEquals(2, actual[1].Index__c, 'Unexpected actual[1].Index__c - results: ' + actual);
		System.assertEquals('3', actual[1].Value__c, 'Unexpected actual[1].Value__c - results: ' + actual);
	}
}