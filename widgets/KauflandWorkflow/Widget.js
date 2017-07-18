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
define(["require", "exports", "jimu/BaseWidget", "dojo/_base/lang", "dojo/_base/event", "dojo/dom-construct", "dojo/dom-style", "dijit/form/Button", "esri/layers/FeatureLayer", "esri/geometry/geometryEngine", "esri/graphic", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/toolbars/edit", "esri/toolbars/draw", "esri/dijit/editing/TemplatePicker", "esri/dijit/AttributeInspector", "esri/tasks/query", "esri/tasks/Geoprocessor", "esri/tasks/FeatureSet"], function (require, exports, BaseWidget, lang, event, domConstruct, domStyle, Button, FeatureLayer, geometryEngine, Graphic, SimpleFillSymbol, SimpleLineSymbol, Color, Edit, Draw, TemplatePicker, AttributeInspector, Query, Geoprocessor, FeatureSet) {
    "use strict";
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-kauflandworkflow" }, args)) || this;
            _this.baseClass = "jimu-widget-kauflandworkflow";
            _this.firstEditorInit = true;
            _this.initGeoprocessor();
            return _this;
        }
        Widget.prototype.startup = function () {
            console.log('startup', this.config, this.map);
        };
        Widget.prototype.postCreate = function () {
            console.log('postCreate', this.config);
        };
        Widget.prototype.onOpen = function () {
            console.log('onOpen lala popo fifi mumu kaka ');
        };
        Widget.prototype.onClose = function () {
            console.log('onClose');
            if (this.templatePicker)
                this.templatePicker.destroy();
            if (this.attributeInspector)
                this.attributeInspector.destroy();
            if (this.editToolbar) {
                this.editToolbar.deactivate();
                this.editToolbar = null;
            }
            this.editLayerOnDblClickEventHandler = function (evt) { console.log("double click deactivated"); };
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
        Widget.prototype.initGeoprocessor = function () {
            this.geoprocessor = new Geoprocessor(this.config.geoprocessorUrl);
            this.geoprocessor.setOutSpatialReference({
                wkid: 102100
            });
            this.geoprocessor.on("execute-complete", lang.hitch(this, function (evt) {
                var _this = this;
                var updateAttributes = {};
                evt.results.forEach(function (result) {
                    updateAttributes[result.paramName] = result.value;
                });
                updateAttributes[this.config.polygonLayerFieldNames.objectId] = this.editLayer.getSelectedFeatures()[0].attributes[this.config.polygonLayerFieldNames.objectId];
                var updates = [{ "attributes": updateAttributes }];
                this.editLayer.applyEdits(null, updates).then(function (value) {
                    _this.attributeInspector.refresh();
                });
                domStyle.set(this.loadingIndicatorContainer, "visibility", "hidden");
                domStyle.set(this.editPolygonsContainer, "background", "#fff");
            }));
        };
        Widget.prototype.performAggregation = function () {
            var paramsFeatureSet = new FeatureSet();
            paramsFeatureSet.features = this.editLayer.getSelectedFeatures();
            var params = {
                "Feature_Class": paramsFeatureSet
            };
            this.geoprocessor.execute(params);
            // show loader
            domStyle.set(this.loadingIndicatorContainer, "visibility", "visible");
            domStyle.set(this.editPolygonsContainer, "background", "#ccc");
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
            var _this = this;
            this.editLayer = this.map.getLayer(this.config.polygonLayerId);
            var selectionSymbol = new SimpleFillSymbol();
            selectionSymbol.setColor(new Color([0, 255, 255, 77]));
            selectionSymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 255, 255]), 1));
            this.editLayer.setSelectionSymbol(selectionSymbol);
            this.editToolbar = this.initializeEditToolbar();
            this.templatePicker = this.initializeTemplatePicker();
            this.drawToolbar = this.initializeDrawToolbar(this.templatePicker);
            this.attributeInspector = this.initializeAttributeInspector();
            if (this.firstEditorInit) {
                var selectQuery = new Query();
                this.editLayer.on("click", lang.hitch(this, function (evt) {
                    var _this = this;
                    selectQuery.objectIds = [evt.graphic.attributes[this.config.polygonLayerFieldNames.objectId]];
                    this.editLayer.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW, function (features) {
                        if (features.length > 0) {
                            _this.updateFeature = features[0];
                            if (_this.updateFeature.attributes && _this.updateFeature.attributes[_this.config.polygonLayerFieldNames.title]) {
                                _this.attributeInspector.layerName.innerText = _this.updateFeature.attributes[_this.config.polygonLayerFieldNames.title];
                            }
                            else {
                                _this.attributeInspector.layerName.innerText = _this.nls.newFeature;
                            }
                        }
                        else {
                            _this.map.infoWindow.hide();
                        }
                    });
                }));
                this.map.infoWindow.on("hide", function (evt) {
                    _this.editLayer.clearSelection();
                });
            }
            this.firstEditorInit = false;
        };
        Widget.prototype.initializeEditToolbar = function () {
            var _this = this;
            var editToolbar = new Edit(this.map);
            editToolbar.on("deactivate", function (evt) {
                _this.editLayer.applyEdits(null, [evt.graphic], null);
            });
            return editToolbar;
        };
        Widget.prototype.initializeTemplatePicker = function () {
            var layers = [];
            layers.push(this.editLayer);
            var templatePicker = new TemplatePicker({
                featureLayers: layers,
                rows: "auto",
                columns: "auto",
                grouping: true,
                style: "height: auto; overflow: auto;"
            }, domConstruct.create("div"));
            domConstruct.place(templatePicker.domNode, this.config.templatePickerDiv, "only");
            templatePicker.startup();
            return templatePicker;
        };
        Widget.prototype.initializeDrawToolbar = function (templatePicker) {
            var _this = this;
            var drawToolbar = new Draw(this.map);
            var selectedTemplate;
            templatePicker.on("selection-change", function (evt) {
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
                _this.editToolbar.deactivate();
                var newAttributes = lang.mixin({}, selectedTemplate.template.prototype.attributes);
                var newGraphic = new Graphic(evt.geometry, null, newAttributes);
                selectedTemplate.featureLayer.applyEdits([newGraphic], null, null);
            });
            return drawToolbar;
        };
        Widget.prototype.initializeAttributeInspector = function () {
            var _this = this;
            var layerInfos = [
                {
                    'featureLayer': this.editLayer,
                    'showAttachments': true,
                    'showDeleteButton': true,
                    'isEditable': true
                }
            ];
            var attributeInspector = new AttributeInspector({
                layerInfos: layerInfos
            }, domConstruct.create("div"));
            domConstruct.place(attributeInspector.domNode, this.config.attributeInspectorDiv, "only");
            var saveButton = new Button({ label: this.nls.save, "class": "attributeInspectorSaveButton" }, domConstruct.create("div"));
            domConstruct.place(saveButton.domNode, attributeInspector.deleteBtn.domNode, "after");
            var editButton = new Button({ label: this.nls.edit, "class": "attributeInspectorEditButton" }, domConstruct.create("div"));
            domConstruct.place(editButton.domNode, attributeInspector.deleteBtn.domNode, "after");
            saveButton.on("click", function (evt) {
                var updateFeatureLayer = _this.updateFeature.getLayer();
                updateFeatureLayer.applyEdits(null, [_this.updateFeature], null);
                if (editingEnabled === true) {
                    _this.editToolbar.deactivate();
                    editingEnabled = false;
                }
            });
            var editingEnabled = false;
            editButton.on("click", lang.hitch(this, function (evt) {
                event.stop(evt);
                if (editingEnabled === false) {
                    editingEnabled = true;
                    var enabledFunctions = Edit.EDIT_VERTICES | Edit.MOVE | Edit.EDIT_VERTICES | Edit.SCALE | Edit.ROTATE | Edit.EDIT_TEXT;
                    this.editToolbar.activate(enabledFunctions, new Graphic(this.editLayer.getSelectedFeatures()[0].geometry));
                }
                else {
                    this.editToolbar.deactivate();
                    editingEnabled = false;
                }
            }));
            attributeInspector.on("attribute-change", function (evt) {
                _this.updateFeature.attributes[evt.fieldName] = evt.fieldValue;
            });
            attributeInspector.on("next", function (evt) {
                _this.updateFeature = evt.feature;
                console.log("Next " + _this.updateFeature.attributes.OBJECTID);
            });
            attributeInspector.on("delete", function (evt) {
                var updateFeatureLayer = _this.updateFeature.getLayer();
                updateFeatureLayer.applyEdits(null, null, [evt.feature]);
            });
            return attributeInspector;
        };
        return Widget;
    }(BaseWidget));
    return Widget;
});
//# sourceMappingURL=Widget.js.map