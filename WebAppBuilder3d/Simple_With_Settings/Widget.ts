import BaseWidget = require("jimu/BaseWidget");
import lang = require("dojo/_base/lang");

class Widget extends BaseWidget {

  baseClass = "Simple_With_Settings";
  config: any;
  private subnode: HTMLElement;

  constructor(args?: Array<any>) {
    super(lang.mixin({baseClass: "Simple_With_Settings"}, args));
    console.log(`Constructor of ${this.baseClass}`);    
  }

  postCreate() {
    super.postCreate();
    let divs = Object.keys(this.config).map((key) => `<div>${key} with value: ${this.config[key]}</div>`);
    this.subnode.innerHTML = divs.join('');
  }

  startup() {
    super.startup();
    console.log(`Startup of ${this.baseClass}`);    
  }

  onOpen() {
    super.onOpen();
    console.log(`OnOpen of ${this.baseClass}`);    
  }

  onClose(){
    super.onClose();
    console.log(`OnClose of ${this.baseClass}`);    
  }

  onMinimize(){
    super.onMinimize();
    console.log(`OnMinimize of ${this.baseClass}`);    
  }

  onMaximize(){
    super.onMaximize();
    console.log(`OnMaximize of ${this.baseClass}`);    
  }

  onSignIn(credential: any){
    super.onSignIn(credential);
    console.log(`OnSignIn of ${this.baseClass}`, credential);    
  }

  onSignOut(){
    super.onSignOut();
    console.log(`OnSignOut of ${this.baseClass}`);    
  }
}

export = Widget;
