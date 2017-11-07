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
    var Setting = /** @class */ (function (_super) {
        __extends(Setting, _super);
        function Setting(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-select-setting" }, args)) || this;
            console.log("Setting Page for " + _this.manifest.name + ' constructor.', _this.config);
            return _this;
        }
        Setting.prototype.startup = function () {
            console.log("Setting Page for " + this.manifest.name + ' startup', this.config, this.map);
            _super.prototype.startup.call(this);
        };
        Setting.prototype.postCreate = function () {
            console.log("Setting Page for " + this.manifest.name + ' postCreate', this.config);
            _super.prototype.postCreate.call(this);
        };
        Setting.prototype.onOpen = function () {
            console.log("Setting Page for " + this.manifest.name + ' onOpen');
            _super.prototype.onOpen.call(this);
        };
        Setting.prototype.onClose = function () {
            console.log("Setting Page for " + this.manifest.name + ' onClose');
            _super.prototype.onClose.call(this);
        };
        Setting.prototype.onMinimize = function () {
            console.log("Setting Page for " + this.manifest.name + ' onMinimize');
            _super.prototype.onMinimize.call(this);
        };
        Setting.prototype.onMaximize = function () {
            console.log("Setting Page for " + this.manifest.name + ' onMaximize');
            _super.prototype.onMaximize.call(this);
        };
        Setting.prototype.onSignIn = function (credential) {
            /* jshint unused:false*/
            console.log("Setting Page for " + this.manifest.name + ' onSignIn');
            _super.prototype.onSignIn.call(this);
        };
        Setting.prototype.onSignOut = function () {
            console.log("Setting Page for " + this.manifest.name + ' onSignOut');
            _super.prototype.onSignOut.call(this);
        };
        Setting.prototype.getConfig = function () {
            console.log("Setting Page for " + this.manifest.name + ' getConfig.', this.config);
            var newConfig = _super.prototype.getConfig.call(this);
            newConfig.remoteControlledBy = this.remoteControlledBy.textbox.value;
            return newConfig;
        };
        Setting.prototype._init = function () {
            console.log("Setting Page for " + this.manifest.name + ' _init.');
            _super.prototype._init.call(this);
            this.remoteControlledBy.textbox.value = this.config.remoteControlledBy;
        };
        return Setting;
    }(SelectSetting));
    return Setting;
});
//# sourceMappingURL=Setting.js.map