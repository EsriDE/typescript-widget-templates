import lang = require("dojo/_base/lang");
import esriRequest = require("esri/request");
import SelectSetting = require("./SelectSetting");

class Setting extends SelectSetting {

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-select-setting"}, args));
    console.log("Setting Page for " + this.manifest.name + ' constructor.', this.config);

    esriRequest.setRequestPreCallback(function(evt) {
      console.log("esriRequest", evt);
    });
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

  onSignIn(credential){
    /* jshint unused:false*/
    console.log("Setting Page for " + this.manifest.name + ' onSignIn');
    super.onSignIn();
  }

  onSignOut() {
    console.log("Setting Page for " + this.manifest.name + ' onSignOut');
    super.onSignOut();
  }

  resize() {
    console.log("Setting Page for " + this.manifest.name + ' resize');
    super.resize();
  }

  _onWindowResize() {
    console.log("Setting Page for " + this.manifest.name + ' _onWindowResize');
    super._onWindowResize();
  }

  setConfig() {
    console.log("Setting Page for " + this.manifest.name + ' setConfig');
    super.setConfig();
  }

  getConfig() {
    console.log("Setting Page for " + this.manifest.name + ' getConfig.', this.config);
    super.getConfig();
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
