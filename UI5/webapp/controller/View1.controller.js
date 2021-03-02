// @ts-nocheck
sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/Fragment", "ns/UI5/utils/util",'sap/ui/export/library',
    'sap/ui/export/Spreadsheet'],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Fragment, util, exportLibrary, Spreadsheet) {
    "use strict";

    return Controller.extend("ns.UI5.controller.View1", {
      onInit: function () {
        this.getView().setModel(
          new sap.ui.model.json.JSONModel({
            sortItems: [],
            groupItems: [],
            filterItems: [],
          }),
          "filterModel"
        );
        this.getOwnerComponent().setModel(
          new sap.ui.model.json.JSONModel({
            items: [
              {
                SupplierID: "1",
                SupplierName: "Nerolac",
                SupplierRating: "3",
                Country: "India",
                LastPODate: "03/25/2021",
                TotalPurchaseAmount: "1000",
                PODetails: [
                  {
                    PONo: "001",
                    PODate: "01/31/2021",
                    POItem: "Paint brush",
                    Product: "Accessiores",
                    ItemAmount: "100",
                    RequestedDeliveryDate: "02/01/2021",
                    Currency: "INR",
                    Status: "Closed",
                  },
                  {
                    PONo: "002",
                    PODate: "02/31/2021",
                    POItem: "Paint Box",
                    Product: "Accessiores",
                    ItemAmount: "1900",
                    RequestedDeliveryDate: "02/01/2021",
                    Currency: "INR",
                    Status: "Open",
                  },
                  {
                    PONo: "003",
                    PODate: "01/31/2021",
                    POItem: "Paint roller",
                    Product: "Accessiores",
                    ItemAmount: "600",
                    RequestedDeliveryDate: "02/10/2021",
                    Currency: "INR",
                    Status: "Closed",
                  },
                ]
              },
              {
                SupplierID: "2",
                SupplierName: "Burger",
                SupplierRating: "4",
                Country: "USA",
                LastPODate: "01/20/2010",
                TotalPurchaseAmount: "20000",
                 PODetails: [
                  {
                    PONo: "004",
                    PODate: "01/31/2010",
                    POItem: "Paint",
                    Product: "Accessiores",
                    ItemAmount: "100",
                    RequestedDeliveryDate: "02/01/2021",
                    Currency: "INR",
                    Status: "Closed",
                  },
                  {
                    PONo: "005",
                    PODate: "01/31/2021",
                    POItem: "Paint Box",
                    Product: "Accessiores",
                    ItemAmount: "1900",
                    RequestedDeliveryDate: "02/01/2021",
                    Currency: "INR",
                    Status: "Open",
                  },
                  {
                    PONo: "006",
                    PODate: "01/11/2021",
                    POItem: "Paint roller",
                    Product: "Accessiores",
                    ItemAmount: "600",
                    RequestedDeliveryDate: "02/10/2021",
                    Currency: "INR",
                    Status: "Closed",
                  },
                ]
              },
              {
                SupplierID: "3",
                SupplierName: "Asian Paint",
                SupplierRating: "2",
                Country: "Nepal",
                LastPODate: "12/10/2005",
                TotalPurchaseAmount: "40000",
                PODetails: [
                  {
                    PONo: "007",
                    PODate: "03/25/2010",
                    POItem: "Paint",
                    Product: "Accessiores",
                    ItemAmount: "100",
                    RequestedDeliveryDate: "02/01/2021",
                    Currency: "INR",
                    Status: "Open",
                  }]
              }
            ],
            selectedItem: "",
            dataLength: "",
            selectedPoListLength: "",
          }),
          "listModel"
        );
        var listModel = this.getOwnerComponent().getModel("listModel");
        listModel.getData().dataLength = listModel.getData().items.length;
        listModel.refresh();
        this.viewSettingDlg();
      },
      onItemPress: function (oEvent) {
        var selObj = oEvent
          .getSource()
          .getBindingContext("listModel")
          .getObject();
        var listModel = this.getOwnerComponent().getModel("listModel");
        listModel.getData().selectedItem = selObj;
        listModel.getData().selectedPoListLength = selObj.PODetails.length;
        listModel.refresh();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("productDetail");
      },
      //   handleOpenDialog: function () {
      //     var that = this;

      //     if (!that._oDialogs) {
      //       that._oDialogs = {};
      //     }
      //     // creates requested dialog if not yet created

      //     if (!that._oDialogs["Dialog"]) {
      //       Fragment.load({
      //         name: "ns.UI5.fragments.Dialog",
      //         controller: that,
      //       }).then(
      //         function (oDialog) {
      //           that._oDialogs["Dialog"] = oDialog;
      //           oDialog.setFilterSearchOperator(
      //             sap.m.StringFilterOperator.Contains
      //           );

      //           that.getView().addDependent(that._oDialogs["Dialog"]);
      //           // opens the dialog

      //           that._oDialogs["Dialog"].open();
      //         }.bind(that)
      //       );
      //     } else {
      //       // opens the requested dialog

      //       that._oDialogs["Dialog"].open();
      //     }

      //     var oDialogFragment = that._oDialogs["Dialog"];

      //     return that._oDialogs["Dialog"];
      //   },
      handleOpenDialog: function () {
        util.handleOpenDialog(this);
      },
      onTranslateBtn:function(oEvent){
    var control = oEvent.getSource();
        var state = control.getPressed();
        var i18nModel;
        if (state) {
            i18nModel = new sap.ui.model.resource.ResourceModel({bundleUrl:"i18n/i18n.properties", bundleLocale:"en"});
        } else {
            i18nModel = new sap.ui.model.resource.ResourceModel({bundleUrl:"i18n/i18n_ja.properties", bundleLocale:"ja"});
        }
        this.getOwnerComponent().setModel(i18nModel, "i18n");
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
            name: "Supplier ID",
            value: "SupplierID",
          },
          {
            name: "Supplier Name",
            value: "SupplierName",
          },
          {
            name: "Supplier Rating",
            value: "SupplierRating",
          },
          {
            name: "Country",
            value: "Country",
          }
        );
        var items = listModel.getData().items;
        var keyArr = Object.keys(items[0]);
        for (var i = 0; i < keyArr.length; i++) {
          var oText = keyArr[i];
          var aItem = listModel.getData().items.map(function (obj, ind, arr) {
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
      handleCancel: function () {
        this.viewSettingDlg();
      },
      //@@ to handle confirm btn press from viewSettingDialog
      handleConfirm: function (oEve) {
        util.handleViewSettingDlgConfirmBtn(this, oEve, "table","dataLength");
      },
      //   handleConfirm: function (oEve) {
      //     var that = this;
      //     var filFunc = function () {
      //       //filter item
      //       var list = that.getView().byId("table");
      //       if (oEve.getParameter("filterCompoundKeys")) {
      //         var filterKey = Object.keys(
      //           oEve.getParameter("filterCompoundKeys")
      //         )[0];
      //         var params = oEve.getParameters();
      //         var oBinding = list.getBinding("items");
      //         var aFilter = [];
      //         for (var i in params.filterItems) {
      //           aFilter.push(
      //             new sap.ui.model.Filter(
      //               filterKey,
      //               sap.ui.model.FilterOperator.Contains,
      //               params.filterItems[i].getText()
      //             )
      //           );
      //         }
      //         if (aFilter.length > 0) {
      //           oBinding.filter(
      //             new sap.ui.model.Filter({
      //               filters: aFilter,
      //             })
      //           );
      //         } else {
      //           oBinding.filter([]);
      //         }
      //       }

      //       //sort
      //       if (oEve.getParameter("sortItem")) {
      //         var sortOrderVal = oEve.getParameter("sortDescending");
      //         var sortKey = oEve.getParameter("sortItem").getProperty("key");
      //         list
      //           .getBinding("items")
      //           .sort(new sap.ui.model.Sorter(sortKey, sortOrderVal));
      //       }
      //     };
      //     filFunc(oEve);
      //   },
      onListLiveSearch: function (oEvent) {
        var searchVal = this.byId("searchField").getValue();
        var table = this.getView().byId("table");
        var bindingItems = table.getBinding("items");
        if (!searchVal) {
          bindingItems.filter([]);
        } else {
          bindingItems.filter(
            new sap.ui.model.Filter({
              filters: [
                new sap.ui.model.Filter(
                  "SupplierName",
                  sap.ui.model.FilterOperator.Contains,
                  searchVal
                ),
                new sap.ui.model.Filter(
                  "SupplierID",
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
          .getData().dataLength = bindingItems.getCurrentContexts().length;
        this.getOwnerComponent().getModel("listModel").refresh();
      },
        createColumnConfig: function() {
			var aCols = [];
			aCols.push({
				label: 'Supplier ID',
				property: 'SupplierID'
            });
            aCols.push({
				label: 'Supplier Name',
                property: 'SupplierName',
                width:30
            });
            aCols.push({
				label: 'Supplier Rating',
                property: 'SupplierRating'
			});
			aCols.push({
				label: 'Total Purchase Amount',
				type: sap.ui.export.EdmType.Currency,
				property: 'TotalPurchaseAmount',
			//	scale: 2,
              //  unitProperty : 'CurrencyCode',
              //  displayUnit: true,
                width:20
			});
			aCols.push({
				label: 'Country',
				property: 'Country'
            });
            aCols.push({
				label: 'Last PO Date',
                property: 'LastPODate',
                wrap:true
			});
			
			return aCols;
		},
      onExport: function () {
        var aCols, oRowBinding, oSettings, oSheet, oTable;
        if (!this._oTable) {
          this._oTable = this.byId("table");
        }
        oTable = this._oTable;
        oRowBinding = oTable.getBinding("items");
        aCols = this.createColumnConfig();
        var rows = oRowBinding.getContexts().map(function (item) {
          return item.getObject();
        });
        //this.getOwnerComponent().getModel("listModel").getData().items;
        oSettings = {
          workbook: { columns: aCols },
          dataSource: rows,
          //{
          //	type: 'odata',
          // dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
          // serviceUrl: this._sServiceUrl,
          // headers: oModel.getHeaders ? oModel.getHeaders() : null,
          // count: oRowBinding.getLength ? oRowBinding.getLength() : null,
          // useBatch: true // Default for ODataModel V2
          //},
          fileName: "Product Detail List.xlsx",
          worker: false, // We need to disable worker because we are using a Mockserver as OData Service
        };

        oSheet = new Spreadsheet(oSettings);
        oSheet.build().finally(function () {
          oSheet.destroy();
        });
      },
    });
  }
);
