import Map = require("esri/map");
import lang = require("dojo/_base/lang");
import dom = require("dojo/dom");
import domConstruct = require("dojo/dom-construct");
import SelectSetting = require("./SelectSetting");

class Setting extends SelectSetting {

  private manifest: any;
  private config: any;
  private map: Map;

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

    let domConfigSectionInline: HTMLDivElement = domConstruct.create("div", {
      class: "config-section inline"
    }, document.documentElement, "last");

    let domLabel: HTMLDivElement = domConstruct.create("div", {
      class: "label"
    }, domConfigSectionInline, "last");
    domLabel.innerHTML = "${nls.remoteControlledBy}";

    let domInputRemoteControlledBy: HTMLInputElement = domConstruct.create("input", {
      "data-dojo-attach-point": "remoteControlledBy",
      "data-dojo-type": "dijit/form/TextBox",
      "name": "remoteControlledBy"
    }, domConfigSectionInline, "last");

    /*

      <div class="config-section inline">
    <div class="label">${nls.remoteControlledBy}</div>
    <input data-dojo-attach-point="remoteControlledBy" 
    data-dojo-type="dijit/form/TextBox"
    name="remoteControlledBy"
    />
  </div>


    */
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
    newConfig.remoteControlledBy = this.remoteControlledBy.textbox.value;
    return newConfig;
  }

  _init() {
    console.log("Setting Page for " + this.manifest.name + ' _init.');
    super._init();

    this.remoteControlledBy.textbox.value = this.config.remoteControlledBy;
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

export = Setting;
