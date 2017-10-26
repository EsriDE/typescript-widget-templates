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
import GeometryService = require("esri/tasks/GeometryService");
import AreasAndLengthsParameters = require("esri/tasks/AreasAndLengthsParameters");

class Widget extends BaseWidget {

  public baseClass: string = "jimu-widget-Workflow";
  public config: SpecificWidgetConfig;
  private editLayer: FeatureLayer;
  private selectedFeatureSet: FeatureSet;
  private updateFeature: Graphic;
  private attributeInspector: AttributeInspector;
  private editToolbar: Edit;
  private drawToolbar: Draw;
  private templatePicker: TemplatePicker;
  private geometryService: GeometryService;
  private subnode: HTMLElement;
  private firstEditorInit: Boolean;
  private loadingIndicatorContainer;
  private loadingIndicatorText;
  private loadingIndicatorImage;
  private selectedFeature: Graphic;
  private polygonLayer: FeatureLayer;

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-Workflow"}, args));
    if (this.config.generateBuffers!==true) {
      domStyle.set(this.generateBuffersContainer, "display", "none");
    }
    this.firstEditorInit = true;
    this.initGeometryService();
  }

  activateButtons(name: string) {
    // Activate buttons that contain the WidgetName as CSS class when widgets are loaded
    let buttonNodes = domQuery("input[type='button']." + name)
    array.forEach(buttonNodes, function(buttonNode) {
      buttonNode.disabled = false;
    })
  }

  startup() {
    console.log(this.manifest.name + ' startup', this.config, this.map);
  }

  postCreate() {
    console.log(this.manifest.name + ' postCreate', this.config);
  }

  onOpen() {
    console.log(this.manifest.name + ' onOpen');
    
    // Initialize all widgets that are remote controlled by this one to be able to open them via the WidgetManager.
    let ws = WidgetManager.getInstance();
    this.config.remotelyControlling.map(lang.hitch(this, function(remotelyControlledWidgetName){
      this.fetchDataByName(remotelyControlledWidgetName);
      if (ws.getWidgetsByName(remotelyControlledWidgetName).length==0) {
        let remoteWidget = jsonQuery("$..widgets..[?name='" + remotelyControlledWidgetName + "']", this.appConfig);
        if (remoteWidget[0]) {
          ws.loadWidget(remoteWidget[0]).then(lang.hitch(this, function(evt) {
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
      this.geometryAnalysis(selectedFeatureSet);
      data.valid = false;
    }
  }

  initGeometryService() {
    this.geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
    this.geometryService.on("areas-and-lengths-complete", lang.hitch(this, this.geometryCallback));
  }

  geometryCallback(evt) {
    // hide loader
    if (dom.byId("loadingIndicatorContainer"+this.label.replace(/ /g,''))) {
      domStyle.set(dom.byId("loadingIndicatorContainer"+this.label.replace(/ /g,'')), "display", "none");
    }
    if (dom.byId("loadingIndicatorText"+this.label.replace(/ /g,''))) {
      domStyle.set(dom.byId("loadingIndicatorText"+this.label.replace(/ /g,'')), "display", "none");
    }
    if (dom.byId("loadingIndicatorImage"+this.label.replace(/ /g,''))) {
      domStyle.set(dom.byId("loadingIndicatorImage"+this.label.replace(/ /g,'')), "display", "none");
    }

    let updateAttributes = {};
    if (evt && evt.result) {
      updateAttributes["area"] = evt.result.areas[0];
      updateAttributes["length"] = evt.result.lengths[0];
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

  geometryAnalysis(pFeatureSet) {
    if (pFeatureSet.features.length>0) {
      let areasAndLengthParams = new AreasAndLengthsParameters();
      areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_METERS;
      areasAndLengthParams.calculationType = "geodesic";
      areasAndLengthParams.lengthUnit = GeometryService.UNIT_METER;

      let poly = new Polygon(pFeatureSet.features[0].geometry.spatialReference);
      poly.addRing(pFeatureSet.features[0].geometry.rings[0])
      areasAndLengthParams.polygons = [poly];

      this.geometryService.areasAndLengths(areasAndLengthParams);
    }

    // show loader
    if (dom.byId("loadingIndicatorContainer"+this.label.replace(/ /g,''))) {
      domStyle.set(dom.byId("loadingIndicatorContainer"+this.label.replace(/ /g,'')), "display", "block");
    }
    else {
      this.loadingIndicatorContainer = domConstruct.create("div", {
        id: "loadingIndicatorContainer"+this.label.replace(/ /g,''),
        class: "loadingIndicatorContainer"
      }, this.getPanel().domNode);
    }
    if (dom.byId("loadingIndicatorText"+this.label.replace(/ /g,''))) {
      domStyle.set(dom.byId("loadingIndicatorText"+this.label.replace(/ /g,'')), "display", "block");
    }
    else {
      this.loadingIndicatorText = domConstruct.create("div", {
        id: "loadingIndicatorText"+this.label.replace(/ /g,''),
        class: "loadingIndicatorText",
        innerHTML: this.nls.performingAggregation
      }, dom.byId("loadingIndicatorContainer"+this.label.replace(/ /g,''));
    }
    if (dom.byId("loadingIndicatorImage"+this.label.replace(/ /g,''))) {
      domStyle.set(dom.byId("loadingIndicatorImage"+this.label.replace(/ /g,'')), "display", "block");
    }
    else {
      this.loadingIndicatorImage = domConstruct.create("img", {
        id: "loadingIndicator"+this.label.replace(/ /g,''),
        class: "loadingIndicator",
        src: "https://js.arcgis.com/3.21/esri/dijit/images/ajax-loader-segments-circle-64.gif"
      }, dom.byId("loadingIndicatorText"+this.label.replace(/ /g,'')), "first");
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
