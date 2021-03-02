sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (sStatus) {
			//var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sStatus) {
				case "Open":
					return "Error";//resourceBundle.getText("invoiceStatusA");
				case "Closed":
					return "Success";//resourceBundle.getText("invoiceStatusB");
			}
		}
	};
});