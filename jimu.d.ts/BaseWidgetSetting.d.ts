/// <reference path="../node_modules/@types/dojo/dijit.d.ts" />

declare module "jimu/BaseWidgetSetting" {
  import Map = require("esri/map");
  import _WidgetBase = require("dijit/_WidgetBase");
  import _TemplatedMixin = require("dijit/_TemplatedMixin");

  class BaseWidgetSetting extends _WidgetBase {
    private templateString: string;
    map: Map;
    config: any;

    // From _WidgetBase:
    postCreate(): void;

    //implemented by sub class, should return the config object.
    //if this function return a promise, the promise should resolve the config object.
    getConfig(): any;

    //implemented by sub class, should return the data sources that this widget generates.
    //if this function return a promise, the promise should resolve the data sources object.
    getDataSources(): any;

    //implemented by sub class, should update the config UI
    setConfig(config: any): void;

    resize(): void;
  }
  export = BaseWidgetSetting;
}
