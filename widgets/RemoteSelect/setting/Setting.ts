import lang = require("dojo/_base/lang");
import SelectSetting = require("./SelectSetting");

class Setting extends SelectSetting {

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-select-setting"}, args));
    console.log(this.config);
    console.log("Setting Page for " + this.manifest.name + ' constructor');
  }

  startup() {
    super.startup();
    console.log("Setting Page for " + this.manifest.name + ' startup', this.config, this.map);
  }

  postCreate() {
    super.postCreate();
    console.log("Setting Page for " + this.manifest.name + ' postCreate', this.config);
  }

  onOpen() {
    super.onOpen();
    console.log("Setting Page for " + this.manifest.name + ' onOpen');
  }

  onClose() {
    super.onClose();
    console.log("Setting Page for " + this.manifest.name + ' onClose');
  }

  onMinimize() {
    super.onMinimize();
    console.log("Setting Page for " + this.manifest.name + ' onMinimize');
  }

  onMaximize() {
    super.onMaximize();
    console.log("Setting Page for " + this.manifest.name + ' onMaximize');
  }

  onSignIn(credential){
    super.onSignIn();
    /* jshint unused:false*/
    console.log("Setting Page for " + this.manifest.name + ' onSignIn');
  }

  onSignOut() {
    super.onSignOut();
    console.log("Setting Page for " + this.manifest.name + ' onSignOut');
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
