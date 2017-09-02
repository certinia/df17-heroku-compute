/*
 * Incredibly simplistic StubProvider.
 * Holds a single return value for a given stub method, regardless of the argument values used on invocation.
 * 
 * For more advanced mocking, see ApexMocks: https://github.com/financialforcedev/fflib-apex-mocks
 * Apex Mocks supports stubbing, verification, answering, matchers and more.
 */
@IsTest
public class StubProvider implements System.StubProvider
{
	private final Map<Method, Object> returnValuesByMethod = new Map<Method, Object>();

	public Object handleMethodCall(Object stubbedObject, String stubbedMethodName, 
        Type returnType, List<Type> listOfParamTypes, List<String> listOfParamNames, 
        List<Object> listOfArgs)
	{
		return returnValuesByMethod.get(new Method(stubbedObject, stubbedMethodName, listOfParamTypes));
    }

	public Object mock(Type mockType)
	{
		return Test.createStub(mockType, this);
	}

	public void stub(Object stubbedObject, String stubbedMethodName, List<Type> listOfParamTypes, Object returnValue)
	{
		returnValuesByMethod.put(new Method(stubbedObject, stubbedMethodName, listOfParamTypes), returnValue);
	}

	private class Method
	{
		private final Object stubbedObject;
		private final String stubbedMethodName;
		private final List<Type> listOfParamTypes;

		public Method(Object stubbedObject, String stubbedMethodName, List<Type> listOfParamTypes)
		{
			this.stubbedObject = stubbedObject;
			this.stubbedMethodName = stubbedMethodName;
			this.listOfParamTypes = listOfParamTypes;
		}

		public Boolean equals(Object other)
		{
			if (other instanceof Method)
			{
				Method that = (Method)other;
				return this.stubbedObject === stubbedObject
					&& this.stubbedMethodName == stubbedMethodName
					&& this.listOfParamTypes == listOfParamTypes;
			}

			return false;
		}

		public Integer hashCode()
		{
			String description = ''
				+ this.stubbedMethodName
				+ this.listOfParamTypes;

			return description.hashCode();
		}
	}
}