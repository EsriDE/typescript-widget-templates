var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "jimu/BaseWidget", "dojo/_base/lang"], function (require, exports, BaseWidget, lang) {
    "use strict";
    var Widget = /** @class */ (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "Simple_With_Settings" }, args)) || this;
            _this.baseClass = "Simple_With_Settings";
            console.log("Constructor of " + _this.baseClass);
            return _this;
        }
        Widget.prototype.postCreate = function () {
            var _this = this;
            _super.prototype.postCreate.call(this);
            var divs = Object.keys(this.config).map(function (key) { return "<div>" + key + " with value: " + _this.config[key] + "</div>"; });
            this.subnode.innerHTML = divs.join('');
        };
        Widget.prototype.startup = function () {
            _super.prototype.startup.call(this);
            console.log("Startup of " + this.baseClass);
        };
        Widget.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            console.log("OnOpen of " + this.baseClass);
        };
        Widget.prototype.onClose = function () {
            _super.prototype.onClose.call(this);
            console.log("OnClose of " + this.baseClass);
        };
        Widget.prototype.onMinimize = function () {
            _super.prototype.onMinimize.call(this);
            console.log("OnMinimize of " + this.baseClass);
        };
        Widget.prototype.onMaximize = function () {
            _super.prototype.onMaximize.call(this);
            console.log("OnMaximize of " + this.baseClass);
        };
        Widget.prototype.onSignIn = function (credential) {
            _super.prototype.onSignIn.call(this, credential);
            console.log("OnSignIn of " + this.baseClass, credential);
        };
        Widget.prototype.onSignOut = function () {
            _super.prototype.onSignOut.call(this);
            console.log("OnSignOut of " + this.baseClass);
        };
        return Widget;
    }(BaseWidget));
    return Widget;
});

//# sourceMappingURL=Widget.js.map
