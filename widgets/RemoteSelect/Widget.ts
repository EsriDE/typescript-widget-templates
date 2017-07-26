import lang = require("dojo/_base/lang");
import SelectWidget = require("./SelectWidget");

class Widget extends SelectWidget {

  private widgetName = "RemoteSelect";

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-select"}, args));  // replaces "this.inherited(args)" from Esri tutorials
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
