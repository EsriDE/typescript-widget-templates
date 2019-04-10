var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-style", "dojo/dom-construct", "dojo/dom-class", "dojo/dom-attr", "dojo/Deferred", "dojo/on", "dijit/TitlePane", "esri/layers/FeatureLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ArcGISTiledMapServiceLayer", "esri/InfoTemplate", "esri/dijit/Popup", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters", "esri/arcgis/Portal", "esri/request", "./LayerListWidget"], function (require, exports, lang, array, domStyle, domConstruct, domClass, domAttr, Deferred, on, TitlePane, FeatureLayer, DynamicMapLayer, TiledMapLayer, InfoTemplate, Popup, SimpleFillSymbol, SimpleLineSymbol, Color, IdentifyTask, IdentifyParameters, arcgisPortal, esriRequest, LayerListWidget) {
    "use strict";
    // Polyfill
    // IE11 has an issue with string.endsWith: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function (searchString, position) {
            var subjectString = this.toString();
            if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        };
    }
    // IE11 has an issue with array.includes: https://stackoverflow.com/questions/35584459/es6-polyfills-for-array-prototype-includes-and-string-prototype-includes-interfe?noredirect=1&lq=1
    if (!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, "includes", {
            enumerable: false,
            writable: true,
            value: function (searchElement /*, fromIndex*/) {
                'use strict';
                var O = Object(this);
                var len = parseInt(O.length) || 0;
                if (len === 0) {
                    return false;
                }
                var n = parseInt(arguments[1]) || 0;
                var k;
                if (n >= 0) {
                    k = n;
                }
                else {
                    k = len + n;
                    if (k < 0) {
                        k = 0;
                    }
                }
                var currentElement;
                while (k < len) {
                    currentElement = O[k];
                    if (searchElement === currentElement ||
                        (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                        return true;
                    }
                    k++;
                }
                return false;
            }
        });
    }
    var Widget = /** @class */ (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-layerList" }, args)) || this;
            _this.nodes = [];
            _this.allCheckboxNodes = [];
            _this.checkboxNodesAlwaysDisabled = [];
            _this.checkboxNodeIdsEnabledOnCreation = [];
            _this.activeLayers = [];
            _this.removeUnderscores = true;
            _this.titlePanes = [];
            _this.activeIdentifyTasks = [];
            _this.identifyResultFeatures = [];
            _this.initiallyUnavailableLayerIds = {};
            _this.loadedItems = {};
            _this.subLayers = true;
            // CSS classes
            _this.css = {
                container: "esriContainer",
                noLayers: "esriNoLayers",
                noLayersText: "esriNoLayersText",
                slider: "esriSlider",
                legend: "esriLegend",
                list: "esriList",
                listExpand: "esriListExpand",
                listVisible: "esriListVisible",
                subList: "esriSubList",
                hasSubList: "esriHasSubList",
                subListLayer: "esriSubListLayer",
                layer: "esriLayer",
                layerScaleInvisible: "esriScaleInvisible",
                title: "esriTitle",
                titleContainer: "esriTitleContainer",
                checkbox: "esriCheckbox",
                label: "esriLabel",
                button: "esriButton",
                content: "esriContent",
                clear: "esriClear"
            };
            return _this;
        }
        Widget.prototype.startup = function () {
            var _this = this;
            _super.prototype.startup.call(this);
            // Layer counter
            this.numOfActiveLayers = this.map.itemInfo.itemData.operationalLayers.length;
            // Map event listeners
            this.map.on("layer-add-result", function (event) {
                if (event.layer && event.layer.id != "labels") {
                    _this.numOfActiveLayers++;
                    _this.numberOfActiveLayersLabel.textContent = _this.numOfActiveLayers + "/" + _this.config.maxNumOfActiveLayers;
                    _this.activeLayers.push(event.layer);
                    console.debug("layer-add-result", _this.numOfActiveLayers, event);
                    if (_this.config.maxNumOfActiveLayers <= _this.numOfActiveLayers) {
                        _this.disableUncheckedCheckboxes();
                    }
                }
            });
            this.map.on("layer-remove", function (event) {
                _this.numOfActiveLayers--;
                _this.numberOfActiveLayersLabel.textContent = _this.numOfActiveLayers + "/" + _this.config.maxNumOfActiveLayers;
                _this.activeLayers.splice(_this.activeLayers.indexOf(event.layer), 1);
                console.debug("layer-remove", _this.numOfActiveLayers, event);
                _this.enableAllCheckboxes();
            });
            this.map.on("click", function (event) {
                _this.identifyResultFeatures = [];
                _this.identifyFeatures(event);
            });
            this.map.on("extent-change", function (event) { console.debug("Map extent", event.extent, JSON.stringify(event.extent)); });
            // Popup
            var popup = new Popup({
                fillSymbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]))
            }, domConstruct.create("div", {}));
            this.map.setInfoWindow(popup); // not in typings, not in docs, but got this from a sample and it works!
            // number of active layers label
            this.numberOfActiveLayersLabel = domConstruct.create("div", {
                itemid: "activeLayersLabel",
                id: "activeLayersLabel"
            });
            domConstruct.place(this.numberOfActiveLayersLabel, this.layerListTitle, "last");
            // clear map button
            var clearMapButton = domConstruct.create("div", {
                itemid: "clearmap",
                class: "menu-item"
            });
            domConstruct.place(clearMapButton, this.layerListTitle, "last");
            on(clearMapButton, "click", function (e) { return _this.clearMap(); });
            this.initPortal(this.config.portalUrl);
        };
        Widget.prototype.clearMap = function () {
            // need to make a copy of this.activeLayers, because layers will be removed from this.activeLayers when removing layers from the map
            var activeLayersCopy = this.activeLayers.slice(0);
            for (var i = 0; i < activeLayersCopy.length; i++) {
                this.map.removeLayer(activeLayersCopy[i]);
            }
            this.activeIdentifyTasks = [];
            this.uncheckAllCheckboxes();
        };
        Widget.prototype.initPortal = function (portalUrl) {
            try {
                this.portal = new arcgisPortal.Portal(portalUrl);
            }
            catch (e) {
                console.error("Portal error", e);
            }
        };
        Widget.prototype.identifyFeatures = function (event) {
            var _this = this;
            console.debug("identifyFeatures", event);
            var identifyPromises = [];
            this.activeIdentifyTasks.forEach(function (identifyTask) {
                var identifyParams = new IdentifyParameters();
                identifyParams.tolerance = 2;
                identifyParams.returnGeometry = true;
                identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
                identifyParams.mapExtent = _this.map.extent;
                identifyParams.geometry = event.mapPoint;
                identifyPromises.push(identifyTask.execute(identifyParams).then(function (identifyResults) { return _this.displayIdentifyResult(identifyResults, event.mapPoint, identifyTask); }, function (error) { return _this.identifyError(error, identifyTask); }));
            });
        };
        Widget.prototype.identifyError = function (error, identifyTask) {
            console.error("Identify request failed with error ", error, identifyTask);
        };
        Widget.prototype.displayIdentifyResult = function (identifyResults, mapPoint, identifyTask) {
            this.identifyResultFeatures = this.identifyResultFeatures.concat(identifyResults.map(function (identifyResult) {
                var feature = identifyResult.feature;
                var layerName = identifyResult.layerName;
                feature.attributes.layerName = layerName;
                feature.setInfoTemplate(new InfoTemplate(layerName, "${*}"));
                return feature;
            }));
            if (this.identifyResultFeatures.length > 0) { // passing an empty array into Popup.setFeatures does not delete the contents => old contents displayed!
                this.map.infoWindow.show(mapPoint);
                this.map.infoWindow.setFeatures(this.identifyResultFeatures);
            }
            else {
                console.warn("Empty identify result", identifyTask);
            }
        };
        Widget.prototype.sendQueriesAndCreateLayerNodes = function (queries) {
            var _this = this;
            this.treeSection.innerHTML = ""; // clear node
            // close all TitlePanes button
            if (!this.closeAllButton) {
                this.closeAllButton = domConstruct.create("div", {
                    itemid: "closeall",
                    class: "menu-item"
                });
                domConstruct.place(this.closeAllButton, this.treeTitle, "last");
                on(this.closeAllButton, "click", function (e) {
                    for (var i = 0; i < _this.titlePanes.length; i++) {
                        var tp = _this.titlePanes[i];
                        if (tp) {
                            tp.set("open", false);
                        }
                    }
                });
            }
            queries.sort(function (a, b) { return a.position - b.position; });
            queries.forEach(function (query) { return _this.createQueryTitlePanes(query.title, query.tags, _this.treeSection, query.position); });
            queries.forEach(function (query) { return _this.queryPortal(query.tags, query.types, query.num).then(function (result) { return _this.createLayerNodes(query.tags); }); });
        };
        Widget.prototype.queryPortal = function (queryTags, queryTypes, queryNum) {
            var _this = this;
            var deferred = new Deferred(function (reason) {
                console.warn("queryPortal cancelled from outside", reason);
            });
            var queryTypeString = queryTypes.reduce(function (queryTypeString, type) {
                // first loop: queryTypeString contains first array element, type contains second element
                if (queryTypeString.indexOf(" OR type:\"") == -1) {
                    return "(type:\"" + queryTypeString + "\" OR type:\"" + type + "\"";
                }
                return queryTypeString + " OR type:\"" + type + "\"";
            });
            queryTypeString += ")";
            var params = {
                q: 'tags:' + queryTags + queryTypeString,
                num: queryNum,
                start: 0,
                access: "public"
            };
            var loadedItemIndex = 0;
            this.portal.queryItems(params).then(function (items) {
                _this.queryItemsPaginationOrLoadItems(items, queryTags, loadedItemIndex, deferred);
            });
            return deferred.promise;
        };
        Widget.prototype.cleanQueryTags = function (queryTags) {
            return queryTags.replace(/\s/g, '').replace(/-/g, '').replace(/#/g, '');
        };
        Widget.prototype.queryItemsPaginationOrLoadItems = function (items, queryTags, loadedItemIndex, deferred) {
            var _this = this;
            console.debug('query success', queryTags, items);
            items.results.map(function (item) {
                _this.loadItem(item, queryTags, loadedItemIndex);
                loadedItemIndex++;
            });
            if (items.nextQueryParams.start != -1) {
                this.portal.queryItems(items.nextQueryParams).then(function (items) {
                    _this.queryItemsPaginationOrLoadItems(items, queryTags, loadedItemIndex, deferred);
                });
            }
            else {
                if (!this.loadedItems[this.cleanQueryTags(queryTags)].numberOfItems) {
                    this.loadedItems[this.cleanQueryTags(queryTags)].numberOfItems = items.total;
                }
                deferred.resolve(true);
            }
        };
        Widget.prototype.loadItem = function (item, queryTags, loadedItemIndex) {
            var _this = this;
            var cleanQueryTags = this.cleanQueryTags(queryTags);
            var layerInfo = {
                defaultSymbol: true,
                title: item.title,
                type: item.displayName,
                id: item.id
            };
            var loadedItem = {
                layerIndex: loadedItemIndex,
                layerInfo: layerInfo,
                item: item,
                wmsUrl: undefined,
                wmtsUrl: undefined,
                wfsUrl: undefined
            };
            if (!this.loadedItems[cleanQueryTags]) {
                this.loadedItems[cleanQueryTags] = {};
            }
            this.loadedItems[cleanQueryTags][loadedItemIndex] = loadedItem;
            var queryServiceUrl = loadedItem.item.url;
            if (queryServiceUrl.search("Server") > -1) { //queryServiceUrl.endsWith("Server") || queryServiceUrl.endsWith("Server/")) {
                console.debug(item.type, "Valid Service URL", queryServiceUrl);
                if (item.type === "Feature Service") {
                    var requestObject = esriRequest({
                        url: queryServiceUrl,
                        content: { f: "json" }
                    }).then(function (queryServiceResponse) {
                        var ogcServiceUrls = {};
                        if (queryServiceResponse.supportedExtensions != undefined && queryServiceResponse.supportedExtensions.includes("WFSServer")) {
                            ogcServiceUrls.wfsUrl = queryServiceUrl + "/WFSServer?request=GetCapabilities&service=WFS";
                        }
                        var checkboxNode = _this.getCheckboxFromLoadedLayerId(queryTags, loadedItemIndex);
                        if (checkboxNode) {
                            _this.addSpatialReferenceToCheckboxLabel(checkboxNode, queryServiceResponse.layer);
                            _this.addOgcLinksToCheckboxLabel(checkboxNode, ogcServiceUrls);
                        }
                        else {
                            var checkboxId = _this.createCheckboxId(queryTags, loadedItemIndex.toString());
                            _this.checkboxNodeIdsEnabledOnCreation.push(checkboxId);
                        }
                        if (queryServiceUrl.endsWith("FeatureServer") || queryServiceUrl.endsWith("FeatureServer/")) {
                            // Ask Feature Service for sublayers. This is at the same time the check if the service is available.
                            var queryServiceLayersUrl = item.url + "/layers";
                            _this.queryFeatureServiceLayers(item.url, queryServiceLayersUrl, cleanQueryTags, loadedItemIndex);
                        }
                        else {
                            // this might be a MapServer/<Layer>
                            _this.queryFeatureServiceLayers(item.url, item.url, cleanQueryTags, loadedItemIndex);
                        }
                    }, function (error) {
                        console.warn("Feature Service request to ", item.url + "failed with error " + error);
                    });
                }
                else if (item.type === "Map Service") {
                    var requestObject = esriRequest({
                        url: queryServiceUrl,
                        content: { f: "json" }
                    }).then(function (queryServiceResponse) {
                        var ogcServiceUrls = {};
                        if (queryServiceResponse.supportedExtensions != undefined) {
                            if (queryServiceResponse.supportedExtensions.includes("WMSServer")) {
                                ogcServiceUrls.wmsUrl = queryServiceUrl + "/WMSServer?request=GetCapabilities&service=WMS";
                            }
                            if (queryServiceResponse.supportedExtensions.includes("WFSServer")) {
                                ogcServiceUrls.wfsUrl = queryServiceUrl + "/WFSServer?request=GetCapabilities&service=WFS";
                            }
                        }
                        if (queryServiceResponse.singleFusedMapCache === true) {
                            ogcServiceUrls.wmtsUrl = queryServiceUrl + "/WMTS/1.0.0/WMTSCapabilities.xml";
                        }
                        if (item.displayName === "Tile Layer") {
                            var layer = new TiledMapLayer(item.url, {
                                showAttribution: true,
                                id: item.title,
                                opacity: _this.config.rasterLayerDefaultOpacity
                            });
                            queryServiceUrl = item.url;
                            _this.loadedItems[cleanQueryTags][loadedItemIndex].layer = layer;
                            layer.on("load", function (e) {
                                var identifyTask = new IdentifyTask(item.url);
                                _this.loadedItems[cleanQueryTags][loadedItemIndex].identifyTask = identifyTask;
                                _this.handleLayerLoadSuccess("Tile Layer", e, cleanQueryTags, loadedItemIndex, ogcServiceUrls);
                            });
                            layer.on("error", function (e) {
                                _this.handleLayerLoadError("Tile Layer", e, cleanQueryTags, loadedItemIndex);
                            });
                        }
                        else if (item.displayName === "Map Image Layer") {
                            // Map Image Layers are displayed as one resource in the tree, but when active, the sublayers are expandable.
                            var layer = new DynamicMapLayer(item.url, {
                                showAttribution: true,
                                id: item.title
                            });
                            queryServiceUrl = item.url;
                            _this.loadedItems[cleanQueryTags][loadedItemIndex].layer = layer;
                            layer.on("load", function (e) {
                                var identifyTask = new IdentifyTask(item.url);
                                _this.loadedItems[cleanQueryTags][loadedItemIndex].identifyTask = identifyTask;
                                _this.handleLayerLoadSuccess("Map Image Layer", e, cleanQueryTags, loadedItemIndex, ogcServiceUrls);
                            });
                            layer.on("error", function (e) {
                                _this.handleLayerLoadError("Map Image Layer", e, cleanQueryTags, loadedItemIndex);
                            });
                        }
                    }, function (error) {
                        console.error(_this.nls.errorServiceRequestFailed + _this.nls.errorMessage + error + _this.nls.errorUrl + item.url);
                        var e = {
                            error: _this.nls.errorServiceRequestFailed + _this.nls.errorMessage + error + _this.nls.errorUrl + item.url
                        };
                        _this.getCheckboxAndMarkAsUnavailable(e, queryTags, loadedItemIndex);
                    });
                }
                else {
                    console.warn(this.nls.errorLayerCouldNotBeCreated + this.nls.errorUrl + item.url + this.nls.errorType + item.displayName);
                    this.addInitiallyUnavailableLayerId(cleanQueryTags, loadedItemIndex, this.nls.errorLayerCouldNotBeCreated + this.nls.errorUrl + item.url + this.nls.errorType + item.displayName);
                }
            }
            else {
                console.warn(this.nls.errorInvalidServiceUrl, queryServiceUrl);
                this.addInitiallyUnavailableLayerId(cleanQueryTags, loadedItemIndex, this.nls.errorInvalidServiceUrl + queryServiceUrl);
            }
        };
        Widget.prototype.addInitiallyUnavailableLayerId = function (queryTags, layerId, message) {
            if (!this.initiallyUnavailableLayerIds[queryTags]) {
                var emptyNumbersArray = [];
                this.initiallyUnavailableLayerIds[queryTags] = emptyNumbersArray;
            }
            this.initiallyUnavailableLayerIds[queryTags].push(layerId);
            this.initiallyUnavailableLayerIdsErrorMessages[queryTags][layerId] = message;
        };
        Widget.prototype.handleLayerLoadSuccess = function (layerTypeString, e, queryTags, loadedItemIndex, ogcServiceUrls) {
            if (e.layer) {
                var checkboxNode = this.getCheckboxFromLoadedLayerId(queryTags, loadedItemIndex);
                if (checkboxNode) {
                    this.addSpatialReferenceToCheckboxLabel(checkboxNode, e.layer);
                    this.addOgcLinksToCheckboxLabel(checkboxNode, ogcServiceUrls);
                    // web client cannot project tile layers on-the-fly
                    if (layerTypeString !== "Tile Layer" ||
                        e.layer.spatialReference && (e.layer.spatialReference.wkid === this.map.spatialReference.wkid)) {
                        console.debug(layerTypeString + " loaded", e.layer);
                        this.enableCheckbox(checkboxNode);
                    }
                    else {
                        console.warn(layerTypeString + this.nls.errorLayerSr, e.layer);
                        this.markLayerAsUnavailable(checkboxNode, layerTypeString + this.nls.errorLayerSr + e.layer.spatialReference.wkid);
                    }
                }
                else {
                    var checkboxId = this.createCheckboxId(queryTags, loadedItemIndex.toString());
                    this.checkboxNodeIdsEnabledOnCreation.push(checkboxId);
                }
            }
            else {
                console.error("handleLayerLoadSuccess: No layer element found", e);
            }
        };
        Widget.prototype.handleLayerLoadError = function (layerTypeString, e, queryTags, loadedItemIndex) {
            if (e && e.error) {
                console.warn(layerTypeString + " load error", e.error.message, e.error);
            }
            else if (e && e.message) {
                console.warn(layerTypeString + " load error", e.message, e);
            }
            else {
                console.warn(layerTypeString + " load error", e);
            }
            this.getCheckboxAndMarkAsUnavailable(e, queryTags, loadedItemIndex);
        };
        Widget.prototype.getCheckboxAndMarkAsUnavailable = function (e, queryTags, loadedItemIndex) {
            var checkboxNode = this.getCheckboxFromLoadedLayerId(queryTags, loadedItemIndex);
            if (checkboxNode) {
                if (e && e.layer) {
                    this.addSpatialReferenceToCheckboxLabel(checkboxNode, e.layer);
                }
                var message = "";
                if (e && e.error) {
                    if (e.error.message !== "Unable to draw graphic (null): Request canceled") {
                        message = e.error;
                    }
                }
                else if (e && e.message) {
                    message = e.message;
                }
                else {
                    message = this.nls.errorLayerNotFound;
                }
                if (message !== "") {
                    this.markLayerAsUnavailable(checkboxNode, message);
                }
            }
            else {
                this.checkboxNodesAlwaysDisabled.push(checkboxNode);
            }
        };
        Widget.prototype.addSpatialReferenceToCheckboxLabel = function (checkboxNode, layer) {
            if (this.config.showSpatialReference === true
                && checkboxNode.nextSibling && checkboxNode.nextSibling.tagName == "DIV" && checkboxNode.nextSibling.className == "esriLabel") {
                checkboxNode.nextSibling.innerText += " " + this.getSpatialReferenceString(layer);
            }
            return "";
        };
        Widget.prototype.addOgcLinksToCheckboxLabel = function (checkboxNode, ogcServiceUrls) {
            if (checkboxNode.nextSibling && checkboxNode.nextSibling.tagName == "DIV" && checkboxNode.nextSibling.className == "esriLabel") {
                if (ogcServiceUrls) {
                    if (ogcServiceUrls.wmsUrl) {
                        var linkNode = domConstruct.create("a", {
                            href: ogcServiceUrls.wmsUrl,
                            target: "_blank"
                        }, checkboxNode.nextSibling);
                        linkNode.text = "WMS";
                        domAttr.set(linkNode, "itemid", "wmsUrl");
                        domAttr.set(linkNode, "class", "menu-item ogcUrl");
                    }
                    if (ogcServiceUrls.wmtsUrl) {
                        var linkNode = domConstruct.create("a", {
                            href: ogcServiceUrls.wmtsUrl,
                            target: "_blank"
                        }, checkboxNode.nextSibling);
                        linkNode.text = "WMTS";
                        domAttr.set(linkNode, "itemid", "wmtsUrl");
                        domAttr.set(linkNode, "class", "menu-item ogcUrl");
                    }
                    if (ogcServiceUrls.wfsUrl) {
                        var linkNode = domConstruct.create("a", {
                            href: ogcServiceUrls.wfsUrl,
                            target: "_blank"
                        }, checkboxNode.nextSibling);
                        linkNode.text = "WFS";
                        domAttr.set(linkNode, "itemid", "wfsUrl");
                        domAttr.set(linkNode, "class", "menu-item ogcUrl");
                    }
                }
            }
            return "";
        };
        Widget.prototype.createQueryTitlePanes = function (queryTitle, queryTags, targetNode, positionInTargetNode) {
            console.debug("createQueryTitlePanes");
            var cleanQueryTags = this.cleanQueryTags(queryTags);
            if (this.loadedItems) {
                var layerNodesContainer = domConstruct.create("div", {
                    id: cleanQueryTags + "Container"
                });
                var tp = new TitlePane({ title: queryTitle, content: layerNodesContainer, open: false, id: cleanQueryTags + "Title" });
                domConstruct.place(tp.domNode, targetNode, positionInTargetNode);
                tp.startup();
                this.titlePanes.push(tp);
            }
        };
        Widget.prototype.createLayerNodes = function (queryTags) {
            var cleanQueryTags = this.cleanQueryTags(queryTags);
            if (this.loadedItems) {
                var listCounter = 0;
                var queryLoadedItems = this.loadedItems[this.cleanQueryTags(queryTags)];
                var layerNodesContainer = document.getElementById(cleanQueryTags + "Container");
                var titlePaneContainer = document.getElementById(cleanQueryTags + "Title");
                if (titlePaneContainer != null && titlePaneContainer != undefined) {
                    var titlePaneTitle = titlePaneContainer.querySelector("span.dijitTitlePaneTextNode");
                    if (titlePaneTitle != null && titlePaneTitle != undefined) {
                        titlePaneTitle.innerHTML += " (" + queryLoadedItems.numberOfItems + ")";
                    }
                }
                for (var i = 0; i < queryLoadedItems.numberOfItems; i++) {
                    var loadedItem = queryLoadedItems[i];
                    if (loadedItem && !loadedItem.unavailable) {
                        var cssBackgroundClass = "linestyle" + listCounter % 2;
                        var disabled = true;
                        var checkboxId = this.createCheckboxId(queryTags, loadedItem.layerIndex.toString());
                        if (this.checkboxNodeIdsEnabledOnCreation.indexOf(checkboxId) !== -1) {
                            disabled = false;
                        }
                        this.createLayerNode(loadedItem.layer, cleanQueryTags, loadedItem.layerIndex, loadedItem.layerInfo, this.getLayerTitle(loadedItem.layer, loadedItem.layerInfo), this.getItemUrl(loadedItem), layerNodesContainer, "last", "itemurl", [cssBackgroundClass], disabled);
                        listCounter++;
                    }
                }
            }
            else {
                domClass.add(this.treeSection, this.css.noLayers);
                this.treeSection.innerHTML = this.nls.noLayers;
            }
        };
        Widget.prototype.createLayerNode = function (layer, queryTags, layerIndex, layerInfo, title, layerUrl, targetNode, position, itemid, cssClasses, disabled) {
            var _this = this;
            if (position === void 0) { position = "first"; }
            if (disabled === void 0) { disabled = true; }
            var cleanQueryTags = this.cleanQueryTags(queryTags);
            var layerNode;
            // Todo: is layerInfo relevant in all cases?
            // Todo: cleanup!
            if (layerInfo) {
                /*if (layerInfo.featureCollection && !layerInfo.hasOwnProperty("visibility")) {
                 var firstLayer = layerInfo.featureCollection.layers[0];
                 if (firstLayer && firstLayer.layerObject) {
                   layerInfo.visibility = firstLayer.layerObject.visible;
                 }
               } */
                // set visibility on layer info if not set
                if (layer && !layerInfo.hasOwnProperty("visibility")) {
                    layerInfo.visibility = layer.visible;
                }
                // set layer info id
                if (layer && !layerInfo.hasOwnProperty("id")) {
                    layerInfo.id = layer.id;
                }
                // layer node
                layerNode = domConstruct.create("li", {});
                /*       // currently visible layer
                      if (layer && !layer.visibleAtMapScale) {
                        domClass.add(layerNode, this.css.layerScaleInvisible);
                      } */
                domConstruct.place(layerNode, targetNode, position);
                if (cssClasses && cssClasses.length > 0) {
                    cssClasses.map(function (cssClass) {
                        domClass.add(layerNode, cssClass);
                    });
                }
                // title of layer
                var titleNode = domConstruct.create("div", {
                    className: this.css.title
                }, layerNode);
                // get parent layer checkbox status
                var status = false; // Assuming WebMap is empty
                // title container
                var titleContainerNode = domConstruct.create("div", {
                    className: this.css.titleContainer
                }, titleNode);
                var id = this.createCheckboxId(cleanQueryTags, layerIndex.toString());
                // Title checkbox
                var checkboxNode = domConstruct.create("input", {
                    type: "checkbox",
                    id: id,
                    "data-layer-index": layerIndex,
                    className: this.css.checkbox
                }, titleContainerNode, "last");
                if (status) {
                    domAttr.set(checkboxNode, "checked", "checked");
                }
                else {
                    domAttr.remove(checkboxNode, "checked");
                }
                if (disabled) {
                    domAttr.set(checkboxNode, "disabled", "disabled");
                }
                else {
                    domAttr.remove(checkboxNode, "disabled");
                }
                on(checkboxNode, 'click', function (evt) {
                    _this.clickAddLayer(evt);
                });
                this.allCheckboxNodes.push(checkboxNode);
                if (this.initiallyUnavailableLayerIds[cleanQueryTags] && this.initiallyUnavailableLayerIds[cleanQueryTags].includes(layerIndex)) {
                    this.markLayerAsUnavailable(checkboxNode, this.initiallyUnavailableLayerIdsErrorMessages[cleanQueryTags][layerIndex]);
                }
                // Title text
                var labelNode = domConstruct.create("div", {
                    className: this.css.label,
                    textContent: title
                }, titleContainerNode);
                domAttr.set(labelNode, "for", id);
                // Link
                if (layerUrl != undefined) {
                    var linkNode = domConstruct.create("a", {
                        href: layerUrl,
                        target: "_blank"
                    }, labelNode);
                    domAttr.set(linkNode, "itemid", itemid);
                    domAttr.set(linkNode, "class", "menu-item");
                }
                // clear css
                var clearNode = domConstruct.create("div", {
                    className: this.css.clear
                }, titleContainerNode);
                // optional custom content
                var contentNode;
                if (layerInfo.content) {
                    contentNode = domConstruct.create("div", {
                        className: this.css.content
                    }, titleNode);
                    domConstruct.place(layerInfo.content, contentNode);
                }
                // lets save all the nodes for events
                var nodesObj = {
                    checkbox: checkboxNode,
                    title: titleNode,
                    titleContainer: titleContainerNode,
                    label: labelNode,
                    layer: layerNode,
                    clear: clearNode,
                    content: contentNode
                };
                this.nodes[layerIndex] = nodesObj;
                domClass.toggle(layerNode, this.css.listVisible, status);
            }
        };
        Widget.prototype.queryFeatureServiceLayers = function (serviceUrl, queryLayersUrl, queryTags, loadedItemIndex) {
            var _this = this;
            var requestObject;
            requestObject = esriRequest({
                url: queryLayersUrl,
                content: { f: "json" },
                handleAs: "json",
                callbackParamName: "callback"
            }).then(function (queryLayersResponse) { return _this.handleFeatureServiceLayers(queryLayersResponse, queryTags, loadedItemIndex, queryLayersUrl, serviceUrl); }, function (e) {
                _this.handleLayerLoadError("Feature layer", e, queryTags, loadedItemIndex);
            });
            return requestObject;
        };
        Widget.prototype.handleFeatureServiceLayers = function (queryLayersResponse, queryTags, loadedItemIndex, queryLayersUrl, serviceUrl) {
            var _this = this;
            console.debug("Service available, instantiate sublayers: ", loadedItemIndex, queryLayersUrl, queryLayersResponse);
            if (queryLayersResponse.layers && queryLayersResponse.layers[0].type === "Feature Layer") {
                if (queryLayersResponse.layers.length > 1) {
                    this.loadedItems[queryTags][loadedItemIndex].sublayers = queryLayersResponse.layers.map(function (queryLayer) { return _this.instantiateFeatureLayer(queryTags, loadedItemIndex, serviceUrl + "/" + queryLayer.id, _this.getLayerTitle(queryLayer)); });
                    this.createSublayerNodes(queryTags, loadedItemIndex, this.getCheckboxFromLoadedLayerId(queryTags, loadedItemIndex));
                }
                else if (queryLayersResponse.layers.length == 1) {
                    this.loadedItems[queryTags][loadedItemIndex].layer = this.instantiateFeatureLayer(queryTags, loadedItemIndex, serviceUrl + "/" + queryLayersResponse.layers[0].id, this.getLayerTitle(queryLayersResponse.layers[0]));
                }
            }
            else if (queryLayersResponse.type === "Feature Layer") {
                this.loadedItems[queryTags][loadedItemIndex].layer = this.instantiateFeatureLayer(queryTags, loadedItemIndex, serviceUrl, queryLayersResponse.name);
            }
            else {
                console.warn(this.nls.errorNotAFeatureLayer, queryLayersResponse, loadedItemIndex);
                this.addInitiallyUnavailableLayerId(queryTags, loadedItemIndex, this.nls.errorNotAFeatureLayer);
            }
        };
        Widget.prototype.createSublayerNodes = function (queryTags, loadedItemIndex, checkboxNode) {
            var _this = this;
            this.loadedItems[queryTags][loadedItemIndex].sublayers.map(function (sublayer) {
                _this.noCheckbox(checkboxNode);
                // add sublayer nodes
                var layerIndex = _this.loadedItems[queryTags][loadedItemIndex].layerIndex;
                if (sublayer.url && sublayer.url.lastIndexOf("/") != -1) {
                    layerIndex += "-" + sublayer.url.substr(sublayer.url.lastIndexOf("/") + 1);
                }
                _this.createLayerNode(sublayer, queryTags, layerIndex, _this.loadedItems[queryTags][loadedItemIndex].layerInfo, _this.getLayerTitle(sublayer), sublayer.url, checkboxNode.parentElement, "last", "url", ["isSublayer"], false);
            });
        };
        Widget.prototype.instantiateFeatureLayer = function (queryTags, loadedItemIndex, layerUrl, title) {
            var _this = this;
            var infoTemplate = new InfoTemplate(title, "${*}");
            var layer = new FeatureLayer(layerUrl, {
                outFields: ["*"],
                infoTemplate: infoTemplate
            });
            layer.on("load", function (e) {
                _this.handleLayerLoadSuccess("Feature layer", e, queryTags, loadedItemIndex);
            });
            layer.on("error", function (e) {
                _this.handleLayerLoadError("Feature layer", e, queryTags, loadedItemIndex);
            });
            layer.name = title;
            return layer;
        };
        Widget.prototype.clickAddLayer = function (checkboxData) {
            var addLayer = this.getLayerFromCheckbox(checkboxData.target.id);
            var addIdentifyTask = this.getIdentifyTaskFromCheckbox(checkboxData.target.id);
            if (addLayer && addLayer.loadError) {
                console.error(this.nls.errorLayerCouldNotBeAdded, addLayer.loadError);
                this.markLayerAsUnavailable(checkboxData.target, this.nls.errorLayerCouldNotBeAdded + addLayer.loadError);
            }
            if (addLayer) {
                if (checkboxData.target.checked) {
                    if ((this.config.maxNumOfActiveLayers > this.numOfActiveLayers)) {
                        this.map.addLayer(addLayer);
                        if (addIdentifyTask != undefined) {
                            this.activeIdentifyTasks.push(addIdentifyTask);
                        }
                    }
                }
                else {
                    if (this.map.getLayer(addLayer.id)) {
                        this.map.removeLayer(addLayer);
                    }
                    // Remove IdentifyTask
                    this.activeIdentifyTasks = this.activeIdentifyTasks.filter(function (identifyTask) { return identifyTask.url != addIdentifyTask.url; });
                }
            }
            else {
                console.warn("No layer to add at checkbox", checkboxData.target.id);
            }
        };
        ;
        Widget.prototype.getLayerFromCheckbox = function (checkboxId) {
            var getLayer;
            var serviceLayerId;
            var checkBoxIdParsed = this.parseCheckboxId(checkboxId);
            if (checkBoxIdParsed.serviceLayerId != undefined) {
                getLayer = this.loadedItems[checkBoxIdParsed.queryTags][checkBoxIdParsed.layerId].sublayers[checkBoxIdParsed.serviceLayerId];
            }
            else {
                getLayer = this.loadedItems[checkBoxIdParsed.queryTags][checkBoxIdParsed.layerId].layer;
            }
            return getLayer;
        };
        Widget.prototype.getIdentifyTaskFromCheckbox = function (checkboxId) {
            var getIdentifyTask;
            var serviceLayerId;
            var checkBoxIdParsed = this.parseCheckboxId(checkboxId);
            getIdentifyTask = this.loadedItems[checkBoxIdParsed.queryTags][checkBoxIdParsed.layerId].identifyTask;
            return getIdentifyTask;
        };
        Widget.prototype.parseCheckboxId = function (checkboxId) {
            var checkBoxIdRest = checkboxId;
            var serviceLayerId;
            if (checkboxId.lastIndexOf("-") > -1) {
                serviceLayerId = parseInt(checkboxId.substr(checkboxId.lastIndexOf("-") + 1));
                checkBoxIdRest = checkboxId.substr(0, checkboxId.lastIndexOf("-"));
            }
            var layerId = parseInt(checkBoxIdRest.substr(checkBoxIdRest.lastIndexOf("#") + 1));
            checkBoxIdRest = checkBoxIdRest.substr(0, checkboxId.lastIndexOf("#"));
            var queryTags = checkBoxIdRest.substr(checkboxId.lastIndexOf("_") + 1);
            return { layerId: layerId, serviceLayerId: serviceLayerId, queryTags: queryTags };
        };
        Widget.prototype.getCheckboxFromLoadedLayerId = function (queryTags, loadedLayerId) {
            var checkboxId = this.createCheckboxId(queryTags, loadedLayerId.toString());
            return document.getElementById(checkboxId);
        };
        Widget.prototype.createCheckboxId = function (queryTags, layerIndex) {
            return this.id + "_checkbox_" + this.cleanQueryTags(queryTags) + "#" + layerIndex;
        };
        Widget.prototype.markLayerAsUnavailable = function (checkboxNode, message) {
            if (message === void 0) { message = ""; }
            this.checkboxNodesAlwaysDisabled.push(checkboxNode);
            domAttr.set(checkboxNode, "disabled", "disabled");
            if (checkboxNode.parentElement && checkboxNode.parentElement.parentElement && checkboxNode.parentElement.parentElement.parentElement) {
                domAttr.remove(checkboxNode, "checked");
                domAttr.set(checkboxNode, "alt", "message");
                domClass.add(checkboxNode.parentElement.parentElement.parentElement, "layer-unavailable");
                var errorMessageNode = domConstruct.create("div", {
                    className: "errorMessage"
                }, checkboxNode.parentElement.parentElement.parentElement, "last");
                errorMessageNode.innerHTML = message;
            }
        };
        Widget.prototype.noCheckbox = function (checkbox) {
            domStyle.set(checkbox, "display", "none");
        };
        Widget.prototype.enableCheckbox = function (checkbox) {
            if (!this.checkboxNodesAlwaysDisabled.includes(checkbox)) {
                domAttr.remove(checkbox, "disabled");
            }
        };
        Widget.prototype.uncheckCheckbox = function (checkbox) {
            if (!this.checkboxNodesAlwaysDisabled.includes(checkbox)) {
                //domAttr.remove(checkbox, "checked");
                checkbox.checked = false;
            }
        };
        Widget.prototype.enableAllCheckboxes = function () {
            var _this = this;
            this.allCheckboxNodes.map(function (checkbox) {
                _this.enableCheckbox(checkbox);
            });
        };
        Widget.prototype.uncheckAllCheckboxes = function () {
            var _this = this;
            this.allCheckboxNodes.map(function (checkbox) {
                if (checkbox.checked) {
                    _this.uncheckCheckbox(checkbox);
                }
            });
        };
        Widget.prototype.disableUncheckedCheckboxes = function () {
            this.allCheckboxNodes.map(function (checkbox) {
                if (!domAttr.get(checkbox, "checked")) {
                    domAttr.set(checkbox, "disabled", "disabled");
                }
            });
        };
        Widget.prototype.showSublayers = function (layerInfo) {
            return layerInfo.hasOwnProperty("subLayers") ? layerInfo.subLayers : this.subLayers;
        };
        Widget.prototype.WMSVisible = function (layerInfo, subLayerInfo) {
            var visibleLayers = [];
            if (layerInfo && layerInfo.layer) {
                visibleLayers = layerInfo.layer.visibleLayers;
            }
            return array.indexOf(visibleLayers, subLayerInfo.name) > -1;
        };
        Widget.prototype.getItemUrl = function (e) {
            if (e.layerInfo != undefined) {
                return this.config.portalUrl + "/home/item.html?id=" + e.layerInfo.id;
            }
            return "";
        };
        Widget.prototype.getLayerTitle = function (layer, layerInfo) {
            var title = "";
            // get best title
            if (layerInfo && layerInfo.title) {
                title = layerInfo.title;
            }
            else if (layer && layer.arcgisProps && layer.arcgisProps.title) {
                title = layer.arcgisProps.title;
            }
            else if (layer && layer.name) {
                title = layer.name;
            }
            else if (layerInfo && layerInfo.id) {
                title = layerInfo.id;
            }
            else if (layer && layer.id) {
                title = layer.id;
            }
            var hasLayerType = (layer && layer.type) != undefined;
            var hasLayerInfoType = (layerInfo && layerInfo.type) != undefined;
            var hasType = hasLayerType || hasLayerInfoType;
            if (this.config.showLayerType === true) {
                if (hasType) {
                    title += " (";
                    if (hasLayerType) {
                        title += layer.type;
                    }
                    else if (hasLayerInfoType) {
                        title += layerInfo.type;
                    }
                    title += ")";
                }
            }
            // optionally remove underscores
            return this.removeUnderscores ? title.toString().replace(/_/g, " ") : title.toString();
        };
        Widget.prototype.getSpatialReferenceString = function (layer) {
            var srString = "";
            if (this.config.showSpatialReference === true) {
                if ((layer && layer.spatialReference) != undefined) {
                    srString += " (" + layer.spatialReference.wkid + ")";
                }
            }
            ;
            return srString;
        };
        Widget.prototype.onClose = function () {
            _super.prototype.onClose.call(this);
            console.debug(this.manifest.name + ' onClose');
            this.clearMap();
            for (var i = 0; i < this.titlePanes.length; i++) {
                var tp = this.titlePanes[i];
                tp.destroyRecursive(false);
            }
            this.titlePanes = [];
        };
        Widget.prototype.onMinimize = function () {
            _super.prototype.onMinimize.call(this);
            console.debug(this.manifest.name + ' onMinimize');
        };
        Widget.prototype.onMaximize = function () {
            _super.prototype.onMaximize.call(this);
            console.debug(this.manifest.name + ' onMaximize');
        };
        Widget.prototype.onSignIn = function (credential) {
            _super.prototype.onSignIn.call(this);
            console.debug(this.manifest.name + ' onSignIn');
        };
        Widget.prototype.onSignOut = function () {
            _super.prototype.onSignOut.call(this);
            console.debug(this.manifest.name + ' onSignOut');
        };
        Widget.prototype.postCreate = function () {
            _super.prototype.postCreate.call(this);
            console.debug(this.manifest.name + ' onpostCreate');
        };
        Widget.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            console.debug(this.manifest.name + ' onOpen');
            this.sendQueriesAndCreateLayerNodes(this.config.queries);
        };
        return Widget;
    }(LayerListWidget));
    return Widget;
});

//# sourceMappingURL=Widget.js.map
