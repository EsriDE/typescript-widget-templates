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
        startup();
        getPanel();
        onOpen();
        onClose();
        onNormalize();
        onMinimize();
        onMaximize();
        onActive();
        onDeActive();
        onSignIn(credential: any);
        onSignOut();
        onPositionChange(position: any);
        setPosition(position: any, containerNode: any);
        getPosition(): any;
        getMarginBox(): any;
        publishData(options: any): void;
        fetchData(id: string);
    }

    export = BaseWidget;

}

declare module "jimu/PanelManager" {
    class PanelManager {
        closePanel(panel: any);
        openPanel(panel: any);
        minimizePanel(panel: any);
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
        check();
        uncheck();
        onStateChange();
    }

    export default CheckBox;
}

declare module "jimu/dijit/LoadingShelter" {

    import _WidgetBase = require('dijit/_WidgetBase');

    class LoadingShelter extends dijit._WidgetBase {

        constructor();
        show(loadingText: string);
        hide();
    }

    export = LoadingShelter;
}

declare module "jimu/CSVUtils" {

    var CSVUtils: {
        _download(filename:string, csv:string);
    }

    export = CSVUtils;
}

declare module "jimu/LayerInfos/LayerInfos" {
    var exp: {

        getInstance(map: any, itemInfo: any);
    };

    export default exp;
}

declare module "jimu/utils" {
    var exp: {
        stripHTML(str: string);
        fieldFormatter: any;
        isEqual(a, b);
    }

    export = exp;
}

declare module "jimu/WidgetManager" {

    class WidgetManager {

        static getInstance(): WidgetManager;
        getControllerWidgets(): Array<any>;
        openWidget(widget: string);
        triggerWidgetOpen(widget: string);
        getWidgetById(widget: string);
        getWidgetsByName(widgetName: string): Array<any>;

    }

    export default WidgetManager;

}

