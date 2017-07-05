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
define(["require", "exports", "jimu/BaseWidget", "dojo/_base/lang"], function (require, exports, BaseWidget, lang) {
    "use strict";
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-kauflandworkflow" }, args)) || this;
            _this.baseClass = "jimu-widget-kauflandworkflow";
            return _this;
        }
        Widget.prototype.startup = function () {
            this.mapIdNode.innerHTML = 'map id:' + this.map.id;
            console.log('startup', this.config, this.map.id);
        };
        Widget.prototype.postCreate = function () {
            console.log('postCreate', this.config);
            /*
            for(var element of this.config.elements){
              var divElement = document.createElement("div");
              var linkElement = document.createElement("a");
              
              linkElement.textContent = element.name;
              linkElement.href = element.href;
        
              divElement.appendChild(linkElement);
        
              this.subnode.appendChild(divElement);
            }
            */
        };
        Widget.prototype.onOpen = function () {
            console.log('onOpen');
        };
        Widget.prototype.onClose = function () {
            console.log('onClose');
        };
        Widget.prototype.onMinimize = function () {
            console.log('onMinimize');
        };
        Widget.prototype.onMaximize = function () {
            console.log('onMaximize');
        };
        Widget.prototype.onSignIn = function (credential) {
            /* jshint unused:false*/
            console.log('onSignIn');
        };
        Widget.prototype.onSignOut = function () {
            console.log('onSignOut');
        };
        return Widget;
    }(BaseWidget));
    return Widget;
});
//# sourceMappingURL=Widget.js.map