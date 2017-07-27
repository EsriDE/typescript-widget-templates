import WidgetManager = require("jimu/WidgetManager");
import lang = require("dojo/_base/lang");
import html = require("dojo/_base/html");
import FeatureLayer = require("esri/layers/FeatureLayer");
import SelectWidget = require("./SelectWidget");

class Widget extends SelectWidget {

  private callingWidgetId: String;
  private selectionCompleteSignal;

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-select"}, args));  // replaces "this.inherited(args)" from Esri tutorials
    this.fetchDataByName(this.config.remoteControlledBy);
    console.log(this.widgetName + ' constructor');
  }

  startup() {
    super.startup();
    console.log(this.widgetName + ' startup', this.config, this.map);
  }

  postCreate() {
    super.postCreate();
    console.log(this.widgetName + ' postCreate', this.config);
  }

  onOpen() {
    super.onOpen();
    console.log(this.widgetName + ' onOpen');
  }

  onClose() {
    super.onClose();
    console.log(this.widgetName + ' onClose');
  }

  onMinimize() {
    super.onMinimize();
    console.log(this.widgetName + ' onMinimize');
  }

  onMaximize() {
    super.onMaximize();
    console.log(this.widgetName + ' onMaximize');
  }

  onSignIn(credential){
    super.onSignIn();
    /* jshint unused:false*/
    console.log(this.widgetName + ' onSignIn');
  }

  onSignOut() {
    super.onSignOut();
    console.log(this.widgetName + ' onSignOut');
  }

  onReceiveData(name, widgetId, data, historyData) {
    console.log(this.manifest.name + " received a '" + data.command + "' command from " + name + ".", widgetId, historyData);
    this.callingWidgetId = widgetId;
    if (data.command=="selectBufferPoint") {
      // uncheck other layers
      this.layerItems.map(layerItem => {
        if (layerItem.featureLayer!==data.layer) {
          html.removeClass(layerItem.selectableCheckBox, 'checked');
        }
      });
      // select layer
      this.selectDijit.setFeatureLayers([data.layer]);
      // open RemoteSelect widget
      let ws = WidgetManager.getInstance();
      ws.triggerWidgetOpen(this.id);
      // after making the selection, return to original widget ("widgetId" parameter) and trigger buffer operation there
      this.selectionCompleteSignal = data.layer.on("selection-complete", lang.hitch(this, function(selection) {this.selectionCompleteBackToBuffer(selection, widgetId, ws);}));
    }
  }

  selectionCompleteBackToBuffer(selection, callingWidgetId, ws) {
    if (selection.features.length > 0) {
      this.publishData({
          command: "generateBuffers",
          valid: true
      });
      ws.triggerWidgetOpen(callingWidgetId);
      this.selectionCompleteSignal.remove();
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
