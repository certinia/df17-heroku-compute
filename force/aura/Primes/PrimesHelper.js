({
	getPrimes: function (component) {
		var me = this;
			action = component.get('c.getPrimes');

        action.setParams({ max : 10 });
        action.setCallback(me, function (actionResult) {
            component.set('v.primes', actionResult.getReturnValue());
		});

		$A.enqueueAction(action);
	}
});
