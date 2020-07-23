define([
    'dojo/_base/declare',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/dom-geometry',
    'dojo/_base/lang',
    'jimu/BaseWidget',
    './PrintPlus',
    'widgets/_WidgetOpacityMixin/widget'  //lcs - Widget Opacity
  ],
  function(declare, domConstruct, domStyle, domGeometry, lang, BaseWidget, Print, _WidgetOpacityMixin) {
    return declare([BaseWidget, _WidgetOpacityMixin], {
      baseClass: 'jimu-widget-printplus',
      name: 'Print Plus',
      className: 'esri.widgets.Print',
      postCreate: function() {
        this.inherited(arguments);
        this.print = new Print({
          map: this.map,
          printTaskURL: this.config.serviceURL,
          defaultAuthor: this.config.defaultAuthor,
          defaultCopyright: this.config.defaultCopyright,
          defaultTitle: this.config.defaultTitle,
          defaultFormat: this.config.defaultFormat,
          defaultLayout: this.config.defaultLayout,
          defaultDpi: this.config.defaultDpi || 96,
          noTitleBlockPrefix: this.config.noTitleBlockPrefix,
          layoutParams: this.config.layoutParams,
          relativeScale: this.config.relativeScale,
          relativeScaleFactor: this.config.relativeScaleFactor,
          scalePrecision: this.config.scalePrecision,
          mapScales: this.config.mapScales,
          outWkid: this.config.outWkid,
          showLayout: this.config.showLayout,
          showOpacitySlider: this.config.showOpacitySlider,
          domIdPrefix: this.id,
          nls: this.nls
        }).placeAt(this.printPlusNode);
        this.print.startup();
      },
      onSignIn: function(user) {
        user = user || {};
        if (user.userId) {
          this.print.updateAuthor(user.userId);
        }
      },
      onOpen: function() {
        this.inherited(arguments);
        this.print._onOpen();
      },
      onClose: function() {
        this.inherited(arguments);
        this.print._onClose();
      },
      resize: function() {
        this.inherited(arguments);
        // If the widget docked, its panel will have the same width as the innerWidth of the browser window.
        // Delay for a brief time to allow the panel to attain its full size.
        setTimeout(lang.hitch(this, function() {
          var node = this.getParent().domNode;
          var computedStyle = domStyle.getComputedStyle(node);
          var output = domGeometry.getMarginBox(node, computedStyle);
          var isDocked = Math.abs(window.innerWidth - output.w) <= 1;
          
          this.print._resize(isDocked);
        }), 100);
      },
      // startup: function() {
        // Without this function, onOpen() is not called on startup - only resize().
      // }
    });
  });