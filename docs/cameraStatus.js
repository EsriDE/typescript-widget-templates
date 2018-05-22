var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "esri/widgets/Widget", "esri/views/SceneView", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget"], function (require, exports, Widget, SceneView, decorators_1, widget_1) {
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
            var classes = (_a = {},
                _a[CSS.base] = true,
                _a[CSS.esrideCameraStatus] = true,
                _a);
            return (widget_1.tsx("div", { bind: this, class: CSS.base, classes: classes },
                "Field of view: ",
                this.fieldOfView.toFixed(2),
                widget_1.tsx("br", null),
                "Heading: ",
                this.heading.toFixed(2),
                widget_1.tsx("br", null),
                "Tilt: ",
                this.tilt.toFixed(2),
                widget_1.tsx("br", null),
                "Latitude: ",
                this.latitude.toFixed(2),
                widget_1.tsx("br", null),
                "Longitude: ",
                this.longitude.toFixed(2),
                widget_1.tsx("br", null),
                "Altitude: ",
                this.altitude.toFixed(2),
                widget_1.tsx("br", null)));
            var _a;
        };
        __decorate([
            decorators_1.property(),
            __metadata("design:type", SceneView)
        ], CameraStatus.prototype, "_sceneView", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable(),
            __metadata("design:type", Number)
        ], CameraStatus.prototype, "fieldOfView", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable(),
            __metadata("design:type", Number)
        ], CameraStatus.prototype, "heading", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable(),
            __metadata("design:type", Number)
        ], CameraStatus.prototype, "tilt", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable(),
            __metadata("design:type", Number)
        ], CameraStatus.prototype, "latitude", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable(),
            __metadata("design:type", Number)
        ], CameraStatus.prototype, "longitude", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable(),
            __metadata("design:type", Number)
        ], CameraStatus.prototype, "altitude", void 0);
        CameraStatus = __decorate([
            decorators_1.subclass("esride.widgets.CameraStatus"),
            __metadata("design:paramtypes", [Object])
        ], CameraStatus);
        return CameraStatus;
    }(decorators_1.declared(Widget)));
    return CameraStatus;
});
//# sourceMappingURL=cameraStatus.js.map