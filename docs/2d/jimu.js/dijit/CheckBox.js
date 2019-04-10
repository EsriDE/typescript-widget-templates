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
  'dijit/_WidgetBase',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/dom-class',
  'dojo/on',
  'dojo/Evented',
  "dojo/keys"
],
function(declare, _WidgetBase, lang, html, domClass, on, Evented, keys) {

  return declare([_WidgetBase, Evented], {
    'baseClass': 'jimu-checkbox',
    declaredClass: 'jimu.dijit.CheckBox',

    checked: false,
    status: true,
    label: "",
    title: "", //it's used for screen reader when no label'

    postCreate: function(){
      this.checkNode = html.create('div', {
        'class': 'checkbox jimu-float-leading jimu-icon jimu-icon-checkbox'
      }, this.domNode);
      this.labelNode = html.create('div', {
        'class': 'label jimu-float-leading',
        innerHTML: this.label || ""
      }, this.domNode);
      if(this.checked){
        html.addClass(this.checkNode, 'checked');
        html.addClass(this.checkNode, 'jimu-icon-checked');
      }
      if(!this.status){
        html.addClass(this.domNode, 'jimu-state-disabled');
        html.addClass(this.checkNode, 'jimu-state-disabled');
      }

      this.own(
        on(this.checkNode, 'click', lang.hitch(this, function(){
          if(this.status){
            if(this.checked){
              this.uncheck();
            }else{
              this.check();
            }
          }
        }))
      );

      this.own(
        on(this.labelNode, 'click', lang.hitch(this, function() {
          if (this.checked && this.status) {
            this.uncheck();
          } else if (this.status) {
            this.check();
          }
        }))
      );
      this._udpateLabelClass();

      this._initSection508();
    },

    setLabel: function(label){
      this.label = label;
      this.labelNode.innerHTML = this.label;
      this.labelNode.title = this.label;
      this._udpateLabelClass();
    },

    _udpateLabelClass: function(){
      if(this.labelNode){
        if(this.labelNode.innerHTML){
          html.removeClass(this.labelNode, 'not-visible');
        }else{
          html.addClass(this.labelNode, 'not-visible');
        }
      }
    },


    _initSection508: function () {
      html.setAttr(this.domNode, 'tabindex', '0');
      if(this.label === ''){
        html.setAttr(this.domNode, 'title', this.title);//read content's string
      }
      html.setAttr(this.domNode, 'role', 'checkbox');
      this._changeAriaCheckedAttr();
      //css class
      this.own(on(this.domNode, 'focus', lang.hitch(this, function () {
        html.addClass(this.checkNode, "dijitCheckBoxFocused");
      })));
      this.own(on(this.domNode, 'blur', lang.hitch(this, function () {
        html.removeClass(this.checkNode, "dijitCheckBoxFocused");
      })));
      //use keydown instead of keypress event, for#14747
      this.own(on(this.domNode, 'keydown', lang.hitch(this, function (evt) {
        var charOrCode = evt.charCode || evt.keyCode;
        if (html.hasClass(this.checkNode, "dijitCheckBoxFocused") &&
          (keys.SPACE === charOrCode || keys.ENTER === charOrCode)) {
          if (this.status) {
            if (this.checked) {
              this.uncheck();
            } else {
              this.check();
            }
          }
        }
      })));
    },

    setValue: function(value){
      if(!this.status){
        return;
      }
      if(value === true){
        this.check();
      }else{
        this.uncheck();
      }
    },

    getValue: function(){
      return this.checked;
    },

    setStatus: function(newStatus){
      newStatus = !!newStatus;

      var isStatusChanged = this.status !== newStatus;

      this.status = newStatus;

      if(this.status){
        domClass.remove(this.domNode, 'jimu-state-disabled');
        html.removeClass(this.checkNode, 'jimu-state-disabled');
      }else{
        domClass.add(this.domNode, 'jimu-state-disabled');
        html.addClass(this.checkNode, 'jimu-state-disabled');
      }

      if(isStatusChanged){
        this.emit('status-change', newStatus);
      }
    },

    getStatus: function(){
      return this.status;
    },

    check: function(notEvent){
      if(!this.status){
        return;
      }
      this.checked = true;
      html.addClass(this.checkNode, 'checked jimu-icon-checked');
      html.removeClass(this.checkNode, 'checked jimu-icon-checkbox');
      if(!notEvent){
        this.onStateChange();
      }
    },

    uncheck: function(notEvent){
      if(!this.status){
        return;
      }
      this.checked = false;
      html.removeClass(this.checkNode, 'checked');
      html.removeClass(this.checkNode, 'jimu-icon-checked');
      html.addClass(this.checkNode, 'jimu-icon-checkbox');

      if(!notEvent){
        this.onStateChange();
      }
    },

    onStateChange: function(){
      if(this.onChange && lang.isFunction(this.onChange)){
        this.onChange(this.checked);
      }
      this.emit('change', this.checked);
      this._changeAriaCheckedAttr();
    },

    _changeAriaCheckedAttr: function(){
      var ariaChecked = this.checked ? 'true' : 'false';
      html.setAttr(this.domNode, 'aria-checked', ariaChecked);
    },

    focus: function () {
      if (this.checkNode && this.checkNode.focus) {
        this.checkNode.focus();
      }
    }
  });
});