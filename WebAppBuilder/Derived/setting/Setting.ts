import Map = require("esri/map");
import lang = require("dojo/_base/lang");
import domConstruct = require("dojo/dom-construct");
import aceEditor = require("./builder/libs/ace/ace.js");
import OrigSetting = require("./OrigSetting");

class Setting extends OrigSetting {
  private manifest: any;
  private config: any;
  private map: Map;
  private nls: any;
  private aceEdit: HTMLDivElement;
  private queries: HTMLInputElement;
  private editor: any;

  constructor(args?: Array<any>) {
    super(lang.mixin({ baseClass: "jimu-widget-Workflow" }, args));
    console.log("Setting Page", this.config, this.queries);
  }

  startup() {
    console.log(
      "Setting Page for " + this.manifest.name + " startup",
      this.config,
      this.map
    );

    super.startup();
    this.setConfig(this.config);
  }

  postCreate() {
    console.log(
      "Setting Page for " + this.manifest.name + " postCreate",
      this.config
    );

    // if (this.config) {
    this._init();
    // }
    super.postCreate();
  }

  setConfig(config: any) {
    let e = aceEditor; // need this prothesis due to JS memory allocation
    console.debug("ACE Editor", e);
    this.editor = window.ace.edit("queries");
    this.editor.session.setMode("ace/mode/json");
    this.editor.setValue(JSON.stringify(config, null, "\t"));
  }

  getConfig() {
    console.log(
      "Setting Page for " + this.manifest.name + " getConfig.",
      this.config
    );
    let newConfig = JSON.parse(this.editor.getValue());
    return newConfig;
  }

  constructAceElement(
    elementName: string,
    targetElement: HTMLDivElement,
    width: number = 10,
    height: number = 1.5
  ): HTMLInputElement {
    if (width === void 0) {
      width = 10;
    }
    if (height === void 0) {
      height = 1.5;
    }
    var label = domConstruct.create(
      "div",
      {
        class: "label",
        style: "margin-right: 3px;"
      },
      targetElement,
      "last"
    );

    label.innerHTML = this.nls[elementName];
    let xx = domConstruct.create(
      "div",
      {
        "data-dojo-attach-point": elementName,
        style: "width: " + width + "em; height: 412px",
        name: elementName,
        id: elementName
      },
      targetElement,
      "last"
    );
    console.log("DOMCONSTRUCT:", xx, targetElement);

    return xx;
  }

  _init() {
    console.log("Setting Page for " + this.manifest.name + " _init.");

    let parentElement: HTMLElement = this.aceEdit;

    let domConfigSectionInline: HTMLDivElement = domConstruct.create(
      "div",
      {
        class: "config-section inline"
      },
      parentElement,
      "last"
    );

    this.queries = this.constructAceElement(
      "queries",
      domConfigSectionInline,
      50
    );
  }
}

export = Setting;
