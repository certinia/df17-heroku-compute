@IsTest(SeeAllData=false)
public class StubProviderTest
{
	public String add(String argOne, String argTwo)
	{
		return '';
	}
	
	public Integer add(Integer argOne, Integer argTwo)
	{
		return 0;
	}
	
	public String subtract()
	{
		return '';
	}

    @IsTest
    private static void stub_WithMatchingArgs_ReturnsStubbedValue()
	{
		// given
		StubProvider mocks = new StubProvider();
		StubProviderTest instance = (StubProviderTest)mocks.mock(StubProviderTest.class);

		String expected = 'onetwo';
		mocks.stub(instance, 'add', new Type[]{ String.class, String.class }, new Object[]{ 'one', 'two' }, expected);

		// when
		String actual = instance.add('one', 'two');

		// then
		System.assertEquals(expected, actual);
	}

    @IsTest
    private static void stub_WithNonMatchingArgs_ReturnsStubbedValue()
	{
		// given
		StubProvider mocks = new StubProvider();
		StubProviderTest instance = (StubProviderTest)mocks.mock(StubProviderTest.class);

		String expected = null;
		mocks.stub(instance, 'add', new Type[]{ String.class, String.class }, new Object[]{ 'one', 'two' }, expected);

		// when
		String actual = instance.add('not-one', 'not-two');

		// then
		System.assertEquals(expected, actual);
	}

    @IsTest
    private static void stub_WithOverloadedMethod_ReturnsStubbedValue()
	{
		// given
		StubProvider mocks = new StubProvider();
		StubProviderTest instance = (StubProviderTest)mocks.mock(StubProviderTest.class);

		mocks.stub(instance, 'add', new Type[]{ String.class, String.class }, new Object[]{ 'one', 'two' }, 'onetwo');
		mocks.stub(instance, 'add', new Type[]{ Integer.class, Integer.class }, new Object[]{ 1, 2 }, 3);

		// when/thens
		System.assertEquals('onetwo', instance.add('one', 'two'));
		System.assertEquals(null, instance.add('not-one', 'not-two'));
		System.assertEquals(3, instance.add(1, 2));
	}

    @IsTest
    private static void stub_WithNoArgs_ReturnsStubbedValue()
	{
		// given
		StubProvider mocks = new StubProvider();
		StubProviderTest instance = (StubProviderTest)mocks.mock(StubProviderTest.class);

		String expected = 'zero';
		mocks.stub(instance, 'subtract', new Type[]{}, new Object[]{}, expected);

		// when
		String actual = instance.subtract();

		// then
		System.assertEquals(expected, actual);
	}

    @IsTest
    private static void stub_WithMultipleInstances_ReturnsStubbedValue()
	{
		// given
		StubProvider mocks = new StubProvider();
		StubProviderTest instance1 = (StubProviderTest)mocks.mock(StubProviderTest.class);
		StubProviderTest instance2 = (StubProviderTest)mocks.mock(StubProviderTest.class);

		mocks.stub(instance1, 'add', new Type[]{ String.class, String.class }, new Object[]{ 'one', 'two' }, 'onetwo');
		mocks.stub(instance2, 'add', new Type[]{ String.class, String.class }, new Object[]{ 'one', 'two' }, 'not-onetwo');

		// when/thens
		System.assertEquals('onetwo', instance1.add('one', 'two'));
		System.assertEquals('not-onetwo', instance2.add('one', 'two'));
	}
}