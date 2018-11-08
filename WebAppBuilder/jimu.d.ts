/// <reference path="../node_modules/@types/arcgis-js-api/index.d.ts" />
/// <reference path="../node_modules/@types/dojo/dijit.d.ts" />

declare module "jimu/BaseWidget" {
    import Map = require('esri/map');
    import _WidgetBase = require('dijit/_WidgetBase');
    import __TemplatedMixin = require('dijit/_TemplatedMixin');

    class BaseWidget extends dijit._WidgetBase implements dijit._TemplatedMixin {
        attachScope: Object;
        searchContainerNode: boolean;
        templatePath: string;
        buildRendering(): void;
        destroyRendering(): void;
        getCachedTemplate(templateString: String, alwaysUseString: boolean, doc: HTMLDocument): any;

        type: string;
        id: string;
        label: string;
        icon: string;
        uri: string;
        position: { left: number; top: number; right: number; bottom: number; width: number; height: number;}
        config: any;
        nls: any;
        openAtStart: boolean;
        map: Map;
        appConfig: any;
        folderUrl: string;
        state: string;
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
        getPanel(): any;
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
        publishData(options: any): void;
        fetchData(id: string): any;
    }

    export = BaseWidget;

}

declare module "jimu/PanelManager" {
    class PanelManager {
        closePanel(panel: any): any;
        openPanel(panel: any): any;
        minimizePanel(panel: any): any;
        public static getInstance(): PanelManager;
    }
    export = PanelManager;
}

declare module "jimu/dijit/CheckBox" {

    import _WidgetBase = require('dijit/_WidgetBase');

    class CheckBox extends dijit._WidgetBase{

        checked: boolean;
        status: boolean;
        label: string;

        constructor(options:any);
        check(): any;
        uncheck(): any;
        onStateChange(): any;
    }

    export = CheckBox;
}

declare module "jimu/dijit/LoadingShelter" {

    import _WidgetBase = require('dijit/_WidgetBase');

    class LoadingShelter extends dijit._WidgetBase {

        constructor();
        show(loadingText: string): void;
        hide(): void;
    }

    export = LoadingShelter;
}

declare module "jimu/CSVUtils" {

    var CSVUtils: {
        _download(filename:string, csv:string): any;
    }

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
        isEqual(a:any, b:any): boolean;
    }

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
        appConfig: any;
    }

    export = WidgetManager;

}

