import BaseWidget = require("jimu/BaseWidget");
import lang = require("dojo/_base/lang");
import array = require("dojo/_base/array");
import event = require("dojo/_base/event");
import json = require('dojo/_base/json');
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

class Widget extends BaseWidget {

  public baseClass: string = "jimu-widget-kauflandworkflow";
  public config: SpecificWidgetConfig;

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
    var pointBuffersSimplified = pointBuffers.map(buffer => geometryEngine.generalize(buffer, 500));

    var symbol = new SimpleFillSymbol();
    symbol.setColor(new Color([100,100,100,0.25]));
    symbol.setOutline(new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color('#000'), 
            1
          ));

    // add buffers to map default graphic layer with attributes from original points
    pointBuffersSimplified.map(
      (pointBuffer, pointIndex) => this.map.graphics.add(new Graphic(pointBuffer,symbol,{
        "title": pointSelection[pointIndex].attributes.title,
        "pointidentifier": pointSelection[pointIndex].attributes.pointidentifier,
        "category": "buffer"
      }))
    );
    //console.log('map.graphics', this.map.graphics);
  }

  resetBuffers() {
    var graphicsToRemove = this.map.graphics.graphics.filter(function(graphic) {
        return graphic.attributes && graphic.attributes.category==="buffer";
    });
    graphicsToRemove.map(graphic => this.map.graphics.remove(graphic));
  }

/*  storeBuffers() {
    var polygonLayer = this.map.getLayer(this.config.polygonLayerId) as FeatureLayer;
    var graphicsToAdd = this.map.graphics.graphics.filter(function(graphic) {
        return graphic.attributes && graphic.attributes.category==="buffer";
    });
    if (graphicsToAdd.length>0) {
      polygonLayer.applyEdits(graphicsToAdd);
      this.resetBuffers();
    }
    this.initEditing(polygonLayer);
  }*/

  editPolygons() {
    var layer = this.map.getLayer(this.config.polygonLayerId) as FeatureLayer;

    var editToolbar = new Edit(this.map);
    editToolbar.on("deactivate", function(evt) {
      layer.applyEdits(null, [evt.graphic], null);
    });

    var editingEnabled = false;
    layer.on("dbl-click", function(evt) {
      event.stop(evt);
      if (editingEnabled === false) {
        editingEnabled = true;
        editToolbar.activate(Edit.EDIT_VERTICES , evt.graphic);
      } else {
        layer = this;
        editToolbar.deactivate();
        editingEnabled = false;
      }
    });

    layer.on("click", function(evt) {
      event.stop(evt);
      if (evt.ctrlKey === true || evt.metaKey === true) {  //delete feature if ctrl key is depressed
        layer.applyEdits(null,null,[evt.graphic]);
        layer = this;
        editToolbar.deactivate();
        editingEnabled=false;
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
