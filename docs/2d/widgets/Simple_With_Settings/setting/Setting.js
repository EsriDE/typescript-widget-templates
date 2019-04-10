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
define(["require", "exports", "dojo/_base/lang", "dojo/dom-construct", "./builder/libs/ace/ace.js", "./OrigSetting"], function (require, exports, lang, domConstruct, aceEditor, OrigSetting) {
    "use strict";
    var Setting = /** @class */ (function (_super) {
        __extends(Setting, _super);
        function Setting(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-Workflow" }, args)) || this;
            console.log("Setting Page", _this.config, _this.queries);
            return _this;
        }
        Setting.prototype.startup = function () {
            console.log("Setting Page for " + this.manifest.name + " startup", this.config, this.map);
            _super.prototype.startup.call(this);
            this.setConfig(this.config);
        };
        Setting.prototype.postCreate = function () {
            console.log("Setting Page for " + this.manifest.name + " postCreate", this.config);
            // if (this.config) {
            this._init();
            // }
        };
        Setting.prototype.setConfig = function (config) {
            var e = aceEditor; // need this prothesis due to JS memory allocation
            console.debug("ACE Editor", e);
            this.editor = window.ace.edit("queries");
            this.editor.session.setMode("ace/mode/json");
            this.editor.setValue(JSON.stringify(config, null, "\t"));
        };
        Setting.prototype.getConfig = function () {
            console.log("Setting Page for " + this.manifest.name + " getConfig.", this.config);
            var newConfig = JSON.parse(this.editor.getValue());
            return newConfig;
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
            var xx = domConstruct.create("div", {
                "data-dojo-attach-point": elementName,
                style: "width: " + width + "em; height: 412px",
                name: elementName,
                id: elementName
            }, targetElement, "last");
            console.log("DOMCONSTRUCT:", xx, targetElement);
            return xx;
        };
        Setting.prototype._init = function () {
            console.log("Setting Page for " + this.manifest.name + " _init.");
            var parentElement = this.aceEdit;
            var domConfigSectionInline = domConstruct.create("div", {
                class: "config-section inline"
            }, parentElement, "last");
            this.queries = this.constructAceElement("queries", domConfigSectionInline, 50);
        };
        return Setting;
    }(OrigSetting));
    return Setting;
});

//# sourceMappingURL=Setting.js.map
