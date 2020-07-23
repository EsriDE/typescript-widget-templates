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
define(["require", "exports", "dojo/dom-style", "dojo/dom-geometry", "dojo/_base/lang", "jimu/BaseWidget", "./PrintPlus"], function (require, exports, domStyle, domGeometry, lang, BaseWidget, Print) {
    "use strict";
    var Widget = /** @class */ (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-printplus" }, args)) || this;
            _this.baseClass = "jimu-widget-printplus";
            console.log("Constructor of " + _this.baseClass);
            return _this;
        }
        Widget.prototype.postCreate = function () {
            _super.prototype.postCreate.call(this);
            this.print = new Print({
                map: this.map,
                printTaskURL: this.config.serviceURL,
                defaultAuthor: this.config.defaultAuthor,
                defaultCopyright: this.config.defaultCopyright,
                defaultTitle: this.config.defaultTitle,
                defaultFormat: this.config.defaultFormat,
                defaultLayout: this.config.defaultLayout,
                defaultDpi: this.config.defaultDpi || 96,
                noTitleBlockPrefix: this.config.noTitleBlockPrefix,
                layoutParams: this.config.layoutParams,
                relativeScale: this.config.relativeScale,
                relativeScaleFactor: this.config.relativeScaleFactor,
                scalePrecision: this.config.scalePrecision,
                mapScales: this.config.mapScales,
                outWkid: this.config.outWkid,
                showLayout: this.config.showLayout,
                showOpacitySlider: this.config.showOpacitySlider,
                domIdPrefix: this.id,
                nls: this.nls
            }).placeAt(this.printPlusNode);
            this.print.startup();
        };
        Widget.prototype.onSignIn = function (credential) {
            _super.prototype.onSignIn.call(this, credential);
            console.log("onSignIn", credential);
            user = user || {};
            if (user.userId) {
                this.print.updateAuthor(user.userId);
            }
        };
        Widget.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            this.print._onOpen();
        };
        Widget.prototype.onClose = function () {
            _super.prototype.onClose.call(this);
            this.print._onClose();
        };
        Widget.prototype.resize = function () {
            var _this = this;
            _super.prototype.resize.call(this);
            // If the widget docked, its panel will have the same width as the innerWidth of the browser window.
            // Delay for a brief time to allow the panel to attain its full size.
            setTimeout(function () {
                var node = _this.getParent().domNode;
                var computedStyle = domStyle.getComputedStyle(node);
                var output = domGeometry.getMarginBox(node, computedStyle);
                var isDocked = Math.abs(window.innerWidth - output.w) <= 1;
                _this.print._resize(isDocked);
            }, 100);
        };
        return Widget;
    }(BaseWidget));
    return Widget;
});

//# sourceMappingURL=Widget.js.map
