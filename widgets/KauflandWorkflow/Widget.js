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
            alert("constructor was called" + _this.map.id);
            return _this;
        }
        Widget.prototype.startup = function () {
            this.inherited(arguments);
            this.mapIdNode.innerHTML = 'map id:' + this.map.id;
            alert("mapID: " + this.map.id);
            console.log('startup', arguments);
        };
        return Widget;
    }(BaseWidget));
    return Widget;
});
//# sourceMappingURL=Widget.js.map