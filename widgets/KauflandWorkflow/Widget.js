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
define(["require", "exports", "jimu/BaseWidget", "jimu/WidgetManager", "dojo/_base/lang", "dojo/_base/array", "dojox/json/query", "dojo/dom", "dojo/dom-construct", "dojo/dom-style", "dojo/query", "esri/geometry/geometryEngine", "esri/graphic", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/tasks/Geoprocessor", "esri/tasks/FeatureSet"], function (require, exports, BaseWidget, WidgetManager, lang, array, jsonQuery, dom, domConstruct, domStyle, domQuery, geometryEngine, Graphic, SimpleFillSymbol, SimpleLineSymbol, Color, Geoprocessor, FeatureSet) {
    "use strict";
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-kauflandworkflow" }, args)) || this;
            _this.baseClass = "jimu-widget-kauflandworkflow";
            if (_this.config.generateBuffers !== true) {
                domStyle.set(_this.generateBuffersContainer, "display", "none");
            }
            _this.firstEditorInit = true;
            _this.initGeoprocessor();
            return _this;
        }
        Widget.prototype.activateButtons = function (name) {
            // Activate buttons that contain the WidgetName as CSS class when widgets are loaded
            var buttonNodes = domQuery("input[type='button']." + name);
            array.forEach(buttonNodes, function (buttonNode) {
                buttonNode.disabled = false;
            });
        };
        Widget.prototype.startup = function () {
            console.log(this.manifest.name + ' startup', this.config, this.map);
        };
        Widget.prototype.postCreate = function () {
            console.log(this.manifest.name + ' postCreate', this.config);
        };
        Widget.prototype.onOpen = function () {
            console.log(this.manifest.name + ' onOpen');
            // Initialize all widgets that are remote controlled by this one to be able to open them via the WidgetManager.
            var ws = WidgetManager.getInstance();
            this.config.remotelyControlling.map(lang.hitch(this, function (remotelyControlledWidgetName) {
                this.fetchDataByName(remotelyControlledWidgetName);
                if (ws.getWidgetsByName(remotelyControlledWidgetName).length == 0) {
                    var remoteWidget = jsonQuery("$..widgets..[?name='" + remotelyControlledWidgetName + "']", this.appConfig);
                    if (remoteWidget[0]) {
                        ws.loadWidget(remoteWidget[0]).then(lang.hitch(this, function (evt) {
                            this.activateButtons(evt.name);
                        }));
                    }
                    else {
                        console.warn("No appConfig entry found for widget named " + remotelyControlledWidgetName + ".", remoteWidget);
                    }
                }
                else {
                    this.activateButtons(remotelyControlledWidgetName);
                }
            }));
        };
        Widget.prototype.onClose = function () {
            console.log(this.manifest.name + ' onClose');
            if (this.templatePicker)
                this.templatePicker.destroy();
            if (this.attributeInspector)
                this.attributeInspector.destroy();
            if (this.editToolbar) {
                this.editToolbar.deactivate();
                this.editToolbar = null;
            }
        };
        Widget.prototype.onMinimize = function () {
            console.log(this.manifest.name + ' onMinimize');
        };
        Widget.prototype.onMaximize = function () {
            console.log(this.manifest.name + ' onMaximize');
        };
        Widget.prototype.onSignIn = function (credential) {
            /* jshint unused:false*/
            console.log(this.manifest.name + ' onSignIn');
        };
        Widget.prototype.onSignOut = function () {
            console.log(this.manifest.name + ' onSignOut');
        };
        Widget.prototype.onReceiveData = function (name, widgetId, data, historyData) {
            console.log(this.manifest.name + " received a '" + data.command + "' command from " + name + ".", widgetId, historyData);
            if (data.command == "generateBuffers" && data.valid) {
                var pointLayer = this.map.getLayer(this.config.pointLayerId);
                var pointSelection = pointLayer.getSelectedFeatures();
                this.generateBufferAroundPointSelection(pointSelection);
                data.valid = false;
            }
            else if (data.command == "performAggregation" && data.valid && data.selectedFeature) {
                this.selectedFeature = data.selectedFeature;
                var selectedFeatures = [];
                selectedFeatures.push(data.selectedFeature.graphic);
                var selectedFeatureSet = new FeatureSet();
                selectedFeatureSet.features = selectedFeatures;
                this.performAggregation(selectedFeatureSet);
                data.valid = false;
            }
        };
        Widget.prototype.initGeoprocessor = function () {
            this.geoprocessor = new Geoprocessor(this.config.geoprocessorUrl);
            this.geoprocessor.setOutSpatialReference({
                wkid: 102100
            });
            this.geoprocessor.on("execute-complete", lang.hitch(this, this.geoprocessorCallback));
        };
        Widget.prototype.geoprocessorCallback = function (evt) {
            var _this = this;
            // hide loader
            if (dom.byId("loadingIndicatorContainer" + this.label.replace(/ /g, ''))) {
                domStyle.set(dom.byId("loadingIndicatorContainer" + this.label.replace(/ /g, '')), "display", "none");
            }
            if (dom.byId("loadingIndicatorText" + this.label.replace(/ /g, ''))) {
                domStyle.set(dom.byId("loadingIndicatorText" + this.label.replace(/ /g, '')), "display", "none");
            }
            if (dom.byId("loadingIndicatorImage" + this.label.replace(/ /g, ''))) {
                domStyle.set(dom.byId("loadingIndicatorImage" + this.label.replace(/ /g, '')), "display", "none");
            }
            var updateAttributes = {};
            if (evt && evt.results) {
                evt.results.forEach(function (result) {
                    updateAttributes[result.paramName] = result.value;
                    _this.selectedFeature.graphic.attributes[result.paramName] = result.value;
                });
                updateAttributes[this.config.polygonLayerFieldNames.objectId] = this.selectedFeature.graphic.attributes[this.config.polygonLayerFieldNames.objectId];
                var updates = [{ "attributes": updateAttributes }];
                this.publishData({
                    command: "returnAggregatedData",
                    updates: updates,
                    selectedFeatureLayerId: this.selectedFeature.graphic._layer.id,
                    valid: true
                });
            }
        };
        Widget.prototype.performAggregation = function (pFeatureSet) {
            if (pFeatureSet.features.length > 0) {
                var params = {
                    "Feature_Class": pFeatureSet
                };
                this.geoprocessor.execute(params);
            }
            // show loader
            if (dom.byId("loadingIndicatorContainer" + this.label.replace(/ /g, ''))) {
                domStyle.set(dom.byId("loadingIndicatorContainer" + this.label.replace(/ /g, '')), "display", "block");
            }
            else {
                this.loadingIndicatorContainer = domConstruct.create("div", {
                    id: "loadingIndicatorContainer" + this.label.replace(/ /g, ''),
                    class: "loadingIndicatorContainer"
                }, this.getPanel().domNode);
            }
            if (dom.byId("loadingIndicatorText" + this.label.replace(/ /g, ''))) {
                domStyle.set(dom.byId("loadingIndicatorText" + this.label.replace(/ /g, '')), "display", "block");
            }
            else {
                this.loadingIndicatorText = domConstruct.create("div", {
                    id: "loadingIndicatorText" + this.label.replace(/ /g, ''),
                    class: "loadingIndicatorText",
                    innerHTML: this.nls.performingAggregation
                }, dom.byId("loadingIndicatorContainer" + this.label.replace(/ /g, '')));
            }
            if (dom.byId("loadingIndicatorImage" + this.label.replace(/ /g, ''))) {
                domStyle.set(dom.byId("loadingIndicatorImage" + this.label.replace(/ /g, '')), "display", "block");
            }
            else {
                this.loadingIndicatorImage = domConstruct.create("img", {
                    id: "loadingIndicator" + this.label.replace(/ /g, ''),
                    class: "loadingIndicator",
                    src: "https://js.arcgis.com/3.21/esri/dijit/images/ajax-loader-segments-circle-64.gif"
                }, dom.byId("loadingIndicatorText" + this.label.replace(/ /g, '')), "first");
            }
        };
        Widget.prototype.checkPointSelection = function () {
            var pointLayer = this.map.getLayer(this.config.pointLayerId);
            if (pointLayer) {
                var pointSelection = pointLayer.getSelectedFeatures();
                if (pointSelection.length == 0) {
                    this.publishData({
                        command: "selectBufferPoint",
                        layer: pointLayer
                    });
                }
                else {
                    this.generateBufferAroundPointSelection(pointSelection);
                }
            }
            else {
                console.error("Point layer with ID " + this.config.pointLayerId + " not found in map.");
            }
        };
        Widget.prototype.generateBufferAroundPointSelection = function (pointSelection) {
            var _this = this;
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
            this.polygonLayer = this.map.getLayer(this.config.polygonLayerId);
            if (this.polygonLayer) {
                this.publishData({
                    command: "editPolygons",
                    layer: this.polygonLayer
                });
            }
        };
        return Widget;
    }(BaseWidget));
    return Widget;
});
//# sourceMappingURL=Widget.js.map