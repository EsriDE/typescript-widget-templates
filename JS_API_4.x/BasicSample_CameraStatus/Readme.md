# Basic Sample: Camera Status

### Description
This sample shows the concepts of the widget lifecycle, JSX integration and TypeScript decorators. It watches the "camera" property of a SceneView and renders the current camera parameters to the screen.

### HowTo:
1. In your app code, require the widget code:
```
import CameraStatus = require("./cameraStatus");
```
2. Initialize the widget object and add it to the view's UI:
```
var cameraStatus = new CameraStatus({
    sceneView: sceneView
});
sceneView.ui.add(cameraStatus, "top-right");
```

### Compatibility
Created and tested for 3D apps made with JS API 4.5

### Dependencies
Needs a SceneView object.

#### Other Widgets
None.

#### Services and Data
None. 
