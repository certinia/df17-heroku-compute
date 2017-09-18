@IsTest(SeeAllData=false)
private class PrimeSelectorTest
{
	@IsTest
	private static void getCurrentMax_WithNoPrimes_ReturnsZero()
	{
		// given
		PrimeSelector selector = PrimeSelector.newInstance();

		// when
		Prime__c currentMax = selector.getCurrentMax();

		// then
		System.assertEquals(null, currentMax);
	}

	@IsTest
	private static void getCurrentMax_WithOnePrime_ReturnsPrimeValue()
	{
		// given
		insert new Prime__c(Value__c = 19, Index__c = 5);
		PrimeSelector selector = PrimeSelector.newInstance();

		// when
		Prime__c currentMax = selector.getCurrentMax();

		// then
		System.assertEquals(19, currentMax.Value__c);
		System.assertEquals(5, currentMax.Index__c);
	}

	@IsTest
	private static void getCurrentMax_WithManyPrimes_ReturnsPrimeValueWithHighestIndex()
	{
		// given
		insert new Prime__c[]{
			new Prime__c(Value__c = 17, Index__c = 4),
			new Prime__c(Value__c = 3,  Index__c = 2),
			new Prime__c(Value__c = 5,  Index__c = 3)
		};
		PrimeSelector selector = PrimeSelector.newInstance();

		// when
		Prime__c currentMax = selector.getCurrentMax();

		// then
		System.assertEquals(17, currentMax.Value__c);
		System.assertEquals(4, currentMax.Index__c);
	}
}