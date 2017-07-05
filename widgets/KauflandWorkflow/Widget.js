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
define(["require", "exports", "jimu/BaseWidget", "dojo/_base/lang", "esri/geometry/geometryEngine", "esri/graphic", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color"], function (require, exports, BaseWidget, lang, geometryEngine, Graphic, SimpleFillSymbol, SimpleLineSymbol, Color) {
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
            console.log('startup', this.config, this.map.id, this.map);
        };
        Widget.prototype.postCreate = function () {
            console.log('postCreate', this.config);
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
        Widget.prototype.generateBufferAroundPointSelection = function () {
            var _this = this;
            var pointLayer = this.map.getLayer(this.config.pointLayerId);
            var pointSelection = pointLayer.getSelectedFeatures();
            var pointGeometries = pointSelection.map(function (currentValue, index, array) {
                return currentValue.geometry;
            });
            var pointBuffers = geometryEngine.geodesicBuffer(pointGeometries, this.bufferRadiusMeters.value, "meters");
            var symbol = new SimpleFillSymbol();
            symbol.setColor(new Color([100, 100, 100, 0.25]));
            symbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color('#000'), 1));
            pointBuffers.map(function (pointBuffer) { return _this.map.graphics.add(new Graphic(pointBuffer, symbol)); });
            console.log('map.graphics', this.map.graphics);
        };
        return Widget;
    }(BaseWidget));
    return Widget;
});
//# sourceMappingURL=Widget.js.map