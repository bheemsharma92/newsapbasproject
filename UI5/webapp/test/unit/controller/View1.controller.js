/*global QUnit*/

sap.ui.define([
	"ns/UI5/controller/View1.controller"
], function (Controller) {
	"use strict";

	// @ts-ignore
	QUnit.module("View1 Controller");

	// @ts-ignore
	QUnit.test("I should test the View1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
