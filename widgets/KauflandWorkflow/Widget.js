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
define(["require", "exports", "jimu/BaseWidget", "dojo/_base/lang", "dojo/_base/event", "esri/geometry/geometryEngine", "esri/graphic", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/toolbars/edit", "esri/toolbars/draw", "esri/dijit/editing/TemplatePicker"], function (require, exports, BaseWidget, lang, event, geometryEngine, Graphic, SimpleFillSymbol, SimpleLineSymbol, Color, Edit, Draw, TemplatePicker) {
    "use strict";
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-kauflandworkflow" }, args)) || this;
            _this.baseClass = "jimu-widget-kauflandworkflow";
            return _this;
        }
        Widget.prototype.startup = function () {
            console.log('startup', this.config, this.map);
        };
        Widget.prototype.postCreate = function () {
            console.log('postCreate', this.config);
        };
        Widget.prototype.onOpen = function () {
            console.log('onOpen lala popo fifi mumu kaka');
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
            var pointGeometries = pointSelection.map(function (currentValue) { return currentValue.geometry; });
            var pointBuffers = geometryEngine.geodesicBuffer(pointGeometries, this.bufferRadiusMeters.value, "meters");
            var symbol = new SimpleFillSymbol();
            symbol.setColor(new Color([100, 100, 100, 0.25]));
            symbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color('#000'), 1));
            // add buffers to map default graphic layer with attributes from original points
            pointBuffers.map(function (pointBuffer, pointIndex) { return _this.map.graphics.add(new Graphic(pointBuffer, symbol, {
                "title": pointSelection[pointIndex].attributes.title,
                "pointidentifier": pointSelection[pointIndex].attributes.pointidentifier,
                "category": "buffer"
            })); });
        };
        Widget.prototype.resetBuffers = function () {
            var _this = this;
            var graphicsToRemove = this.map.graphics.graphics.filter(function (graphic) {
                return graphic.attributes && graphic.attributes.category === "buffer";
            });
            graphicsToRemove.map(function (graphic) { return _this.map.graphics.remove(graphic); });
        };
        Widget.prototype.editPolygons = function () {
            var layer = this.map.getLayer(this.config.polygonLayerId);
            var editToolbar = new Edit(this.map);
            editToolbar.on("deactivate", function (evt) {
                layer.applyEdits(null, [evt.graphic], null);
            });
            var editingEnabled = false;
            layer.on("dbl-click", function (evt) {
                event.stop(evt);
                if (editingEnabled === false) {
                    editingEnabled = true;
                    editToolbar.activate(Edit.EDIT_VERTICES, evt.graphic);
                }
                else {
                    layer = this;
                    editToolbar.deactivate();
                    editingEnabled = false;
                }
            });
            layer.on("click", function (evt) {
                event.stop(evt);
                if (evt.ctrlKey === true || evt.metaKey === true) {
                    layer.applyEdits(null, null, [evt.graphic]);
                    layer = this;
                    editToolbar.deactivate();
                    editingEnabled = false;
                }
            });
            var layers = [];
            layers.push(layer);
            var templatePicker = new TemplatePicker({
                featureLayers: layers,
                rows: "auto",
                columns: "auto",
                grouping: true,
                style: "height: auto; overflow: auto;"
            }, "templatePickerDiv");
            templatePicker.startup();
            var drawToolbar = new Draw(this.map);
            var selectedTemplate;
            templatePicker.on("selection-change", function () {
                if (templatePicker.getSelected()) {
                    selectedTemplate = templatePicker.getSelected();
                }
                switch (selectedTemplate.featureLayer.geometryType) {
                    case "esriGeometryPoint":
                        drawToolbar.activate(Draw.POINT);
                        break;
                    case "esriGeometryPolyline":
                        drawToolbar.activate(Draw.POLYLINE);
                        break;
                    case "esriGeometryPolygon":
                        drawToolbar.activate(Draw.POLYGON);
                        break;
                }
            });
            drawToolbar.on("draw-end", function (evt) {
                drawToolbar.deactivate();
                editToolbar.deactivate();
                var newAttributes = lang.mixin({}, selectedTemplate.template.prototype.attributes);
                var newGraphic = new Graphic(evt.geometry, null, newAttributes);
                selectedTemplate.featureLayer.applyEdits([newGraphic], null, null);
            });
        };
        return Widget;
    }(BaseWidget));
    return Widget;
});
//# sourceMappingURL=Widget.js.map