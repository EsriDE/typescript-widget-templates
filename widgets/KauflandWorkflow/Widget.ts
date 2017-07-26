import BaseWidget = require("jimu/BaseWidget");
import lang = require("dojo/_base/lang");
import array = require("dojo/_base/array");
import event = require("dojo/_base/event");
import json = require('dojo/_base/json');
import domConstruct = require("dojo/dom-construct");
import domStyle = require("dojo/dom-style");
import domAttr = require("dojo/dom-attr");
import domGeometry = require("dojo/dom-geometry");
import Button = require("dijit/form/Button");
import FeatureLayer = require("esri/layers/FeatureLayer");
import geometryEngine = require("esri/geometry/geometryEngine");
import Graphic = require("esri/graphic");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import Color = require("esri/Color");
import Polygon = require("esri/geometry/Polygon");
import Edit = require("esri/toolbars/edit");
import Draw = require("esri/toolbars/draw");
import TemplatePicker = require("esri/dijit/editing/TemplatePicker");
import AttributeInspector = require("esri/dijit/AttributeInspector");
import Query = require("esri/tasks/query");
import Point = require("esri/geometry/Point");
import InfoTemplate = require("esri/InfoTemplate");
import Geoprocessor = require("esri/tasks/Geoprocessor");
import SpatialReference = require("esri/SpatialReference");
import FeatureSet = require("esri/tasks/FeatureSet");

class Widget extends BaseWidget {

