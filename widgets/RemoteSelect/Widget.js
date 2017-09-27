var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "jimu/WidgetManager", "jimu/PanelManager", "dojo/_base/lang", "dojo/_base/html", "./SelectWidget"], function (require, exports, WidgetManager, PanelManager, lang, html, SelectWidget) {
    "use strict";
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-select" }, args)) || this;
            _this.fetchDataByName(_this.config.remoteControlledBy);
            console.log(_this.widgetName + ' constructor');
            return _this;
        }
        Widget.prototype.startup = function () {
            _super.prototype.startup.call(this);
            console.log(this.manifest.name + ' startup', this.config, this.map);
        };
        Widget.prototype.postCreate = function () {
            _super.prototype.postCreate.call(this);
            console.log(this.manifest.name + ' postCreate', this.config);
        };
        Widget.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            console.log(this.manifest.name + ' onOpen');
        };
        Widget.prototype.onClose = function () {
            _super.prototype.onClose.call(this);
            console.log(this.manifest.name + ' onClose');
        };
        Widget.prototype.onMinimize = function () {
            _super.prototype.onMinimize.call(this);
            console.log(this.manifest.name + ' onMinimize');
        };
        Widget.prototype.onMaximize = function () {
            _super.prototype.onMaximize.call(this);
            console.log(this.manifest.name + ' onMaximize');
        };
        Widget.prototype.onSignIn = function (credential) {
            _super.prototype.onSignIn.call(this);
            /* jshint unused:false*/
            console.log(this.manifest.name + ' onSignIn');
        };
        Widget.prototype.onSignOut = function () {
            _super.prototype.onSignOut.call(this);
            console.log(this.manifest.name + ' onSignOut');
        };
        Widget.prototype.onReceiveData = function (name, widgetId, data, historyData) {
            console.log(this.manifest.name + " received a '" + data.command + "' command from " + name + " concerning point layer " + data.layer.name + ".", widgetId, historyData);
            this.callingWidgetId = widgetId;
            if (name === this.config.remoteControlledBy && data.command === "selectBufferPoint") {
                // uncheck other layers
                this.layerItems.map(function (layerItem) {
                    if (layerItem.featureLayer !== data.layer) {
                        html.removeClass(layerItem.selectableCheckBox, 'checked');
                    }
                });
                // select layer
                this.selectDijit.setFeatureLayers([data.layer]);
                // open RemoteSelect widget
                var ws_1 = WidgetManager.getInstance();
                ws_1.triggerWidgetOpen(this.id);
                // after making the selection, return to original widget ("widgetId" parameter) and trigger buffer operation there
                this.selectionCompleteSignal = data.layer.on("selection-complete", lang.hitch(this, function (selection) { this.selectionCompleteBackToBuffer(selection, widgetId, ws_1); }));
            }
            else {
                console.log(this.manifest.name + " ignoring command.");
            }
        };
        Widget.prototype.selectionCompleteBackToBuffer = function (selection, callingWidgetId, ws) {
            if (selection.features.length > 0) {
                this.publishData({
                    command: "generateBuffers",
                    valid: true
                });
                console.log(ws.getAllWidgets());
                ws.triggerWidgetOpen(callingWidgetId);
                var ps = PanelManager.getInstance();
                ps.closePanel(this.id + "_panel");
                this.selectionCompleteSignal.remove();
            }
        };
        return Widget;
    }(SelectWidget));
    return Widget;
});
//# sourceMappingURL=Widget.js.map