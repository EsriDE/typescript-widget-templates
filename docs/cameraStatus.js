/// <reference path="./node_modules/@types/arcgis-js-api/index.d.ts" />
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/widgets/Widget", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget"], function (require, exports, Widget, decorators_1, widget_1) {
    "use strict";
    var CSS = {
        base: "esri-widget",
        esrideCameraStatus: "esride-camera-status"
    };
    var CameraStatus = /** @class */ (function (_super) {
        __extends(CameraStatus, _super);
        function CameraStatus(params) {
            var _this = _super.call(this) || this;
            _this.fieldOfView = 0;
            _this.heading = 0;
            _this.tilt = 0;
            _this.latitude = 0;
            _this.longitude = 0;
            _this.altitude = 0;
            _this._sceneView = params.sceneView;
            _this.fieldOfView = _this._sceneView.camera.fov;
            _this.heading = _this._sceneView.camera.heading;
            _this.tilt = _this._sceneView.camera.tilt;
            if (_this._sceneView.camera.position.latitude)
                _this.latitude = _this._sceneView.camera.position.latitude;
            if (_this._sceneView.camera.position.longitude)
                _this.longitude = _this._sceneView.camera.position.longitude;
            _this.altitude = _this._sceneView.camera.position.z;
            _this._sceneView.watch("camera", function () {
                _this.fieldOfView = _this._sceneView.camera.fov;
                _this.heading = _this._sceneView.camera.heading;
                _this.tilt = _this._sceneView.camera.tilt;
                if (_this._sceneView.camera.position.latitude)
                    _this.latitude = _this._sceneView.camera.position.latitude;
                if (_this._sceneView.camera.position.longitude)
                    _this.longitude = _this._sceneView.camera.position.longitude;
                _this.altitude = _this._sceneView.camera.position.z;
            });
            return _this;
        }
        CameraStatus.prototype.render = function () {
            var _a;
            var classes = (_a = {},
                _a[CSS.base] = true,
                _a[CSS.esrideCameraStatus] = true,
                _a);
            return (<div bind={this} class={CSS.base} classes={classes}>
                Field of view: {this.fieldOfView.toFixed(2)}<br />
                Heading: {this.heading.toFixed(2)}<br />
                Tilt: {this.tilt.toFixed(2)}<br />
                Latitude: {this.latitude.toFixed(2)}<br />
                Longitude: {this.longitude.toFixed(2)}<br />
                Altitude: {this.altitude.toFixed(2)}<br />
            </div>);
        };
        __decorate([
            decorators_1.property()
        ], CameraStatus.prototype, "_sceneView", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], CameraStatus.prototype, "fieldOfView", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], CameraStatus.prototype, "heading", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], CameraStatus.prototype, "tilt", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], CameraStatus.prototype, "latitude", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], CameraStatus.prototype, "longitude", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], CameraStatus.prototype, "altitude", void 0);
        CameraStatus = __decorate([
            decorators_1.subclass("esride.widgets.CameraStatus")
        ], CameraStatus);
        return CameraStatus;
    }(decorators_1.declared(Widget)));
    return CameraStatus;
});
//# sourceMappingURL=cameraStatus.js.map