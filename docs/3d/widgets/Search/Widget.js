///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/when',
    'dojo/on',
    // 'dojo/aspect',
    'dojo/query',
    'dojo/keys',
    'dojo/Deferred',
    'dojo/promise/all',
    'jimu/BaseWidget',
    // 'jimu/LayerInfos/LayerInfos',
    'jimu/utils',
    // 'esri/dijits/Search',
    'esri/widgets/Search',
    'esri/widgets/Search/SearchViewModel',
    'esri/tasks/Locator',
    'esri/tasks/support/Query',
    'esri/layers/FeatureLayer',
    'esri/layers/SceneLayer',
    // 'esri/InfoTemplate',
    'esri/symbols/PictureMarkerSymbol',
    'esri/PopupTemplate',
    './utils',
    'dojo/NodeList-dom'
  ],
  function(declare, lang, array, html, when, on, /*aspect,*/ query, keys, Deferred, all,
    BaseWidget, /*LayerInfos,*/ jimuUtils, Search, SearchViewModel, Locator, FeatureQuery,
    FeatureLayer, SceneLayer, /*InfoTemplate,*/ PictureMarkerSymbol, PopupTemplate, utils) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      name: 'Search',
      baseClass: 'jimu-widget-search',
      searchDijit: null,
      searchResults: null,
      _highlightedFeatureHandle: null,

      postCreate: function() {
        // if (this.closeable || !this.isOnScreen) {
        //   // html.addClass(this.searchNode, 'default-width-for-openAtStart');
        // }

        this.listenWidgetIds.push('framework');
      },

      startup: function() {
        this.inherited(arguments);

        if (!(this.config && this.config.sources)) {
          this.config.sources = [];
        }

        utils.setMap(this.sceneView.map);
        utils.setAppConfig(this.appConfig);
        when(utils.getConfigInfo(this.config)).then(lang.hitch(this, function(config) {
          return all(this._convertConfig(config)).then(function(searchSouces) {
            return array.filter(searchSouces, function(source) {
              return source;
            });
          });
        })).then(lang.hitch(this, function(searchSouces) {
          if (!this.domNode) {
            return;
          }

          var svm = new SearchViewModel({
            activeSourceIndex: searchSouces.length === 1 ? 0 : -1,
            allPlaceholder: jimuUtils.stripHTML(this.config.allPlaceholder ?
              this.config.allPlaceholder : window.jimuNls.common.findAddressOrPlace),
            autoSelect: true,
            buttonModeEnabled: false,
            labelEnabled: false,
            popupEnabled: jimuUtils.isDefined(this.config.showInfoWindowOnSelect) ?
              !!this.config.showInfoWindowOnSelect : true,//change property name from 4.5
            //popupOpenOnSelect: true,
            view: this.sceneView,
            sources: searchSouces,
            theme: 'arcgisSearch'
          });
          this.searchDijit = new Search({
            viewModel: svm,
            includeDefaultSources: false,
            container: this.searchNode
          });
          this.searchDijit.startup();

          this._resetSearchDijitStyle();

          this.own(
            this.searchDijit.viewModel.watch(
              'activeSourceIndex',
              lang.hitch(this, '_onSourceIndexChange')
            )
          );

          /*
          this.own(
            on(this.searchDijit.viewModel, 'search-results', lang.hitch(this, '_onSearchComplete'))
          );
          */

          this.own(
            on(this.searchDijit.viewModel, 'select-result', lang.hitch(this, '_onSelectResult'))
          );

          this.own(
            on(this.searchDijit.domNode, 'click', lang.hitch(this, '_onSearchDijitClick'))
          );

          this.own(on(this.searchDijit._inputNode, "keyup", lang.hitch(this, function(e) {
            if (e.keyCode !== keys.ENTER) {
              this._onClearSearch();
            }
          })));

          this.own(
            on(this.searchDijit.viewModel, 'suggest-results', lang.hitch(this, '_onSuggestResults'))
          );

          this.own(
            on(this.searchDijit.viewModel, 'search-clear', lang.hitch(this, '_onClearSearch'))
          );

          /*****************************************
           * Binding events for control result menu
           * ***************************************/
          /*
          this.own(
            on(this.searchResultsNode, 'li:click', lang.hitch(this, '_onSelectSearchResult'))
          );

          this.own(on(
            this.searchResultsNode,
            '.show-all-results:click',
            lang.hitch(this, '_showResultMenu')
          ));

          this.own(
            on(window.document, 'click', lang.hitch(this, function(e) {
              if (!html.isDescendant(e.target, this.searchResultsNode)) {
                this._hideResultMenu();
                this._resetSelectorPosition('.show-all-results');
              }
            }))
          );

          this.own(this.sceneView.popup.viewModel.watch('visible',
            lang.hitch(this, function(newValue, oldValue) {
            if (!newValue && oldValue) {
              this.searchDijit.viewModel.clearGraphics();
              query('li', this.searchResultsNode).removeClass('result-item-selected');
            }
          })));
          */

          this.fetchData('framework');
        }));
      },

      _convertConfig: function(config) {
        var sourceDefs = array.map(config.sources, lang.hitch(this, function(source) {
          var def = new Deferred();
          if (source && source.url && source.type === 'locator') {
            def.resolve({
              locator: new Locator(source.url || ""),
              outFields: ["*"],
              singleLineFieldName: source.singleLineFieldName || "",
              name: jimuUtils.stripHTML(source.name || ""),
              placeholder: jimuUtils.stripHTML(source.placeholder || ""),
              highlightSymbol: new PictureMarkerSymbol({
                url: this.folderUrl + "css/images/search-pointer.png",
                size: 36,
                width: 36,
                height: 36,
                xoffset: 9,
                yoffset: 18
              }),
              countryCode: source.countryCode || "",
              maxSuggestions: source.maxSuggestions || 6,
              maxResults: source.maxResults || 6,
              zoomScale: source.zoomScale || 50000,
              withinViewEnabled: !!source.searchInCurrentMapExtent
            });
          } else if (source && source.url && source.type === 'query') {

            var sourceLayerView = this._getLayerViewByLayerId(source.layerId);
            var searchLayer;
            var isSceneLayer = (/\/sceneserver\//gi).test(source.url);
            if(isSceneLayer) {
              searchLayer = new SceneLayer({
                url: source.url || null,
                outFields: ["*"]
              });
            } else {
              searchLayer = new FeatureLayer({
                url: source.url || null,
                outFields: ["*"]
              });
            }

            searchLayer.load().then(lang.hitch(this, function() {
              var flayer = searchLayer;
              var popupTemplate = this._getInfoTemplate(flayer, source, source.displayField);
              var fNames = null;
              if (source.searchFields && source.searchFields.length > 0) {
                fNames = source.searchFields;
              } else {
                fNames = [];
                array.forEach(flayer.fields, function(field) {
                  if (field.type !== "esriFieldTypeOID" && field.name !== flayer.objectIdField &&
                    field.type !== "esriFieldTypeGeometry") {
                    fNames.push(field.name);
                  }
                });
              }
              var convertedSource = {
                featureLayer: flayer,
                outFields: ["*"],
                searchFields: fNames,
                displayField: source.displayField || "",
                exactMatch: !!source.exactMatch,
                name: jimuUtils.stripHTML(source.name || ""),
                placeholder: jimuUtils.stripHTML(source.placeholder || ""),
                maxSuggestions: source.maxSuggestions || 6,
                maxResults: source.maxResults || 6,
                popupTemplate: popupTemplate || null,
                zoomScale: source.zoomScale || 50000,
                withinViewEnabled: !!source.searchInCurrentMapExtent,
                featureLayerId: source.layerId,
                featurelayerGeometryType: searchLayer.geometryType
              };

              if(sourceLayerView) {
                //convertedSource.popupEnabled = false;
                //convertedSource.resultSymbol = null;
                //convertedSource.defaultSymbol = null;
                convertedSource.resultGraphicEnabled = false;
              } else {
                //convertedSource.popupEnabled = true;
                //convertedSource.resultGraphicEnabled = true;
              }

              def.resolve(convertedSource);
            }), lang.hitch(this, function() {
              def.resolve(null);
            }));
          } else {
            def.resolve(null);
          }
          return def;
        }));

        return sourceDefs;
      },

      _getInfoTemplate: function(fLayer, source) {
        var popupTemplate;
        var fieldNames = [];
        array.filter(fLayer.fields, function(field) {
          var fieldName = field.name.toLowerCase();
          if(fieldName.indexOf("shape") < 0 &&
             fieldName.indexOf("objectid") < 0 &&
             //fieldName.indexOf("globalid") < 0 &&
             fieldName.indexOf("perimeter") < 0) {
            fieldNames.push(field.name);
          }
        });

        var title =  source.name + ": {" + source.displayField + "}";
        var popupInfo = jimuUtils.getDefaultPopupInfo(fLayer, title, fieldNames);
        if(popupInfo) {
          popupTemplate = new PopupTemplate({
            title: popupInfo.title,
            content: [{
              type: "fields",
              fieldInfos: popupInfo.fieldInfos
            }]
          });
        }
        return popupTemplate;

      },

      destroy: function() {
        utils.setAppConfig(null);
        var popupVm = this.sceneView.popup.viewModel;
        if (popupVm) {
          popupVm.visible = false;
        }
        if (this.searchDijit && this.searchDijit.viewModel) {
          this.searchDijit.viewModel.set('view', null);
          this.searchDijit.viewModel.clear();
        }

        if(this._highlightedFeatureHandle) {
          this._highlightedFeatureHandle.remove();
        }
        this.inherited(arguments);
      },

      _getLayerViewByLayerId: function(layerId) {
        var layerView = this.sceneView.layerViews.find(lang.hitch(this, function(layerView) {
          return layerView.layer.id === layerId;
        }));
        return layerView;
      },


      /*********************************
       * Methods for Events
       * ******************************/

      _onSelectResult: function(e) {
        //jshint unused:false
        var result = e.result;
        if (!(result && result.name)) {
          return;
        }
        var dataSourceIndex = e.sourceIndex;
        //var sourceResults = this.searchResults[dataSourceIndex];
        var dataIndex = 0;
        var resultFeature = e.result.feature;
        var sourceLayerId = e.source.featureLayerId;

        /*
        for (var i = 0, len = sourceResults.length; i < len; i++) {
          if (jimuUtils.isEqual(sourceResults[i], result)) {
            dataIndex = i;
            break;
          }
        }
        query('li', this.searchResultsNode)
          .forEach(lang.hitch(this, function(li) {
            html.removeClass(li, 'result-item-selected');
            var title = html.getAttr(li, 'title');
            var dIdx = html.getAttr(li, 'data-index');
            var dsIndex = html.getAttr(li, 'data-source-index');

            if (title === result.name &&
              dIdx === dataIndex.toString() &&
              dsIndex === dataSourceIndex.toString()) {
              html.addClass(li, 'result-item-selected');
            }
          }));
        */

        var layerView = this._getLayerViewByLayerId(sourceLayerId);

        if(layerView) {
          var featureQuery = new FeatureQuery();
          featureQuery.where = layerView.layer.objectIdField + " = " +
                                 resultFeature.attributes[layerView.layer.objectIdField];
          featureQuery.outFields = ["*"];
          featureQuery.returnGeometry = true;
          featureQuery.maxAllowableOffset = 0;
          featureQuery.outSpatialReference = this.sceneView.spatialReference;
          layerView.layer.queryFeatures(featureQuery).then(lang.hitch(this, function(results) {
            var resultFeature = results.features[0];
            if(resultFeature) {
              if(this._highlightedFeatureHandle) {
                this._highlightedFeatureHandle.remove();
              }
              this._highlightedFeatureHandle = layerView.highlight(resultFeature);
              /*
              if(this.config.showInfoWindowOnSelect) {
                this.sceneView.popup.close();
                this.sceneView.popup.open({
                  features: [resultFeature],
                });
              }
              */
            }
          }));
        }
        if(e.source.featurelayerGeometryType === "point" && e.source.zoomScale) {
          this.sceneView.goTo({scale: e.source.zoomScale});
        }
      },

      _onSearchComplete: function() {
      },


      onReceiveData: function(name, widgetId, data) {
        if (name === 'framework' && widgetId === 'framework' && data && data.searchString) {
          this.searchDijit.viewModel.set('value', data.searchString);
          this.searchDijit.viewModel.search();
        }
      },

      setPosition: function() {
        this._resetSearchDijitStyle();
        this.inherited(arguments);
      },

      resize: function() {
        this._resetSearchDijitStyle();
      },

      _onSourceIndexChange: function() {
        if (this.searchDijit.viewModel.value) {
          this.searchDijit.viewModel.search(this.searchDijit.viewModel.value);
        }
      },

      _onSuggestResults: function() {
        this._resetSelectorPosition('.searchMenu');

        this._hideResultMenu();
      },

      _onClearSearch: function() {
        html.setStyle(this.searchResultsNode, 'display', 'none');
        this.searchResultsNode.innerHTML = "";
        this.searchResults = null;
        this.sceneView.popup.close();
        if(this._highlightedFeatureHandle) {
          this._highlightedFeatureHandle.remove();
        }
      },

      /***********************************
       * Mehtods for control result menu
       * *********************************/

      /*
          this.own(
            on(this.searchDijit.viewModel, 'search-results', lang.hitch(this, '_onSearchComplete'))
          );

      _onSearchResults: function(evt) {
        var sources = this.searchDijit.viewModel.get('sources');
        var activeSourceIndex = this.searchDijit.viewModel.get('activeSourceIndex');
        var value = this.searchDijit.viewModel.get('value');
        var htmlContent = "";
        var results = evt.results;
        var _activeSourceNumber = null;
        if (results && evt.numResults > 0) {
          //html.removeClass(this.searchDijit._containerNode, 'showSuggestions');
          html.removeClass(this.searchDijit.container, 'esri-search--show-suggestions');

          this.searchResults = results;
          htmlContent += '<div class="show-all-results jimu-ellipsis" title="' +
            this.nls.showAll + '">' +
            this.nls.showAllResults + '<strong >' + value + '</strong></div>';
          htmlContent += '<div class="searchMenu esri-menu" role="menu">';
          for (var i in results) {
            if (results[i] && results[i].length) {
              var name = sources[parseInt(i, 10)].name;
              if (sources.length > 1 && activeSourceIndex === 'all') {
                htmlContent += '<div title="' + name + '" class="menu-header">' + name + '</div>';
              }
              htmlContent += "<ul>";
              var partialMatch = value;
              var r = new RegExp("(" + partialMatch + ")", "gi");
              var maxResults = sources[i].maxResults;

              for (var j = 0, len = results[i].length; j < len && j < maxResults; j++) {
                var text = jimuUtils.isDefined(results[i][j].name) ?
                  results[i][j].name : this.nls.untitled;

                htmlContent += '<li title="' + text + '" data-index="' + j +
                  '" data-source-index="' + i + '" role="menuitem" tabindex="0">' +
                  text.toString().replace(r, "<strong >$1</strong>") + '</li>';
              }
              htmlContent += '</url>';

              if (evt.numResults === 1) {
                _activeSourceNumber = i;
              }
            }
          }
          htmlContent += "</div>";
          this.searchResultsNode.innerHTML = htmlContent;

          this._showResultMenu();

          this._resetSelectorPosition('.searchMenu');
        } else {
          this._onClearSearch();
        }
      },

    */

      _onSearchDijitClick: function() {
        this._resetSelectorPosition('.esri-source-menu');
      },

      _resetSelectorPosition: function(cls) {
        var layoutBox = html.getMarginBox(window.jimuConfig.layoutId);
        query(cls, this.domNode).forEach(lang.hitch(this, function(menu) {
          var menuPosition = html.position(menu);
          var sc = lang.getObject('viewModel.sources.length', false, this.searchDijit);
          if (sc > 1 && cls === '.esri-source-menu') {
            var li = query(cls + ' li[data-index]', this.domNode)[0];
            var itemHeight = jimuUtils.isDefined(li) ? html.getMarginBox(li).h : 30;
            menuPosition.h = itemHeight * (sc + 1);
          }
          if (html.getStyle(menu, 'display') === 'none') {
            return;
          }
          var dijitPosition = html.position(this.searchDijit.domNode);
          var up = dijitPosition.y - 2;
          var down = layoutBox.h - dijitPosition.y - dijitPosition.h;
          if ((down > menuPosition.y + menuPosition.h) || (up > menuPosition.h)) {
            html.setStyle(
              menu,
              'top',
              (
                (down > menuPosition.y + menuPosition.h) ?
                dijitPosition.h : -menuPosition.h - 2
              ) + 'px'
            );
          } else {
            html.setStyle(menu, 'height', Math.max(down, up) + 'px');
            html.setStyle(menu, 'top', (down > up ? dijitPosition.h : -up - 2) + 'px');
          }
        }));
      },

      _onSelectSearchResult: function(evt) {
        var target = evt.target;
        while(!(html.hasAttr(target, 'data-source-index') && html.getAttr(target, 'data-index'))) {
          target = target.parentNode;
        }
        var result = null;
        var dataSourceIndex = html.getAttr(target, 'data-source-index');
        var dataIndex = parseInt(html.getAttr(target, 'data-index'), 10);
        // var sources = this.searchDijit.get('sources');

        if (dataSourceIndex !== 'all') {
          dataSourceIndex = parseInt(dataSourceIndex, 10);
        }
        if (this.searchResults && this.searchResults[dataSourceIndex] &&
          this.searchResults[dataSourceIndex][dataIndex]) {
          result = this.searchResults[dataSourceIndex][dataIndex];
          this.searchDijit.viewModel.select(result);
        }
      },

      _hideResultMenu: function() {
        query('.show-all-results', this.searchResultsNode).style('display', 'block');
        query('.searchMenu', this.searchResultsNode).style('display', 'none');
      },

      _showResultMenu: function() {
        html.setStyle(this.searchResultsNode, 'display', 'block');
        query('.show-all-results', this.searchResultsNode).style('display', 'none');
        query('.searchMenu', this.searchResultsNode).style('display', 'block');

        var groupNode = query('.esri-input-container', this.searchDijit.domNode)[0];
        if (groupNode) {
          var groupBox = html.getMarginBox(groupNode);
          var style = {
            width: groupBox.w + 'px'
          };
          if (window.isRTL) {
            var box = html.getMarginBox(this.searchDijit.domNode);
            style.right = (box.w - groupBox.l - groupBox.w) + 'px';
          } else {
            style.left = groupBox.l + 'px';
          }
          query('.show-all-results', this.searchResultsNode).style(style);
          query('.searchMenu', this.searchResultsNode).style(style);
        }
      },

      _resetSearchDijitStyle: function() {
        // return;
        // html.removeClass(this.domNode, 'use-absolute');
        // if (this.searchDijit && this.searchDijit.domNode) {
        //   html.setStyle(this.searchDijit.domNode, 'width', 'auto');
        // }

        // setTimeout(lang.hitch(this, function() {
        //   if (this.searchDijit && this.searchDijit.domNode) {
        //     // only need width of domNode
        //     // var box = html.getMarginBox(this.domNode);
        //     var box = {
        //       w: parseInt(html.getComputedStyle(this.domNode).width, 10)
        //     };
        //     var sourcesBox = html.getMarginBox(this.searchDijit.sourcesBtnNode);
        //     var submitBox = html.getMarginBox(this.searchDijit.submitNode);
        //     var style = null;
        //     if (box.w) {
        //       html.setStyle(this.searchDijit.domNode, 'width', box.w + 'px');
        //       html.addClass(this.domNode, 'use-absolute');

        //       if (isFinite(sourcesBox.w) && isFinite(submitBox.w)) {
        //         if (window.isRTL) {
        //           style = {
        //             left: submitBox.w + 'px',
        //             right: sourcesBox.w + 'px'
        //           };
        //         } else {
        //           style = {
        //             left: sourcesBox.w + 'px',
        //             right: submitBox.w + 'px'
        //           };
        //         }
        //         var inputGroup = query('.esri-input-container', this.searchDijit.domNode)[0];

        //         if (inputGroup) {
        //           html.setStyle(inputGroup, style);
        //           var groupBox = html.getMarginBox(inputGroup);
        //           // var extents = html.getPadBorderExtents(this.searchDijit.inputNode);
        //           // box-sizzing(content-box) be removed in 4.0 api
        //           html.setStyle(this.searchDijit.inputNode,
        //             'width',
        //             groupBox.w/* - extents.w*/ + 'px');
        //         }
        //       }
        //     }
        //   }
        // }), 50);
      }

    });
  });