  public baseClass: string = "jimu-widget-kauflandworkflow";
  public config: SpecificWidgetConfig;
  private editLayer: FeatureLayer;
  private selectedFeatureSet: FeatureSet;
  private updateFeature: Graphic;
  private attributeInspector: AttributeInspector;
  private editToolbar: Edit;
  private drawToolbar: Draw;
  private templatePicker: TemplatePicker;
  private geoprocessor: Geoprocessor;
  private subnode: HTMLElement;
  private firstEditorInit: Boolean;
  private loadingIndicatorContainer;
  private loadingIndicatorText;
  private loadingIndicatorImage;

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-kauflandworkflow"}, args));  // replaces "this.inherited(args)" from Esri tutorials
    if (this.config.generateBuffers!==true) {
      domStyle.set(this.generateBuffersContainer, "display", "none");
    }
    this.firstEditorInit = true;
    this.initGeoprocessor();
  }

  startup() {
    console.log('startup', this.config, this.map);
  }

  postCreate() {
    console.log('postCreate', this.config);
  }

  onOpen() {
    console.log('onOpen');
    this.editPolygons();
    if (this.editLayer) {
      let selectedFeatures = this.editLayer.getSelectedFeatures();
    }
  }

  onClose() {
    console.log('onClose');
    if (this.templatePicker) this.templatePicker.destroy();
    if (this.attributeInspector) this.attributeInspector.destroy();
    if (this.editToolbar) {
      this.editToolbar.deactivate();
      this.editToolbar = null;
    }
    this.editLayer.setSelectionSymbol(undefined);
    this.editLayer.clearSelection();
    this.editLayer.refresh();
  }

  onMinimize() {
    console.log('onMinimize');
  }

  onMaximize() {
    console.log('onMaximize');
  }

  onSignIn(credential){
    /* jshint unused:false*/
    console.log('onSignIn');
  }

  onSignOut() {
    console.log('onSignOut');
  }

  initGeoprocessor() {
    this.geoprocessor = new Geoprocessor(this.config.geoprocessorUrl);
    this.geoprocessor.setOutSpatialReference({
      wkid: 102100
    } as SpatialReference);
    this.geoprocessor.on("execute-complete", lang.hitch(this, function(evt) {
      let updateAttributes = {};
      evt.results.forEach(result => {
        updateAttributes[result.paramName] = result.value;
      });
      updateAttributes[this.config.polygonLayerFieldNames.objectId] = this.editLayer.getSelectedFeatures()[0].attributes[this.config.polygonLayerFieldNames.objectId];
      let updates = [{"attributes":updateAttributes}];
      this.editLayer.applyEdits(null, updates).then(value => {
        this.attributeInspector.refresh();
      }); 
      // hide loader
      domConstruct.destroy(this.loadingIndicatorContainer);
      domConstruct.destroy(this.loadingIndicatorText);
      domConstruct.destroy(this.loadingIndicatorImage);
    }));
  }

  performAggregation() {
    var paramsFeatureSet = new FeatureSet();
    paramsFeatureSet.features = this.editLayer.getSelectedFeatures();
    if (paramsFeatureSet.features.length>0) {
      var params = {
        "Feature_Class": paramsFeatureSet
      };
      this.geoprocessor.execute(params);
    }

    // show loader
    this.loadingIndicatorContainer = domConstruct.create("div", {
      id: "loadingIndicatorContainer"
    }, this.getPanel().domNode);
    this.loadingIndicatorText = domConstruct.create("div", {
      id: "loadingIndicatorText",
      innerHTML: this.nls.performingAggregation
    }, this.loadingIndicatorContainer);
    this.loadingIndicatorImage = domConstruct.create("img", {
      id: "loadingIndicator",
      src: "https://js.arcgis.com/3.21/esri/dijit/images/ajax-loader-segments-circle-64.gif"
    }, this.loadingIndicatorText, "first");
  }

  generateBufferAroundPointSelection() {
    var pointLayer = this.map.getLayer(this.config.pointLayerId) as FeatureLayer;
    var pointSelection = pointLayer.getSelectedFeatures();

    var pointGeometries = pointSelection.map(
      currentValue => currentValue.geometry
    )
    var pointBuffers = geometryEngine.geodesicBuffer(pointGeometries, this.bufferRadiusMeters.value, "meters") as Polygon[];

    var symbol = new SimpleFillSymbol();
    symbol.setColor(new Color([100,100,100,0.25]));
    symbol.setOutline(new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color('#000'), 
            1
          ));

    // add buffers to map default graphic layer with attributes from original points
    pointBuffers.map(
      (pointBuffer, pointIndex) => this.map.graphics.add(new Graphic(pointBuffer,symbol,{
        "title": pointSelection[pointIndex].attributes.title,
        "pointidentifier": pointSelection[pointIndex].attributes.pointidentifier,
        "category": "buffer"
      }))
    );
  }

  resetBuffers() {
    var graphicsToRemove = this.map.graphics.graphics.filter(graphic => {
        return graphic.attributes && graphic.attributes.category==="buffer";
    });
    graphicsToRemove.map(graphic => this.map.graphics.remove(graphic));
  }

  editPolygons() {
    this.editLayer = this.map.getLayer(this.config.polygonLayerId) as FeatureLayer;

    // put editLayer on top
    this.map.reorderLayer(this.editLayer, this.map.getLayersVisibleAtScale().length-1);

    let selectionSymbol = new SimpleFillSymbol();
    selectionSymbol.setColor(new Color([0,255,255,77]));
    selectionSymbol.setOutline(new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([0,255,255,255]), 
            1
          ));
    this.editLayer.setSelectionSymbol(selectionSymbol);

    this.editToolbar = this.initializeEditToolbar();
    if (this.config.templatePicker===true) {
      this.templatePicker = this.initializeTemplatePicker();
      this.drawToolbar = this.initializeDrawToolbar(this.templatePicker);
    }
    this.attributeInspector = this.initializeAttributeInspector();

    if (this.firstEditorInit) { // only add layer and map events once per widget instance
      var selectQuery = new Query();
      this.editLayer.on("click", lang.hitch(this, function(evt) {
        selectQuery.objectIds = [evt.graphic.attributes[this.config.polygonLayerFieldNames.objectId]];
        selectQuery.distance = 200;
        selectQuery.units = "meters";
        this.editLayer.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW, features => {
          if (features.length > 0) {
            this.updateFeature = features[0];
            if (this.updateFeature.attributes && this.updateFeature.attributes[this.config.polygonLayerFieldNames.title]) {
              this.attributeInspector.layerName.innerText = this.updateFeature.attributes[this.config.polygonLayerFieldNames.title];
            }
            else {
              this.attributeInspector.layerName.innerText = this.nls.newFeature;
            }
          }
          else {
            this.map.infoWindow.hide();
          }
        });
      }));

      this.map.infoWindow.on("hide", evt => {
        this.editLayer.clearSelection();
      });
    }

    this.firstEditorInit = false;
  }

  initializeEditToolbar(): Edit {
    let editToolbar = new Edit(this.map);
    return editToolbar;
  }

  initializeTemplatePicker(): TemplatePicker {
    var layers = [];
    layers.push(this.editLayer);
    let templatePicker = new TemplatePicker({
      featureLayers: layers,
      rows: "auto",
      columns: "auto",
      grouping: true,
      style: "height: auto; overflow: auto;"
    }, domConstruct.create("div"));
    domConstruct.place(templatePicker.domNode, this.config.templatePickerDiv, "only");

    templatePicker.startup();
    return templatePicker;
  }

  initializeDrawToolbar(templatePicker: TemplatePicker): Draw {
    let drawToolbar = new Draw(this.map);

    var selectedTemplate;
    templatePicker.on("selection-change", evt => {
      if( templatePicker.getSelected() ) {
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

    drawToolbar.on("draw-end", evt => {
      drawToolbar.deactivate();
      this.editToolbar.deactivate();
      var newAttributes = lang.mixin({}, selectedTemplate.template.prototype.attributes);
      var newGraphic = new Graphic(evt.geometry, null, newAttributes);
      selectedTemplate.featureLayer.applyEdits([newGraphic], null, null);
    });

    return drawToolbar;
  }

  initializeAttributeInspector(): AttributeInspector {
    var layerInfos = [
      {
        featureLayer: this.editLayer,
        showAttachments: true,
        showDeleteButton: true,
        isEditable: true,
        fieldInfos: this.config.polygonLayerAttributeInspectorFields
      }
    ];

    let attributeInspector = new AttributeInspector({
      layerInfos: layerInfos
    }, domConstruct.create("div"));
    domConstruct.place(attributeInspector.domNode, this.config.attributeInspectorDiv, "only");

    var saveButton = new Button({ label: this.nls.save, "class": "attributeInspectorSaveButton"}, domConstruct.create("div"));
    domConstruct.place(saveButton.domNode, attributeInspector.deleteBtn.domNode, "after");

    var editButton = new Button({ label: this.nls.edit, "class": "attributeInspectorEditButton"}, domConstruct.create("div"));
    domConstruct.place(editButton.domNode, attributeInspector.deleteBtn.domNode, "after");

    saveButton.on("click", evt => {
      this.performAggregation();
      let updateFeatureLayer = this.updateFeature.getLayer() as FeatureLayer;
      updateFeatureLayer.applyEdits(null, [this.updateFeature], null);
      if (editingEnabled === true) {
        this.editToolbar.deactivate();
        editingEnabled = false;
      }
    });

    let editingEnabled = false;
    editButton.on("click", lang.hitch(this, function(evt) {
      event.stop(evt);
      if (editingEnabled === false) {
        editingEnabled = true;
        let enabledFunctions = Edit.EDIT_VERTICES | Edit.MOVE | Edit.EDIT_VERTICES | Edit.SCALE | Edit.ROTATE | Edit.EDIT_TEXT;
        this.editToolbar.activate(enabledFunctions, new Graphic(this.editLayer.getSelectedFeatures()[0].geometry));
      } else {
        this.editToolbar.deactivate();
        editingEnabled = false;
      }
    }));

    attributeInspector.on("attribute-change", evt => {
      this.updateFeature.attributes[evt.fieldName] = evt.fieldValue;
    });

    attributeInspector.on("next",  evt => {
      this.updateFeature = evt.feature;
      console.log("Next " + this.updateFeature.attributes.OBJECTID);
    });

    attributeInspector.on("delete",  evt => {
      let updateFeatureLayer = this.updateFeature.getLayer() as FeatureLayer;
      updateFeatureLayer.applyEdits(null, null, [evt.feature]);
    });
    
    return attributeInspector;
  }

}

interface SpecificWidgetConfig{
  value: string;
  elements: Item[];
}

interface Item{
  name: string;
  href: string;
}

export = Widget;
