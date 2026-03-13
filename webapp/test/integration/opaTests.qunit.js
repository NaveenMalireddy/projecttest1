/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["com/app/testproject/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
