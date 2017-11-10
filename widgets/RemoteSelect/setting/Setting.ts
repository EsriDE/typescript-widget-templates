import Map = require("esri/map");
import lang = require("dojo/_base/lang");
import dom = require("dojo/dom");
import domConstruct = require("dojo/dom-construct");
import SelectSetting = require("./SelectSetting");

class Setting extends SelectSetting {

  private manifest: any;
  private config: any;
  private nls: any;
  private map: Map;
  private widgetSettingNode: HTMLDivElement;
  private exportCheckBoxDiv: HTMLDivElement;
  private remoteControlledBy: HTMLInputElement;

  constructor(args?: Array<any>) {
    super(lang.mixin({baseClass: "jimu-widget-select-setting"}, args));
    console.log("Setting Page for " + this.manifest.name + ' constructor.', this.config);
  }

  startup() {
    console.log("Setting Page for " + this.manifest.name + ' startup', this.config, this.map);
    super.startup();
  }

  postCreate() {
    console.log("Setting Page for " + this.manifest.name + ' postCreate', this.config);
    super.postCreate();
  }

  onOpen() {
    console.log("Setting Page for " + this.manifest.name + ' onOpen');
    super.onOpen();
  }

  onClose() {
    console.log("Setting Page for " + this.manifest.name + ' onClose');
    super.onClose();
  }

  onMinimize() {
    console.log("Setting Page for " + this.manifest.name + ' onMinimize');
    super.onMinimize();
  }

  onMaximize() {
    console.log("Setting Page for " + this.manifest.name + ' onMaximize');
    super.onMaximize();
  }

  onSignIn(credential: any){
    /* jshint unused:false*/
    console.log("Setting Page for " + this.manifest.name + ' onSignIn');
    super.onSignIn();
  }

  onSignOut() {
    console.log("Setting Page for " + this.manifest.name + ' onSignOut');
    super.onSignOut();
  }

  getConfig() {
    console.log("Setting Page for " + this.manifest.name + ' getConfig.', this.config);
    let newConfig = super.getConfig();
    newConfig.remoteControlledBy = this.remoteControlledBy.value;
    return newConfig;
  }

  _init() {
    console.log("Setting Page for " + this.manifest.name + ' _init.');
    super._init();

    let parentElement: HTMLElement = this.exportCheckBoxDiv.parentElement;
    
    let domConfigSectionInline: HTMLDivElement = domConstruct.create("div", {
      class: "config-section inline"
    }, parentElement, "after");

    let domLabel: HTMLDivElement = domConstruct.create("div", {
      class: "label",
      style: "margin-right: 3px;"
    }, domConfigSectionInline, "last");
    domLabel.innerHTML = this.nls.remoteControlledBy;

    this.remoteControlledBy = domConstruct.create("input", {
      "data-dojo-attach-point": "remoteControlledBy",
      "data-dojo-type": "dijit/form/TextBox",
      "name": "remoteControlledBy"
    }, domConfigSectionInline, "last");

    this.remoteControlledBy.value = this.config.remoteControlledBy;
  }

}

export = Setting;
