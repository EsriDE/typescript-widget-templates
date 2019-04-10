/// <reference path="../node_modules/@types/dojo/dijit.d.ts" />
/// <reference path="../node_modules/@types/dojo/dojox.json.d.ts" />

declare module "jimu/PanelManager" {
  class PanelManager {
    activePanel: any;
    closePanel(panel: any): any;
    openPanel(panel: any): any;
    minimizePanel(panel: any): any;
    getPanelById(panelId: string): any;
    public static getInstance(): PanelManager;
  }
  export = PanelManager;
}

declare module "jimu/dijit/CheckBox" {
  import _WidgetBase = require("dijit/_WidgetBase");

  class CheckBox extends _WidgetBase {
    checked: boolean;
    status: boolean;
    label: string;

    constructor(options: any);
    check(): any;
    uncheck(): any;
    onStateChange(): any;
  }

  export = CheckBox;
}

declare module "jimu/dijit/LoadingShelter" {
  import _WidgetBase = require("dijit/_WidgetBase");

  class LoadingShelter extends _WidgetBase {
    constructor();
    show(loadingText: string): void;
    hide(): void;
  }

  export = LoadingShelter;
}

declare module "jimu/CSVUtils" {
  var CSVUtils: {
    _download(filename: string, csv: string): any;
  };

  export = CSVUtils;
}

declare module "jimu/LayerInfos/LayerInfos" {
  var exp: {
    getInstance(map: any, itemInfo: any): any;
  };

  export = exp;
}

declare module "jimu/utils" {
  var exp: {
    stripHTML(str: string): string;
    fieldFormatter: any;
    isEqual(a: any, b: any): boolean;
  };

  export = exp;
}

declare module "jimu/WidgetManager" {
  class WidgetManager {
    static getInstance(): WidgetManager;
    getControllerWidgets(): Array<any>;
    openWidget(widget: string): void;
    triggerWidgetOpen(widget: string): any;
    getWidgetById(widget: string): any;
    getWidgetsByName(widgetName: string): Array<any>;
    loadWidget(widget: any): Promise<any>;
    appConfig: any;
  }

  export = WidgetManager;
}
