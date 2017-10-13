import BaseWidget = require("jimu/BaseWidget");
import WidgetManager = require("jimu/WidgetManager");
import PanelManager = require("jimu/PanelManager");
import lang = require("dojo/_base/lang");
import array = require("dojo/_base/array");
import event = require("dojo/_base/event");
import json = require('dojo/json');
import jsonQuery = require("dojox/json/query");
import dom = require("dojo/dom");
import domConstruct = require("dojo/dom-construct");
import domStyle = require("dojo/dom-style");
import domAttr = require("dojo/dom-attr");
import domGeometry = require("dojo/dom-geometry");
import domQuery = require("dojo/query");
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
  private selectedFeature: Graphic;
  private polygonLayer: FeatureLayer;

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-kauflandworkflow"}, args));
    if (this.config.generateBuffers!==true) {
      domStyle.set(this.generateBuffersContainer, "display", "none");
    }
    this.firstEditorInit = true;
    this.initGeoprocessor();

    // Initialize all widgets that are remote controlled by this one to be able to open them via the WidgetManager.
    let ws = WidgetManager.getInstance();
    this.config.remotelyControlling.map(remotelyControlledWidgetName => {
      this.fetchDataByName(remotelyControlledWidgetName);
      if (ws.getWidgetsByName(remotelyControlledWidgetName).length==0) {
        let remoteWidget = jsonQuery("$..widgets..[?name='" + remotelyControlledWidgetName + "']", this.appConfig);
        if (remoteWidget[0]) {
          ws.loadWidget(remoteWidget[0]).then(function(evt) {
            // activate buttons when widgets are loaded
            let buttonNodes = domQuery("input[type='button']");
            array.forEach(buttonNodes, function(buttonNode) {
              buttonNode.disabled = false;
            })
          });
        }
        else {
          console.warn("No appConfig entry found for widget named " + remotelyControlledWidgetName + ".", remoteWidget);
        }
      }
    });
  }

  startup() {
    console.log(this.manifest.name + ' startup', this.config, this.map);
  }

  postCreate() {
    console.log(this.manifest.name + ' postCreate', this.config);
  }

  onOpen() {
    console.log(this.manifest.name + ' onOpen');
  }

  onClose() {
    console.log(this.manifest.name + ' onClose');
    if (this.templatePicker) this.templatePicker.destroy();
    if (this.attributeInspector) this.attributeInspector.destroy();
    if (this.editToolbar) {
      this.editToolbar.deactivate();
      this.editToolbar = null;
    }
  }

  onMinimize() {
    console.log(this.manifest.name + ' onMinimize');
  }

  onMaximize() {
    console.log(this.manifest.name + ' onMaximize');
  }

  onSignIn(credential){
    /* jshint unused:false*/
    console.log(this.manifest.name + ' onSignIn');
  }

  onSignOut() {
    console.log(this.manifest.name + ' onSignOut');
  }
  
  onReceiveData(name, widgetId, data, historyData) {
    console.log(this.manifest.name + " received a '" + data.command + "' command from " + name + ".", widgetId, historyData);
    if (data.command=="generateBuffers" && data.valid) {
      var pointLayer = this.map.getLayer(this.config.pointLayerId) as FeatureLayer;
      var pointSelection = pointLayer.getSelectedFeatures();
      this.generateBufferAroundPointSelection(pointSelection);
      data.valid = false;
    }
    else if (data.command=="performAggregation" && data.valid && data.selectedFeature) {
      this.selectedFeature = data.selectedFeature;     
      let selectedFeatures= [];
      selectedFeatures.push(data.selectedFeature.graphic);
      let selectedFeatureSet = new FeatureSet();
      selectedFeatureSet.features = selectedFeatures;
      this.performAggregation(selectedFeatureSet);
      data.valid = false;
    }
  }

  initGeoprocessor() {
    this.geoprocessor = new Geoprocessor(this.config.geoprocessorUrl);
    this.geoprocessor.setOutSpatialReference({
      wkid: 102100
    } as SpatialReference);
    this.geoprocessor.on("execute-complete", lang.hitch(this, this.geoprocessorCallback));
  }

  geoprocessorCallback(evt) {
    // hide loader
    if (dom.byId("loadingIndicatorContainer")) {
      domStyle.set(dom.byId("loadingIndicatorContainer"), "display", "none");
    }
    if (dom.byId("loadingIndicatorText")) {
      domStyle.set(dom.byId("loadingIndicatorText"), "display", "none");
    }
    if (dom.byId("loadingIndicatorImage")) {
      domStyle.set(dom.byId("loadingIndicatorImage"), "display", "none");
    }

    let updateAttributes = {};
    if (evt && evt.results) {
      evt.results.forEach(result => {
        updateAttributes[result.paramName] = result.value;
        this.selectedFeature.graphic.attributes[result.paramName] = result.value;
      });
      updateAttributes[this.config.polygonLayerFieldNames.objectId] = this.selectedFeature.graphic.attributes[this.config.polygonLayerFieldNames.objectId];
      let updates = [{"attributes":updateAttributes}];
      this.publishData({
        command: "returnAggregatedData",
        updates: updates,
        selectedFeatureLayerId: this.selectedFeature.graphic._layer.id,
        valid: true
      });
    }
  }

  performAggregation(pFeatureSet) {
    if (pFeatureSet.features.length>0) {
      var params = {
        "Feature_Class": pFeatureSet
      };
      this.geoprocessor.execute(params);
    }

    // show loader
    if (dom.byId("loadingIndicatorContainer")) {
      domStyle.set(dom.byId("loadingIndicatorContainer"), "display", "block");
    }
    else {
      this.loadingIndicatorContainer = domConstruct.create("div", {
        id: "loadingIndicatorContainer"
      }, this.getPanel().domNode);
    }
    if (dom.byId("loadingIndicatorText")) {
      domStyle.set(dom.byId("loadingIndicatorText"), "display", "block");
    }
    else {
      this.loadingIndicatorText = domConstruct.create("div", {
        id: "loadingIndicatorText",
        innerHTML: this.nls.performingAggregation
      }, this.loadingIndicatorContainer);
    }
    if (dom.byId("loadingIndicatorImage")) {
      domStyle.set(dom.byId("loadingIndicatorImage"), "display", "block");
    }
    else {
      this.loadingIndicatorImage = domConstruct.create("img", {
        id: "loadingIndicator",
        src: "https://js.arcgis.com/3.21/esri/dijit/images/ajax-loader-segments-circle-64.gif"
      }, this.loadingIndicatorText, "first");
    }
  }

  checkPointSelection() {
    var pointLayer = this.map.getLayer(this.config.pointLayerId) as FeatureLayer;
    if (pointLayer) {
      var pointSelection = pointLayer.getSelectedFeatures();
  
      if (pointSelection.length==0) {
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
  }

  generateBufferAroundPointSelection(pointSelection: Graphic[]) {
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
    this.polygonLayer = this.map.getLayer(this.config.polygonLayerId) as FeatureLayer;
    if (this.polygonLayer) {
      this.publishData({
        command: "editPolygons",
        layer: this.polygonLayer
      });
    }
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
