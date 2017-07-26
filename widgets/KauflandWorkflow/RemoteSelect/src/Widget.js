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
define(["require", "exports", "SelectWidget"], function (require, exports, SelectWidget) {
    "use strict";
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-select" }, args)) || this;
            _this.widgetName = "RemoteSelect";
            return _this;
        }
        Widget.prototype.startup = function () {
            console.log(this.widgetName + ' startup', this.config, this.map);
        };
        Widget.prototype.postCreate = function () {
            console.log(this.widgetName + ' postCreate', this.config);
        };
        Widget.prototype.onOpen = function () {
            console.log(this.widgetName + ' onOpen');
        };
        Widget.prototype.onClose = function () {
            console.log(this.widgetName + ' onClose');
        };
        Widget.prototype.onMinimize = function () {
            console.log(this.widgetName + ' onMinimize');
        };
        Widget.prototype.onMaximize = function () {
            console.log(this.widgetName + ' onMaximize');
        };
        Widget.prototype.onSignIn = function (credential) {
            /* jshint unused:false*/
            console.log(this.widgetName + ' onSignIn');
        };
        Widget.prototype.onSignOut = function () {
            console.log(this.widgetName + ' onSignOut');
        };
        return Widget;
    }(SelectWidget));
    return Widget;
});
//# sourceMappingURL=Widget.js.map