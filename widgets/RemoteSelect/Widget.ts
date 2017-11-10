import WidgetManager = require("jimu/WidgetManager");
import PanelManager = require("jimu/PanelManager");
import lang = require("dojo/_base/lang");
import domClass = require("dojo/dom-class");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Graphic = require("esri/graphic");
import Map = require("esri/map");
import SelectableLayerItem = require("./SelectableLayerItem");
import SelectWidget = require("./SelectWidget");

class Widget extends SelectWidget {

  private config: any;
  private manifest: any;
  private map: Map;
  private id: string;
  private callingWidgetId: String;
  private selectionCompleteSignal: any;
  private layerItems: Array<SelectableLayerItem>;
  private selectDijit: HTMLSelectElement;

  constructor(args?: Array<any>) {
    super(lang.mixin({baseClass: "jimu-widget-select"}, args));
    super.fetchDataByName(this.config.remoteControlledBy);
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

  onSignIn(credential: any){
    super.onSignIn();
    /* jshint unused:false*/
    console.log(this.manifest.name + ' onSignIn');
  }

  onSignOut() {
    super.onSignOut();
    console.log(this.manifest.name + ' onSignOut');
  }

  onReceiveData(name: string, widgetId: string, data: any, historyData: any) {
    console.log(this.manifest.name + " received a '" + data.command + "' command from " + name + ".", widgetId, historyData);
    this.callingWidgetId = widgetId;
    if (name===this.config.remoteControlledBy && data.command==="selectBufferPoint" && data.layer) {
      console.log("Command concerns point layer " + data.layer.name + ".");
      // uncheck other layers
      this.layerItems.map(layerItem => {
        if (layerItem.featureLayer!==data.layer) {
          domClass.remove(layerItem.selectableCheckBox, 'checked');
        }
      });
      // select layer
      this.selectDijit.setFeatureLayers([data.layer]);
      // open RemoteSelect widget
      let ws: WidgetManager = WidgetManager.getInstance();
      ws.triggerWidgetOpen(this.id);
      // after making the selection, return to original widget ("widgetId" parameter) and trigger buffer operation there
      this.selectionCompleteSignal = data.layer.on("selection-complete", (selection: FeatureLayerSelectionCompleteEvt) => {
        this.selectionCompleteBackToBuffer(selection, widgetId, ws);
      });
    }
    else {
      console.log(this.manifest.name + " ignoring command.");
    }
  }

  selectionCompleteBackToBuffer(selection: FeatureLayerSelectionCompleteEvt, callingWidgetId: string, ws: WidgetManager) {
    if (selection.features.length > 0) {
      super.publishData({
          command: "generateBuffers",
          valid: true
      });
      console.log(ws.getAllWidgets());
      ws.triggerWidgetOpen(callingWidgetId);
      let ps = PanelManager.getInstance();
      ps.closePanel(this.id + "_panel");
      this.selectionCompleteSignal.remove();
    }
  }

}

interface FeatureLayerSelectionCompleteEvt {
  features: Graphic[],
  method: Number
}

export = Widget;
