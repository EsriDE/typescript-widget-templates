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
define(["require", "exports", "jimu/WidgetManager", "dojo/_base/lang", "dojo/_base/array", "./EditWidget"], function (require, exports, WidgetManager, lang, array, EditWidget) {
    "use strict";
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-edit" }, args)) || this;
            _this.fetchDataByName(_this.config.remoteControlledBy);
            console.log(_this.manifest.name + ' constructor');
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
            this.editLayerId = undefined;
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
        Widget.prototype._bindEventsAfterCreate = function (settings) {
            _super.prototype._bindEventsAfterCreate.call(this, settings);
            this.editor.editToolbar.on('deactivate', lang.hitch(this, this.performAggregation));
        };
        Widget.prototype.performAggregation = function (selectedFeature) {
            this.publishData({
                command: "performAggregation",
                selectedFeature: selectedFeature,
                valid: true
            });
        };
        Widget.prototype._addFilterEditor = function (settings) {
            _super.prototype._addFilterEditor.call(this, settings);
            console.log(this.manifest.name + ' _addFilterEditor');
            if (this.editLayerId !== undefined) {
                // Find optionID of transmitted layerID
                array.forEach(this._filterEditor.selectDropDown.options, lang.hitch(this, function (option, i) {
                    if (option.attributes[0].nodeValue === this.editLayerId) {
                        this.editLayerOptionIndex = i;
                    }
                }));
                this._filterEditor.selectDropDown.selectedIndex = this.editLayerOptionIndex;
                this._filterEditor._onLayerFilterChanged();
            }
        };
        Widget.prototype.onReceiveData = function (name, widgetId, data, historyData) {
            var _this = this;
            console.log(this.manifest.name + " received a '" + data.command + "' command from " + name + ".", widgetId, historyData);
            this.callingWidgetId = widgetId;
            if (name === this.config.remoteControlledBy && data.command == "editPolygons" && data.layer) {
                console.log("Command concerns polygon layer " + data.layer.id + ".", widgetId, historyData);
                // Save transmitted layerID
                this.editLayerId = data.layer.id;
                // open RemoteEdit widget
                var ws = WidgetManager.getInstance();
                ws.triggerWidgetOpen(this.id);
            }
            else if (name === this.config.remoteControlledBy && data.command == "returnAggregatedData" && data.updates) {
                console.log("Command concerns update ", data.updates);
                var polygonLayer = this.map.getLayer(this.editLayerId);
                polygonLayer.applyEdits(null, data.updates).then(function (value) {
                    _this.editor.attributeInspector.refresh();
                });
            }
            else {
                console.log(this.manifest.name + " ignoring command.");
            }
        };
        return Widget;
    }(EditWidget));
    return Widget;
});
//# sourceMappingURL=Widget.js.map