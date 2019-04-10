/// <reference path="../node_modules/@types/dojo/dijit.d.ts" />

declare module "jimu/BaseWidget" {
  import Map = require("esri/map");
  import _WidgetBase = require("dijit/_WidgetBase");
  import _TemplatedMixin = require("dijit/_TemplatedMixin");
  import { IManifest } from "Manifest";

  class BaseWidget extends _WidgetBase {
    // From: _TemplatedMixin
    attachScope: Object;
    searchContainerNode: boolean;
    templatePath: string;
    buildRendering(): void;
    destroyRendering(): void;
    getCachedTemplate(
      templateString: String,
      alwaysUseString: boolean,
      doc: HTMLDocument
    ): any;

    // From _WidgetBase:
    postCreate(): void;

    manifest: IManifest;
    nls: any;

    type: string;
    id: string;
    label: string;
    icon: string;
    uri: string;
    position: {
      left: number;
      top: number;
      right: number;
      bottom: number;
      width: number;
      height: number;
    };
    // config: any;
    openAtStart: boolean;
    map: Map;
    appConfig: any;
    folderUrl: string;
    state: string;
    windowstate: string;
    started: boolean;
    name: string;
    baseClass: string;
    templateString: string;
    moveTopOnActive: boolean;
    closeable: boolean;
    isOnScreen: boolean;
    listenWidgetIds: Array<string>;

    constructor(args?: any);
    startup(): void;
    onOpen(): any;
    onClose(): any;
    onNormalize(): any;
    onMinimize(): any;
    onMaximize(): any;
    onActive(): any;
    onDeActive(): any;
    onSignIn(credential: any): any;
    onSignOut(): any;
    onPositionChange(position: any): any;
    setPosition(position: any, containerNode: any): any;
    getPosition(): any;
    getMarginBox(): any;
    setMap(map: Map): void;
    setState(state: any): void;
    setWindowState(state: any): void;
    resize(): void;
    getPanel(): any;
    publishData(data: any, keepHistory?: boolean | undefined): void;
    fetchData(widgetId: number): void;
    fetchDataByName(widgetName: string): void;
    openWidgetById(widgetId: string): void;
    onReceiveData(
      name: string,
      widgetId: string,
      data: any,
      historyData: any
    ): void;
    updateDataSourceData(dsId: any, data: any): void;
    onDataSourceDataUpdate(dsId: any, data: any): void;
    onNoData(name: string, widgetId: string): void;
  }
  export = BaseWidget;
}
