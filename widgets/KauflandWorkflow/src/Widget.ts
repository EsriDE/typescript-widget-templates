import BaseWidget = require("jimu/BaseWidget");
import lang = require("dojo/_base/lang");
import array = require("dojo/_base/array");
import event = require("dojo/_base/event");
import json = require('dojo/_base/json');
import domConstruct = require("dojo/dom-construct");
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

class Widget extends BaseWidget {

  public baseClass: string = "jimu-widget-kauflandworkflow";
  public config: SpecificWidgetConfig;
  private updateFeature : Graphic;
  private subnode: HTMLElement;

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-kauflandworkflow"}, args));  // replaces "this.inherited(args)" from Esri tutorials
  }

  startup() {
    console.log('startup', this.config, this.map);
  }

  postCreate() {
    console.log('postCreate', this.config);
  }

  onOpen() {
    console.log('onOpen lala popo fifi mumu kaka');
  }

  onClose() {
    console.log('onClose');
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
    var graphicsToRemove = this.map.graphics.graphics.filter(function(graphic) {
        return graphic.attributes && graphic.attributes.category==="buffer";
    });
    graphicsToRemove.map(graphic => this.map.graphics.remove(graphic));
  }

  editPolygons() {
    var editLayer = this.map.getLayer(this.config.polygonLayerId) as FeatureLayer;

    var editToolbar = new Edit(this.map);
    editToolbar.on("deactivate", function(evt) {
      editLayer.applyEdits(null, [evt.graphic], null);
    });

    var editingEnabled = false;
    editLayer.on("dbl-click", function(evt) {
      event.stop(evt);
      if (editingEnabled === false) {
        editingEnabled = true;
        editToolbar.activate(Edit.EDIT_VERTICES , evt.graphic);
      } else {
        editLayer = this;
        editToolbar.deactivate();
        editingEnabled = false;
      }
    });

    this.initializeTemplatePicker(editLayer, editToolbar);
    
    let attributeInspector = this.initializeAttributeInspector(editLayer);

    var selectQuery = new Query();
    editLayer.on("click", lang.hitch(this, function(evt) {
      selectQuery.objectIds = [evt.graphic.attributes.objectid];
      editLayer.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW, lang.hitch(this, function(features) {
        if (features.length > 0) {
          this.updateFeature = features[0];
          this.map.infoWindow.setTitle(features[0].getLayer().name);
        }
        else {
          this.map.infoWindow.hide();
        }
      }));
    }));

    this.map.infoWindow.on("hide", function() {
      editLayer.clearSelection();
    });

  }

  initializeTemplatePicker(editLayer: FeatureLayer, editToolbar: Edit) {
    var layers = [];
    layers.push(editLayer);
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
    templatePicker.on("selection-change", function() {
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

    drawToolbar.on("draw-end", function(evt) {
      drawToolbar.deactivate();
      editToolbar.deactivate();
      var newAttributes = lang.mixin({}, selectedTemplate.template.prototype.attributes);
      var newGraphic = new Graphic(evt.geometry, null, newAttributes);
      selectedTemplate.featureLayer.applyEdits([newGraphic], null, null);
    });
  }

  initializeAttributeInspector(editLayer: FeatureLayer): AttributeInspector {
    var layerInfos = [
      {
        'featureLayer': editLayer,
        'showAttachments': true,
        'showDeleteButton': true,
        'isEditable': true
      }
    ];

    let attributeInspector = new AttributeInspector({
      layerInfos: layerInfos
    }, "attributeInspectorDiv");

    var saveButton = new Button({ label: "Save", "class": "attributeInspectorSaveButton"}, domConstruct.create("div"));
    domConstruct.place(saveButton.domNode, attributeInspector.deleteBtn.domNode, "after");

    saveButton.on("click", evt => {
      let updateFeatureLayer = this.updateFeature.getLayer() as FeatureLayer;
      updateFeatureLayer.applyEdits(null, [this.updateFeature], null);
    });

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
