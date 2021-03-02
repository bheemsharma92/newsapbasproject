// @ts-nocheck
sap.ui.define(
  [
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/InstanceManager",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/library",
  ],
  function (JSONModel,MessageBox,InstanceManager,History,Fragment,mLibrary) {
    return {
      readData: function (obj) {
        var oSetting = {
          success: obj.success,
          error: obj.error,
        };
        // add filter if available
        if (obj.filters) {
          oSetting.filters = obj.filters;
        }
        this.getOwnerComponent().getModel().read(obj.url, oSetting);
      },
      batchReadData: function (obj) {
        var oSetting = {
          success: obj.success,
          error: obj.error,
        };
        var oModel = this.getOwnerComponent().getModel();
        obj.filters.forEach(function (item) {
          oSetting.filters = item;
          oModel.read(obj.url, oSetting);
        });
        oModel.submitChanges(oSetting);
      },
      showErrorDialog: function (
        type,
        message,
        errorObj,
        callback,
        actionArr,
        titleDesc
      ) {
        var that = this;
        var oActionArr = actionArr
          ? actionArr
          : [sap.m.MessageBox.Action.CLOSE];
        sap.m.MessageBox[type ? type : "show"](message, {
          title: titleDesc,
          details: errorObj ? errorObj : undefined,
          actions: oActionArr,
          onClose: function (action) {
            if (jQuery.type(callback) === "function") {
              callback(that, action);
            }
          }.bind(that),
        });
      },
      handleOpenDialog: function (iThis) {
        var that = iThis;
        if (!that._oDialogs) {
          that._oDialogs = {};
        }
        // creates requested dialog if not yet created
        if (!that._oDialogs["Dialog"]) {
          Fragment.load({
            name: "ns.UI5.fragments.Dialog",
            controller: that,
          }).then(
            function (oDialog) {
              that._oDialogs["Dialog"] = oDialog;
              oDialog.setFilterSearchOperator(
                sap.m.StringFilterOperator.Contains
              );
              that.getView().addDependent(that._oDialogs["Dialog"]);
              // opens the dialog
              that._oDialogs["Dialog"].open();
            }.bind(that)
          );
        } else {
          // opens the requested dialog
          that._oDialogs["Dialog"].open();
        }

        var oDialogFragment = that._oDialogs["Dialog"];
        return that._oDialogs["Dialog"];
      },
      viewSettingDlg: function (iThis, EntitySet, EntityName, valArr) {
        var that = iThis;
        var listModel = that.getView().getModel("listModel");
        var filterModel = that.getView().getModel("filterModel");
        filterModel.getData().filterItems = [];
        filterModel.getData().sortItems = [];
        filterModel.getData().dateItem = [
          {
            datePicker: "",
          },
        ];
        filterModel.refresh();
        var oMetaModel = that.getOwnerComponent().getModel();
        var itemObj = oMetaModel.oMetadata.mEntityTypes[EntitySet].property;
        var keyArr = itemObj.map(function (obj) {
          return obj.name;
        });
        for (var i = 0; i < keyArr.length; i++) {
          var oText = oMetaModel.getProperty(
            EntityName + keyArr[i] + "/@sap:label"
          );
          if (oText) {
            var valMatchFlag;
            for (var k = 0; k < valArr.length; k++) {
              if (keyArr[i] === valArr[k]) {
                valMatchFlag = true;
                break;
              } else {
                valMatchFlag = false;
              }
            }
            if (valMatchFlag) {
              filterModel.getData().sortItems.push({
                name: oText,
                value: keyArr[i],
                selected: false,
              });
              var aItem = listModel
                .getData()
                .items.map(function (obj, ind, arr) {
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
          }
        }
        filterModel.refresh();
      },
      handleViewSettingDlgConfirmBtn: function (iThis, oEve, ctrlId, propName) {
        var that = iThis;
        // var filFunc = function () {
        //filter item
        var list = that.getView().byId(ctrlId);
        if (oEve.getParameter("filterCompoundKeys")) {
          var filterKey = Object.keys(
            oEve.getParameter("filterCompoundKeys")
          )[0];
          var params = oEve.getParameters();
          var oBinding = list.getBinding("items");
          var aFilter = [];
          for (var i in params.filterItems) {
            aFilter.push(
              new sap.ui.model.Filter(
                filterKey,
                sap.ui.model.FilterOperator.Contains,
                params.filterItems[i].getText()
              )
            );
          }
          if (aFilter.length > 0) {
            oBinding.filter(
              new sap.ui.model.Filter({
                filters: aFilter,
              })
            );
          } else {
            oBinding.filter([]);
          }
        }

        //sort
        if (oEve.getParameter("sortItem")) {
          var sortOrderVal = oEve.getParameter("sortDescending");
          var sortKey = oEve.getParameter("sortItem").getProperty("key");
          list
            .getBinding("items")
            .sort(new sap.ui.model.Sorter(sortKey, sortOrderVal));
        }
        that.getOwnerComponent().getModel("listModel").getData()[propName] = oBinding.getCurrentContexts().length;
        that.getOwnerComponent().getModel("listModel").refresh();
        // };
        // filFunc(oEve);
      },
    };
  }
);
