({
	onGenerateClick: function (component, event, helper) {
		helper.requestPrimes(component);
	},

	onMonitoredEvent: function (component, event, helper) {
		helper.handleMonitoredEvent(event);
	},
})
