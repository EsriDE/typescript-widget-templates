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

class Widget extends BaseWidget {

  public baseClass: string = "jimu-widget-kauflandworkflow";
  public config: SpecificWidgetConfig;

  private subnode: HTMLElement;

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-kauflandworkflow"}, args));  // replaces "this.inherited(args)" from Esri tutorials
  }

  startup() {
    console.log('startup', this.config, this.map);
    this.map.on("update-end", this.initEditing);
  }

  postCreate() {
    console.log('postCreate', this.config);
  }

  onOpen() {
    console.log('onOpen');
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
    //console.log('map.graphics', this.map.graphics);
  }

  resetBuffers() {
    var graphicsToRemove = this.map.graphics.graphics.filter(function(graphic) {
        return graphic.attributes && graphic.attributes.category==="buffer";
    });
    graphicsToRemove.map(graphic => this.map.graphics.remove(graphic));
  }

  storeBuffers() {
    var polygonLayer = this.map.getLayer(this.config.polygonLayerId) as FeatureLayer;
    var graphicsToAdd = this.map.graphics.graphics.filter(function(graphic) {
        return graphic.attributes && graphic.attributes.category==="buffer";
    });
    polygonLayer.applyEdits(graphicsToAdd);
    this.resetBuffers();
  }



  initEditing(evt) {
    console.log("initEditing", evt);
    // var map = this;
    var currentLayer = null;

    var layers = evt.layers.map(result => result.layer);
    console.log("layers", layers);

    var editToolbar = new Edit(this.map);
    editToolbar.on("deactivate", function(evt) {
      currentLayer.applyEdits(null, [evt.graphic], null);
    });

    layers.map(function(layer) {
      var editingEnabled = false;
      layer.on("dbl-click", function(evt) {
        event.stop(evt);
        if (editingEnabled === false) {
          editingEnabled = true;
          editToolbar.activate(Edit.EDIT_VERTICES , evt.graphic);
        } else {
          currentLayer = this;
          editToolbar.deactivate();
          editingEnabled = false;
        }
      });

      layer.on("click", function(evt) {
        event.stop(evt);
        if (evt.ctrlKey === true || evt.metaKey === true) {  //delete feature if ctrl key is depressed
          layer.applyEdits(null,null,[evt.graphic]);
          currentLayer = this;
          editToolbar.deactivate();
          editingEnabled=false;
        }
      });
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
