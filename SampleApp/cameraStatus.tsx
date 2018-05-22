import Widget = require("esri/widgets/Widget");
import SceneView = require("esri/views/SceneView");
import Accessor = require("esri/core/Accessor");
import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import { renderable, tsx } from "esri/widgets/support/widget";

const CSS = {
    base: "esri-widget",
    esrideCameraStatus: "esride-camera-status"
  };

interface CameraStatusParams {
    sceneView: SceneView;
}

@subclass("esride.widgets.CameraStatus")
class CameraStatus extends declared(Widget) {

    @property()
    _sceneView: SceneView;

    @property()
    @renderable()
    fieldOfView: number = 0;

    @property()
    @renderable()
    heading: number = 0;

    @property()
    @renderable()
    tilt: number = 0;

    @property()
    @renderable()
    latitude: number = 0;

    @property()
    @renderable()
    longitude: number = 0;

    @property()
    @renderable()
    altitude: number = 0;

    constructor(params: CameraStatusParams) {
        super();
        this._sceneView = params.sceneView;

        this._sceneView.watch("camera", () => {
            this.fieldOfView = this._sceneView.camera.fov;
            this.heading = this._sceneView.camera.heading;
            this.tilt = this._sceneView.camera.tilt;
            if (this._sceneView.camera.position.latitude) this.latitude = this._sceneView.camera.position.latitude;
            if (this._sceneView.camera.position.longitude) this.longitude = this._sceneView.camera.position.longitude;
            this.altitude = this._sceneView.camera.position.z;
        })
      }

    render() {
        const classes = {
            [CSS.base]: true,
            [CSS.esrideCameraStatus]: true
        };
        return (
            <div bind={this}
                class={CSS.base}
                classes={classes}>
                Field of view: {this.fieldOfView.toFixed(2)}<br/>
                Heading: {this.heading.toFixed(2)}<br/>
                Tilt: {this.tilt.toFixed(2)}<br/>
                Latitude: {this.latitude.toFixed(2)}<br/>
                Longitude: {this.longitude.toFixed(2)}<br/>
                Altitude: {this.altitude.toFixed(2)}<br/>
            </div>
        );    
    }
}

export = CameraStatus;