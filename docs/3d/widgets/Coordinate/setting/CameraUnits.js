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
define(
  ['dojo/_base/declare',
    //'dojo/_base/lang',
    'dojo/_base/html',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./CameraUnits.html',
    //"jimu/SpatialReference/srUtils",
    'dijit/form/Select'
  ],
  function (
    declare,
    //lang,
    html,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    template
    //utils
  ) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      templateString: template,

      postCreate: function () {
        this.inherited(arguments);

        this.titleNode.innerHTML = this.title;
        html.setAttr(this.titleNode, "title", this.title);

        html.setAttr(this.fieldset, "id", this.id);

        html.setAttr(this.metric, "name", this.id);
        html.setAttr(this.metric, "id", this.id + "-metric");
        html.setAttr(this.metricLabel, "for", this.id + "-metric");

        html.setAttr(this.english, "name", this.id);
        html.setAttr(this.english, "id", this.id + "-english");
        html.setAttr(this.englishLabel, "for", this.id + "-english");
      },

      setConfig: function (unit) {
        if (!unit) {
          unit = "metric";
        }

        this._selectItem(unit);
      },

      getConfig: function () {
        var unit = "";
        if (this.metric.get("checked")) {
          unit = "metric";
        } else if (this.english.get("checked")) {
          unit = "english";
        }

        return unit;
      },

      _selectItem: function (name) {
        if (this[name] && this[name].setChecked) {
          this[name].setChecked(true);
        }
      }
    });
  });