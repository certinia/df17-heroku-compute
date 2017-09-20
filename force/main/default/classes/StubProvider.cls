/*
 * Incredibly simplistic StubProvider.
 * Holds a single return value for a given stub method, regardless of the argument values used on invocation.
 * 
 * For more advanced mocking, see ApexMocks: https://github.com/financialforcedev/fflib-apex-mocks
 * Apex Mocks supports stubbing, verification, answering, matchers and more.
 */
@IsTest(SeeAllData=false)
public class StubProvider implements System.StubProvider
{
	private final Map<Method, Object> returnValuesByMethod = new Map<Method, Object>();

	public Object handleMethodCall(Object stubbedObject, String stubbedMethodName, 
		Type returnType, List<Type> listOfParamTypes, List<String> listOfParamNames, 
		List<Object> listOfArgs)
	{
		return returnValuesByMethod.get(new Method(stubbedObject, stubbedMethodName, listOfParamTypes, listOfArgs));
	}

	public Object mock(Type mockType)
	{
		return Test.createStub(mockType, this);
	}

	public void stub(Object stubbedObject, String stubbedMethodName, List<Type> listOfParamTypes, List<Object> listOfArgs, Object returnValue)
	{	
		returnValuesByMethod.put(new Method(stubbedObject, stubbedMethodName, listOfParamTypes, listOfArgs), returnValue);
	}

	private class Method
	{
		private final Object stubbedObject;
		private final String stubbedMethodName;
		private final List<Type> listOfParamTypes;
		private final List<Object> listOfArgs;

		public Method(Object stubbedObject, String stubbedMethodName, List<Type> listOfParamTypes, List<Object> listOfArgs)
		{
			this.stubbedObject = stubbedObject;
			this.stubbedMethodName = stubbedMethodName;
			this.listOfParamTypes = listOfParamTypes;
			this.listOfArgs = listOfArgs;
		}

		public Boolean equals(Object other)
		{
			if (other instanceof Method)
			{
				Method that = (Method)other;
				return this.stubbedObject === that.stubbedObject
					&& this.stubbedMethodName == that.stubbedMethodName
					&& this.listOfParamTypes == that.listOfParamTypes
					&& this.listOfArgs == that.listOfArgs;
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
