sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.app.testproject.controller.EmployeeObject", {
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);

        },

       onUserDetailsLoad: function (oEvent) {
            const empId = oEvent.getParameter("arguments").empId;
            const oObjectPage = this.getView().byId("ObjectPageLayout");
            
            // GlobalModel is auto-loaded. Find employee index by ID
            const oModel = this.getView().getModel(); // Default model (GlobalModel)
            const aEmployees = oModel.getProperty("/employee") || [];
            const iIndex = aEmployees.findIndex(emp => emp.ID === empId);
            oObjectPage.bindElement(`/employee/${iIndex}`);
        },

    });
});