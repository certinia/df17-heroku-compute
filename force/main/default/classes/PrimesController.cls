public with sharing class PrimesController
{
	@AuraEnabled
	public static Object requestPrimes(Integer count)
	{
		Integer value, index;
		Prime__c currentMax = PrimeSelector.newInstance().getCurrentMax();
		if (currentMax != null) {
			value = (Integer) currentMax.Value__c;
			index = (Integer) currentMax.Index__c;
		}
		return HerokuConnector.newInstance().requestPrimes(count, value, index);
	}
}