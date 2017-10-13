import WidgetManager = require("jimu/WidgetManager");
import PanelManager = require("jimu/PanelManager");
import lang = require("dojo/_base/lang");
import html = require("dojo/_base/html");
import array = require("dojo/_base/array");
import esriRequest = require("esri/request");
import FeatureLayer = require("esri/layers/FeatureLayer");
import EditWidget = require("./EditWidget");

class Widget extends EditWidget {

  private callingWidgetId: String;
  private editLayerId: String;
  private editLayerOptionIndex: Number;

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-edit"}, args));
    this.fetchDataByName(this.config.remoteControlledBy);
    console.log(this.manifest.name + ' constructor');
  }

  startup() {
    super.startup();
    console.log(this.manifest.name + ' startup', this.config, this.map);
  }

  postCreate() {
    super.postCreate();
    console.log(this.manifest.name + ' postCreate', this.config);
  }

  onOpen() {
    super.onOpen();
    console.log(this.manifest.name + ' onOpen');
  }

  onClose() {
    super.onClose();
    this.editLayerId = undefined;
    console.log(this.manifest.name + ' onClose');
  }

  onMinimize() {
    super.onMinimize();
    console.log(this.manifest.name + ' onMinimize');
  }

  onMaximize() {
    super.onMaximize();
    console.log(this.manifest.name + ' onMaximize');
  }

  onSignIn(credential){
    super.onSignIn();
    /* jshint unused:false*/
    console.log(this.manifest.name + ' onSignIn');
  }

  onSignOut() {
    super.onSignOut();
    console.log(this.manifest.name + ' onSignOut');
  }

  _bindEventsAfterCreate(settings) {
    super._bindEventsAfterCreate(settings);

    // "deactivate" fires after switching or leaving the edit mode. Works after drawing new features, cut, generally: after editing attributes.
    this.editor.editToolbar.on('deactivate', lang.hitch(this, this.performAggregation));

/*     // no "deacivate" or any other event after reshape => wait for http call and aggregate then
    esriRequest.setRequestPreCallback(lang.hitch(this, function(evt) {
      if (evt.url.includes("reshape")) {
        this.performAggregation(evt);
      }
    })); */
  }

  performAggregation(selectedFeature) {
    this.publishData({
      command: "performAggregation",
      selectedFeature: selectedFeature,
      valid: true
    });
  }

  _addFilterEditor(settings) {
    super._addFilterEditor(settings);
    console.log(this.manifest.name + ' _addFilterEditor');
    
    if (this.editLayerId !== undefined) {
      // Find optionID of transmitted layerID
      array.forEach(this._filterEditor.selectDropDown.options, lang.hitch(this, function(option, i) {
        if (option.attributes[0].nodeValue===this.editLayerId) {
          this.editLayerOptionIndex = i;
        }
      })); 
      this._filterEditor.selectDropDown.selectedIndex = this.editLayerOptionIndex;
      this._filterEditor._onLayerFilterChanged();
    }
  }

  onReceiveData(name, widgetId, data, historyData) {
    console.log(this.manifest.name + " received a '" + data.command + "' command from " + name + ".", widgetId, historyData);
    this.callingWidgetId = widgetId;
    if (name===this.config.remoteControlledBy && data.command=="editPolygons" && data.layer) {
      console.log("Command concerns polygon layer " + data.layer.id + ".", widgetId, historyData);
      // Save transmitted layerID
      this.editLayerId = data.layer.id;

      // open RemoteEdit widget
      let ws = WidgetManager.getInstance();
      ws.triggerWidgetOpen(this.id);
    }
    else if (name===this.config.remoteControlledBy && data.command=="returnAggregatedData" && data.updates) {
      console.log("Command concerns update " , data.updates);

      let selectedFeatureLayer = this.map.getLayer(data.selectedFeatureLayerId) as FeatureLayer;
      selectedFeatureLayer.applyEdits(null, data.updates).then(value => {
        this.editor.attributeInspector.refresh();
      }); 

    }
    else {
      console.log(this.manifest.name + " ignoring command.");
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
