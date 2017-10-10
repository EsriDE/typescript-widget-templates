import WidgetManager = require("jimu/WidgetManager");
import PanelManager = require("jimu/PanelManager");
import lang = require("dojo/_base/lang");
import html = require("dojo/_base/html");
import array = require("dojo/_base/array");
import FeatureLayer = require("esri/layers/FeatureLayer");
import EditWidget = require("./EditWidget");

class Widget extends EditWidget {

  private callingWidgetId: String;
  private editCompleteSignal;
  private editLayerId: String;
  private editLayerOptionIndex: Number;

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-edit"}, args));
    this.fetchDataByName(this.config.remoteControlledBy);
    console.log(this.widgetName + ' constructor');
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

  _addFilterEditor(settings) {
    super._addFilterEditor(settings);
    console.log(this.manifest.name + ' _addFilterEditor');
    
    // Find optionID of transmitted layerID
    array.forEach(this._filterEditor.selectDropDown.options, lang.hitch(this, function(option, i) {
      if (option.attributes[0].nodeValue===this.editLayerId) {
        this.editLayerOptionIndex = i;
      }
    })); 
    this._filterEditor.selectDropDown.selectedIndex = this.editLayerOptionIndex;
  }

  onReceiveData(name, widgetId, data, historyData) {
    console.log(this.manifest.name + " received a '" + data.command + "' command from " + name + " concerning polygon layer " + data.layer.id + ".", widgetId, historyData);
    this.callingWidgetId = widgetId;
    if (name===this.config.remoteControlledBy && data.command=="editPolygons") {
      // Save transmitted layerID
      this.editLayerId = data.layer.id;

      console.log("this Edit", this);
      //this._filterEditor.selectDropDown.set("", true)

/*       // uncheck other layers
      this.layerItems.map(layerItem => {
        if (layerItem.featureLayer!==data.layer) {
          html.removeClass(layerItem.selectableCheckBox, 'checked');
        }
      });
      // select layer
      this.selectDijit.setFeatureLayers([data.layer]);
      */

      // open RemoteEdit widget
      let ws = WidgetManager.getInstance();
      ws.triggerWidgetOpen(this.id);
 
      // after making the selection, return to original widget ("widgetId" parameter) and trigger buffer operation there
      this.editCompleteSignal = data.layer.on("selection-complete", lang.hitch(this, function(selection) {this.selectionCompleteBackToBuffer(selection, widgetId, ws);}));
    }
    else {
      console.log(this.manifest.name + " ignoring command.");
    }
  }

/*   selectionCompleteBackToBuffer(selection, callingWidgetId, ws) {
    if (selection.features.length > 0) {
      this.publishData({
          command: "generateBuffers",
          valid: true
      });
      console.log(ws.getAllWidgets());
      ws.triggerWidgetOpen(callingWidgetId);
      let ps = PanelManager.getInstance();
      ps.closePanel(this.id + "_panel");
      this.selectionCompleteSignal.remove();
    }
  } */

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
