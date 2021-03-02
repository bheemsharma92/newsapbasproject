// @ts-nocheck
sap.ui.define(
  ["sap/ui/core/mvc/Controller", "ns/UI5/utils/formatter", "ns/UI5/utils/util"],
  function (Controller, formatter, util) {
    "use strict";

    return Controller.extend("ns.UI5.controller.productDetail", {
      formatter: formatter,
      onInit: function () {
        this.getView().addEventDelegate({
          onBeforeShow: function () {
            this.getView().setModel(
              new sap.ui.model.json.JSONModel({
                sortItems: [],
                groupItems: [],
                filterItems: [],
              }),
              "filterModel"
            );
            this.viewSettingDlg();
          }.bind(this),
        });
      },
      onNavBack: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("View1");
      },
      handleOpenDialog: function () {
        util.handleOpenDialog(this);
      },
      handleConfirm: function (oEve) {
        util.handleViewSettingDlgConfirmBtn(this, oEve, "productList","selectedPoListLength");
      },
      handleCancel: function () {
        this.viewSettingDlg();
      },
      viewSettingDlg: function () {
        var listModel = this.getOwnerComponent().getModel("listModel");
        var filterModel = this.getView().getModel("filterModel");
        var filterModel = this.getView().getModel("filterModel");
        filterModel.getData().filterItems = [];
        filterModel.getData().sortItems = [];
        filterModel.refresh();
        filterModel.getData().sortItems.push(
          {
            name: "PO Item",
            value: "POItem",
          },
          {
            name: "Requested Delivery Date",
            value: "RequestedDeliveryDate",
          }
          //   {
          //     name: "Supplier Rating",
          //     value: "SupplierRating",
          //   },
          //   {
          //     name: "Country",
          //     value: "Country",
          //   }
        );
        var items = listModel.getData().selectedItem.PODetails;
        var keyArr = Object.keys(items[0]);
        for (var i = 0; i < keyArr.length; i++) {
          var oText = keyArr[i];
          var aItem = items.map(function (obj, ind, arr) {
            return obj[keyArr[i]];
          });
          var uniqItemArr = aItem.filter(function (value, index, sArr) {
            return sArr.indexOf(value) === index;
          });
          var dumArr = [];
          uniqItemArr.forEach(function (obj) {
            if (obj !== "") {
              var a = {
                filKey: obj,
              };
              dumArr.push(a);
            }
          });
          filterModel.getData().filterItems.push({
            name: oText,
            key: keyArr[i],
            value: dumArr,
          });
        }
        filterModel.refresh();
      },
      onListLiveSearch: function () {
        var searchVal = this.byId("searchField").getValue();
        var table = this.getView().byId("productList");
        var bindingItems = table.getBinding("items");
        if (!searchVal) {
          bindingItems.filter([]);
        } else {
          bindingItems.filter(
            new sap.ui.model.Filter({
              filters: [
                new sap.ui.model.Filter(
                  "POItem",
                  sap.ui.model.FilterOperator.Contains,
                  searchVal
                ),
                new sap.ui.model.Filter(
                  "PONo",
                  sap.ui.model.FilterOperator.Contains,
                  searchVal
                ),
                // new sap.ui.model.Filter("Category", sap.ui.model.FilterOperator.Contains, searchObject)
              ],
            })
          );
        }
        this.getOwnerComponent()
          .getModel("listModel")
          .getData().selectedPoListLength = bindingItems.getCurrentContexts().length;
        this.getOwnerComponent().getModel("listModel").refresh();
      },
    });
  }
);
