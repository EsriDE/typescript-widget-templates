import BaseWidget = require("jimu/BaseWidget");
import lang = require("dojo/_base/lang");
import array = require("dojo/_base/array");

class Widget extends BaseWidget {

  public baseClass: string = "jimu-widget-kauflandworkflow";
  public config: SpecificWidgetConfig;

  private subnode: HTMLElement;

  constructor(args?) {
    super(lang.mixin({baseClass: "jimu-widget-kauflandworkflow"}, args));

    alert("constructor was called" + this.map.id);
  }

  startup() {
    this.inherited(arguments);
    this.mapIdNode.innerHTML = 'map id:' + this.map.id;
    alert("mapID: " + this.map.id);
    console.log('startup', arguments);
  }

/*
  postCreate() {
    
    for(var element of this.config.elements){
      var divElement = document.createElement("div");
      var linkElement = document.createElement("a");
      
      linkElement.textContent = element.name;
      linkElement.href = element.href;

      divElement.appendChild(linkElement);

      this.subnode.appendChild(divElement);
    }

  }
*/
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
