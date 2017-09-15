public class PrimesController
{
	public static Object requestPrimes(Integer count)
    {
        Integer currentMax = PrimeSelector.newInstance().getCurrentMax();
        return HerokuConnector.newInstance().requestPrimes(count, currentMax);
	}
}