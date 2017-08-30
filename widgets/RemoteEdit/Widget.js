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
define(["require", "exports", "dojo/_base/lang", "./EditWidget"], function (require, exports, lang, EditWidget) {
    "use strict";
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-edit" }, args)) || this;
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
            console.log(this.manifest.name + " received a '" + data.command + "' command from " + name + ".", widgetId, historyData);
        };
        return Widget;
    }(EditWidget));
    return Widget;
});
//# sourceMappingURL=Widget.js.map