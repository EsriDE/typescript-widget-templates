import WidgetManager = require("jimu/WidgetManager");
import PanelManager = require("jimu/PanelManager");
import lang = require("dojo/_base/lang");
import html = require("dojo/_base/html");
import dom = require("dojo/dom");
import domConstruct = require("dojo/dom-construct");
import domStyle = require("dojo/dom-style");
import esriRequest = require("esri/request");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Graphic = require("esri/graphic");
import Map = require("esri/map");
import EditWidget = require("./EditWidget");

class Widget extends EditWidget {

  private callingWidgetId: String;
  private editLayerId: String | undefined;
  private editLayerOptionIndex: Number;
  private editor: any;
  private manifest: any;
  private config: any;
  private nls: any;
  private map: Map;
  private id: string;
  private _filterEditor: any;
  private warningMessageNode: HTMLElement;

  constructor(args?: Array<any>) {
    super(lang.mixin({baseClass: "jimu-widget-edit"}, args));
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

  onSignIn(credential: any){
    super.onSignIn();
    /* jshint unused:false*/
    console.log(this.manifest.name + ' onSignIn');
  }

  onSignOut() {
    super.onSignOut();
    console.log(this.manifest.name + ' onSignOut');
  }

  _bindEventsAfterCreate(settings: any) {
    super._bindEventsAfterCreate(settings);

    // "deactivate" fires after switching or leaving the edit mode. Works after drawing new features, cut, generally: after editing attributes.
    this.editor.editToolbar.on('deactivate', (evt: EditDeactivateEvtObject) => this.performAggregation(evt));

    // warn that features need to be re-aggregated manually 
    esriRequest.setRequestPreCallback( (evt: any ) => {
      if (evt.url.endsWith("/reshape") || evt.url.endsWith("/cut")) {

        let templatePickerNode = document.getElementsByClassName("templatePicker")[0];

        if (dom.byId("warningMessage")) {
          domStyle.set(dom.byId("warningMessage"), "visibility", "visible");
        }
        else {
          this.warningMessageNode = domConstruct.create("div", {
            id: "warningMessage",
            innerHTML: this.nls.warnReAggregateFeatures,
            style: "background-color: #f00;padding: 3px;margin-bottom: 15px;position: absolute;top: 260px;"
          }, templatePickerNode.id, "after");
        }
        
      }
      return evt; 
    });
  }

  performAggregation(selectedFeature: EditDeactivateEvtObject) {
    super.publishData({
      command: "performAggregation",
      selectedFeature: selectedFeature,
      valid: true
    });
  }

  _addFilterEditor(settings: any) {
    super._addFilterEditor(settings);
    console.log(this.manifest.name + ' _addFilterEditor');
    
    if (this.editLayerId !== undefined) {
      // Find optionID of transmitted layerID
      let optionsArray = Array.from(this._filterEditor.selectDropDown.options);
      optionsArray.forEach((option: HTMLOptionElement, i: number) => {
        if (option.attributes[0].nodeValue===this.editLayerId) {
          this.editLayerOptionIndex = i;
        }
      });

      //this._filterEditor.selectDropDown.options.map();

      this._filterEditor.selectDropDown.selectedIndex = this.editLayerOptionIndex;
      this._filterEditor._onLayerFilterChanged();
    }
  }

  onReceiveData(name: String, widgetId: String, data: any, historyData: any) {
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
      if (dom.byId("warningMessage")) {
        domStyle.set(dom.byId("warningMessage"), "visibility", "hidden");
      }
      let selectedFeatureLayer = this.map.getLayer(data.selectedFeatureLayerId) as FeatureLayer;
      selectedFeatureLayer.applyEdits(undefined, data.updates).then( (value: any) => {
        this.editor.attributeInspector.refresh();
      }); 
    }
    else {
      console.log(this.manifest.name + " ignoring command.");
    }
  }
}

interface EditDeactivateEvtObject {
  graphic: Graphic;
}

export = Widget;
