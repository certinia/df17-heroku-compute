public class PrimesController
{
	@AuraEnabled
	public static Prime__c[] getPrimes(Integer max)
	{
		return PrimeSelector.newInstance().selectTop(max);
	}
}