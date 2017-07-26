import WidgetManager = require("jimu/WidgetManager");
import lang = require("dojo/_base/lang");
import html = require("dojo/_base/html");
import FeatureLayer = require("esri/layers/FeatureLayer");
import SelectWidget = require("./SelectWidget");

class Widget extends SelectWidget {

  private widgetName = "RemoteSelect";
  private callingWidgetId: String;
  private selectionCompleteEventHandler;

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
    console.log(this.widgetName + " received a '" + data.command + "' command from " + name + ".", widgetId, historyData);
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
      this.selectionCompleteEventHandler = this.selectionCompleteBackToBuffer;
      data.layer.on("selection-complete", lang.hitch(this, this.selectionCompleteEventHandler));
    }
  }

  selectionCompleteBackToBuffer(selection) {
    if (this.callingWidgetId) {
      if (selection.features.length > 0) {
        this.publishData({
            command: "generateBuffers"
        });
        let ws = WidgetManager.getInstance();
        ws.triggerWidgetOpen(this.callingWidgetId);
        this.selectionCompleteEventHandler = undefined; // DOES NOT REMOVE THE EVENT HANDLER
        // KRÜCKE: There is no way to remove the event handler, and it will trigger also when directly using the widget outside the workflow... 
        // It won't do anything without a callingWidgetId, but every time the RemoteSelect widget is opened, another event handler is added.. :(
        this.callingWidgetId = undefined;
      }
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
