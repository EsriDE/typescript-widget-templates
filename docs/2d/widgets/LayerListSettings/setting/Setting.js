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
define(["require", "exports", "dojo/_base/lang", "dojo/dom-construct", "./builder/libs/ace/ace.js", "./LayerListSetting"], function (require, exports, lang, domConstruct, aceEditor, LayerListSetting) {
    "use strict";
    var Setting = /** @class */ (function (_super) {
        __extends(Setting, _super);
        function Setting(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-layerList-setting" }, args)) || this;
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
            if (this.config) {
                this._init();
            }
        };
        Setting.prototype.setConfig = function (config) {
            console.log("Setting Page for " + this.manifest.name + ' setConfig.', this.config);
            _super.prototype.setConfig.call(this, config);
            this.portalUrl.value = config.portalUrl;
            this.maxNumOfActiveLayers.value = config.maxNumOfActiveLayers;
            this.showLayerType.value = config.showLayerType;
            this.showSpatialReference.value = config.showSpatialReference;
            this.rasterLayerDefaultOpacity.value = config.rasterLayerDefaultOpacity;
            var e = aceEditor; // need this prothesis due to JS memory allocation
            this.editor = window.ace.edit("queries");
            this.editor.session.setMode("ace/mode/json");
            this.editor.setValue(JSON.stringify(config.queries, null, '\t'));
        };
        Setting.prototype.getConfig = function () {
            console.log("Setting Page for " + this.manifest.name + ' getConfig.', this.config);
            var newConfig = _super.prototype.getConfig.call(this);
            newConfig.portalUrl = this.portalUrl.value;
            newConfig.maxNumOfActiveLayers = this.maxNumOfActiveLayers.value;
            newConfig.showLayerType = this.convertToBoolean(this.showLayerType.value);
            newConfig.showSpatialReference = this.convertToBoolean(this.showSpatialReference.value);
            newConfig.rasterLayerDefaultOpacity = this.convertToBoolean(this.rasterLayerDefaultOpacity.value);
            newConfig.queries = JSON.parse(this.editor.getValue());
            return newConfig;
        };
        Setting.prototype.constructInputElement = function (elementName, targetElement, width, height) {
            if (width === void 0) { width = 10; }
            if (height === void 0) { height = 1.5; }
            var label = domConstruct.create("div", {
                class: "label",
                style: "margin-right: 3px;"
            }, targetElement, "last");
            label.innerHTML = this.nls[elementName];
            return domConstruct.create("input", {
                "data-dojo-attach-point": elementName,
                "data-dojo-type": "dijit/form/TextBox",
                "style": "width: " + width + "em; height: " + height + "em;",
                "name": elementName
            }, targetElement, "last");
        };
        Setting.prototype.constructAceElement = function (elementName, targetElement, width, height) {
            if (width === void 0) { width = 10; }
            if (height === void 0) { height = 1.5; }
            if (width === void 0) {
                width = 10;
            }
            if (height === void 0) {
                height = 1.5;
            }
            var label = domConstruct.create("div", {
                class: "label",
                style: "margin-right: 3px;"
            }, targetElement, "last");
            label.innerHTML = this.nls[elementName];
            return domConstruct.create("div", {
                "data-dojo-attach-point": elementName,
                "style": "width: " + width + "em; height: 412px",
                "name": elementName,
                "id": elementName
            }, targetElement, "last");
        };
        Setting.prototype._init = function () {
            console.log("Setting Page for " + this.manifest.name + ' _init.');
            var parentElement = this.controlPopupMenuPart.parentElement;
            var domConfigSectionInline = domConstruct.create("div", {
                class: "config-section inline"
            }, parentElement, "last");
            this.portalUrl = this.constructInputElement("portalUrl", domConfigSectionInline, 50);
            this.maxNumOfActiveLayers = this.constructInputElement("maxNumOfActiveLayers", domConfigSectionInline);
            this.showLayerType = this.constructInputElement("showLayerType", domConfigSectionInline);
            this.showSpatialReference = this.constructInputElement("showSpatialReference", domConfigSectionInline);
            this.rasterLayerDefaultOpacity = this.constructInputElement("rasterLayerDefaultOpacity", domConfigSectionInline);
            this.queries = this.constructAceElement("queries", domConfigSectionInline, 50);
        };
        Setting.prototype.convertToBoolean = function (input) {
            try {
                return JSON.parse(input);
            }
            catch (e) {
                return undefined;
            }
        };
        return Setting;
    }(LayerListSetting));
    return Setting;
});

//# sourceMappingURL=Setting.js.map
