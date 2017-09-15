@IsTest(SeeAllData=false)
private class PrimeSelectorTest
{
	@IsTest
	private static void getCurrentMax_WithNoPrimes_ReturnsZero()
	{
		// given
		PrimeSelector selector = PrimeSelector.newInstance();

		// when
		Integer currentMax = selector.getCurrentMax();

		// then
		System.assertEquals(0, currentMax);
	}

	@IsTest
	private static void getCurrentMax_WithOnePrime_ReturnsPrimeValue()
	{
		// given
		insert new Prime__c(Value__c = 19);
		PrimeSelector selector = PrimeSelector.newInstance();

		// when
		Integer currentMax = selector.getCurrentMax();

		// then
		System.assertEquals(19, currentMax);
	}

	@IsTest
	private static void getCurrentMax_WithManyPrimes_ReturnsMaxPrimeValue()
	{
		// given
		insert new Prime__c[]{
			new Prime__c(Value__c = 17),
			new Prime__c(Value__c = 3),
			new Prime__c(Value__c = 5)
		};
		PrimeSelector selector = PrimeSelector.newInstance();

		// when
		Integer currentMax = selector.getCurrentMax();

		// then
		System.assertEquals(17, currentMax);
	}
}