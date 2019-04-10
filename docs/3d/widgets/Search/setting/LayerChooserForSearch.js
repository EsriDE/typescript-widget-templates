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
  'dojo/Deferred',
  'dojo/_base/html',
  'dojo/_base/lang',
  'for3dSetting/FeaturelayerChooserFromMap3d'
],
function(declare, Deferred, html, lang, FeaturelayerChooserFromMap3d) {
  //jshint unused:false
  return declare([FeaturelayerChooserFromMap3d], {
    declaredClass: 'jimu.dijit.FeaturelayerChooserFromMap3d',

    _featureLayerFilter: function(layer) {
      var def = new Deferred();
      var queryable = this.mustSupportQuery ? this._isQueryable(layer) : true;
      if(layer && layer.type === "feature" && queryable) {
        def.resolve();
      } else if(layer && layer.type === "scene") {
        layer.queryFeatures().then(lang.hitch(this, function() {
          def.resolve();
        }), lang.hitch(this, function() {
          def.reject();
        }));
      } else {
        def.reject();
      }
      return def;
    }

  });
});
