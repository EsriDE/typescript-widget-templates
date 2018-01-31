import WidgetManager = require("jimu/WidgetManager");
import PanelManager = require("jimu/PanelManager");
import lang = require("dojo/_base/lang");
import domStyle = require("dojo/dom-style");
import domConstruct = require("dojo/dom-construct");
import domClass = require("dojo/dom-class");

// Add your esri imports here
import FeatureLayer = require("esri/map");

// Don't forget to import the base class!
import SelectWidget = require("./SelectWidget");

class Widget extends SelectWidget {

  // Declare additional variables to avoid type errors of compiler (samples, not complete).
  private manifest: any;
  private selectDijit: any;
  private nls: any;

  // Modify name of the base class (see source code of original template). 
  constructor(args?: Array<any>) {
    super(lang.mixin({ baseClass: "jimu-widget-select" }, args));
  }

  private startup() {    
    super.startup();    
  }

  private onClose() {
    super.onClose();
    console.log(this.manifest.name + ' onClose');
  }

  private onMinimize() {
    super.onMinimize();
    console.log(this.manifest.name + ' onMinimize');
  }

  private onMaximize() {
    super.onMaximize();
    console.log(this.manifest.name + ' onMaximize');
  }

  private onSignIn(credential: any) {
    super.onSignIn();
    console.log(this.manifest.name + ' onSignIn');
  }

  private onSignOut() {
    super.onSignOut();
    console.log(this.manifest.name + ' onSignOut');
  }

  private postCreate() {
    super.postCreate();
    console.log(this.manifest.name + ' onpostCreate');    
  }

  private onOpen() {
    super.onOpen();
    console.log(this.manifest.name + ' onOpen');
  }

  // Add your methods below
  
}

export = Widget;