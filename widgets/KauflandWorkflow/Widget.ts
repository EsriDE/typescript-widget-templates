import BaseWidget = require("jimu/BaseWidget");
import lang = require("dojo/_base/lang");
import array = require("dojo/_base/array");

class Widget extends BaseWidget {

  public baseClass: string = "jimu-widget-kauflandworkflow";
  public config: SpecificWidgetConfig;

  private subnode: HTMLElement;

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-kauflandworkflow"} args));  // replaces "this.inherited(args)" from Esri tutorials
  }

  startup() {
    this.mapIdNode.innerHTML = 'map id:' + this.map.id;
    console.log('startup', this.config, this.map.id);
  }


  postCreate() {
    console.log('postCreate', this.config);
    /*
    for(var element of this.config.elements){
      var divElement = document.createElement("div");
      var linkElement = document.createElement("a");
      
      linkElement.textContent = element.name;
      linkElement.href = element.href;

      divElement.appendChild(linkElement);

      this.subnode.appendChild(divElement);
    }
    */
  }

  

  onOpen() {
    console.log('onOpen');
  }

  onClose() {
    console.log('onClose');
  }

  onMinimize() {
    console.log('onMinimize');
  }

  onMaximize() {
    console.log('onMaximize');
  }

  onSignIn(credential){
    /* jshint unused:false*/
    console.log('onSignIn');
  }

  onSignOut() {
    console.log('onSignOut');
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
