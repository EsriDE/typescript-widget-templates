/// <reference path="../../jimu.d.ts/jimu.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "dojo/_base/lang", "dojo/dom-construct", "dijit/form/Button", "./SelectWidget"], function (require, exports, lang, domConstruct, Button, SelectWidget) {
    "use strict";
    var Widget = /** @class */ (function (_super) {
        __extends(Widget, _super);
        // Modify name of the base class (see source code of original template). 
        function Widget(args) {
            return _super.call(this, lang.mixin({ baseClass: "jimu-widget-select" }, args)) || this;
        }
        Widget.prototype.startup = function () {
            _super.prototype.startup.call(this);
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
            console.log(this.manifest.name + ' onSignIn');
        };
        Widget.prototype.onSignOut = function () {
            _super.prototype.onSignOut.call(this);
            console.log(this.manifest.name + ' onSignOut');
        };
        Widget.prototype.postCreate = function () {
            var _this = this;
            _super.prototype.postCreate.call(this);
            var btnContainer = domConstruct.create("div", {}, this.layerListNode, "last");
            var allSelectedFeaturesBtn = new Button({
                label: "Log all selected features",
                style: "position: absolute; top: 41px;",
                onClick: function (evt) {
                    console.log(_this.manifest.name + ' You clicked send! | layerItems:', _this.layerItems, evt);
                    var allSelectedFeatures = _this.layerItems.map(function (layerItem) {
                        return layerItem.featureLayer.getSelectedFeatures();
                    });
                    console.log("allSelectedFeatures: ", allSelectedFeatures);
                }
            }, btnContainer).startup();
            console.log(this.manifest.name + ' onpostCreate | layerItems:', this.layerItems);
        };
        Widget.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            console.log(this.manifest.name + ' onOpen');
        };
        return Widget;
    }(SelectWidget));
    return Widget;
});

//# sourceMappingURL=Widget.js.map
