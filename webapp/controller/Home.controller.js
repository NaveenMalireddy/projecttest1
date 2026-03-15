sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], (Controller, JSONModel, Fragment, MessageToast) => {
    "use strict";

    return Controller.extend("com.app.testproject.controller.Home", {
        onInit() {
            console.log("onInit")
            this._oDialog = null;
            this._oTempModel = new JSONModel({ tempData: {} });
            this.getView().setModel(this._oTempModel, "view");
        },
        // onBeforeRendering: function () {
        //     console.log("Before rendering");
        //     console.log(document.getElementById("_IDGenInput1"));
        // },
        // onAfterRendering: function () {
        //     console.log("After rendering");
        //     this.byId("_IDGenInput1").focus();
        //     console.log(document.getElementById("_IDGenInput1"));

        // },
        // onRefresh: function () {
        //     this.getView().rerender();
        // },
        onEmployeePress: function (oEvent) {
            console.log(oEvent.getSource());
            console.log("Employee pressed");
            var oRouter = this.getOwnerComponent().getRouter();

            var oContext = oEvent.getSource().getBindingContext();

            var empId = oContext.getProperty("ID");
            oRouter.navTo("EmployeeObject", {
                empId: empId
            });
        },
        onCreate: function () {
            this._oTempModel.setProperty("/tempData", {
                fName: "", lName: "", email: "", phone: "", gender: "Male",
                address: [{ city: "", address: "" }]
            });
            this._oTempModel.setProperty("/dialogTitle", "Create Employee");

            if (!this._oDialog) {
                Fragment.load({
                    id: "idEmployeeDialog",
                    name: "com.app.testproject.fragments.CreateEmployeeDialog",
                    controller: this
                }).then(oDialog => {
                    this._oDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this._oDialog.open();
            }
        },

        onSaveDialog: function () {
            const oTable = this.byId("idProductsTable");
            const oMainModel = this.getView().getModel();
            const aEmployees = oMainModel.getProperty("/employee") || [];
            const oTempData = this._oTempModel.getProperty("/tempData");

            // Fix address structure
            oTempData.address = [{
                city: oTempData.address?.[0]?.city || "",
                address: oTempData.address?.[0]?.address || "",
                pincode: 123456,
                employee_ID: oTempData.ID || "new"
            }];

            if (this._oTempModel.getProperty("/dialogTitle") === "Create Employee") {
                oTempData.ID = "emp-" + Date.now();
                oTempData.salary = { costToCompany: 500000 };
                aEmployees.unshift(oTempData);
                MessageToast.show("Created!");
            } else {
                const sPath = oTable.getSelectedItems()[0].getBindingContext().getPath();
                const iIndex = parseInt(sPath.split('/')[2]);
                aEmployees[iIndex] = oTempData;
                MessageToast.show("Updated!");
            }

            oMainModel.setProperty("/employee", aEmployees);
            this._oDialog.close();
            oTable.removeSelections(true);
        },

        onCancelDialog: function () {
            this._oDialog.close();
        },

        onEdit: function () {
            const oTable = this.byId("idProductsTable");
            const aSelected = oTable.getSelectedItems();

            // Check exactly 1 selected
            if (aSelected.length !== 1) {
                MessageToast.show("Select **exactly one** employee to edit");
                return;
            }

            const oContext = aSelected[0].getBindingContext();
            const oEmployee = oContext.getObject();

            // Load selected employee data (SAME as create but with real data)
            this._oTempModel.setProperty("/tempData", oEmployee);
            this._oTempModel.setProperty("/dialogTitle", `Edit ${oEmployee.fName}`);

            // Open SAME dialog
            if (!this._oDialog) {
                Fragment.load({
                    id: "idEmployeeDialog",
                    name: "com.app.testproject.fragments.CreateEmployeeDialog",
                    controller: this
                }).then(oDialog => {
                    this._oDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this._oDialog.open();
            }
        },

        /** DELETE Selected Items - Direct */
        onDelete: function () {
            const oTable = this.byId("idProductsTable");
            const aSelected = oTable.getSelectedItems();

            if (aSelected.length === 0) {
                MessageToast.show("Select employees to delete");
                return;
            }

            const oMainModel = this.getView().getModel();
            const aEmployees = oMainModel.getProperty("/employee") || [];

            // Delete ALL selected items (reverse order = no index issues)
            aSelected.slice().reverse().forEach(oItem => {
                const sPath = oItem.getBindingContext().getPath();  // "/employee/2"
                const iIndex = parseInt(sPath.split('/')[2]);       // 2
                aEmployees.splice(iIndex, 1);                       // Remove index 2
            });

            // Update model + clear selections
            oMainModel.setProperty("/employee", aEmployees);
            oTable.removeSelections(true);

            MessageToast.show(`${aSelected.length} item(s) deleted`);
        },





    });
});