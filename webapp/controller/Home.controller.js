sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.app.testproject.controller.Home", {
        onInit() {
            console.log("onInit")
        },
        onBeforeRendering: function () {
            console.log("Before rendering");
            console.log(document.getElementById("_IDGenInput1"));
        },
        onAfterRendering: function () {
            console.log("After rendering");
            this.byId("_IDGenInput1").focus();
            console.log(document.getElementById("_IDGenInput1"));

        },
        onRefresh: function () {
            this.getView().rerender();
        }

    });
});