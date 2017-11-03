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
define(["require", "exports", "dojo/_base/lang", "./SelectSetting"], function (require, exports, lang, SelectSetting) {
    "use strict";
    var Setting = (function (_super) {
        __extends(Setting, _super);
        function Setting(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-select-setting" }, args)) || this;
            console.log(_this.config);
            console.log("Setting Page for " + _this.manifest.name + ' constructor');
            return _this;
        }
        Setting.prototype.startup = function () {
            _super.prototype.startup.call(this);
            console.log("Setting Page for " + this.manifest.name + ' startup', this.config, this.map);
        };
        Setting.prototype.postCreate = function () {
            _super.prototype.postCreate.call(this);
            console.log("Setting Page for " + this.manifest.name + ' postCreate', this.config);
        };
        Setting.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            console.log("Setting Page for " + this.manifest.name + ' onOpen');
        };
        Setting.prototype.onClose = function () {
            _super.prototype.onClose.call(this);
            console.log("Setting Page for " + this.manifest.name + ' onClose');
        };
        Setting.prototype.onMinimize = function () {
            _super.prototype.onMinimize.call(this);
            console.log("Setting Page for " + this.manifest.name + ' onMinimize');
        };
        Setting.prototype.onMaximize = function () {
            _super.prototype.onMaximize.call(this);
            console.log("Setting Page for " + this.manifest.name + ' onMaximize');
        };
        Setting.prototype.onSignIn = function (credential) {
            _super.prototype.onSignIn.call(this);
            /* jshint unused:false*/
            console.log("Setting Page for " + this.manifest.name + ' onSignIn');
        };
        Setting.prototype.onSignOut = function () {
            _super.prototype.onSignOut.call(this);
            console.log("Setting Page for " + this.manifest.name + ' onSignOut');
        };
        return Setting;
    }(SelectSetting));
    return Setting;
});
//# sourceMappingURL=Setting.js.map