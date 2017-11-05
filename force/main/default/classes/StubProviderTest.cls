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