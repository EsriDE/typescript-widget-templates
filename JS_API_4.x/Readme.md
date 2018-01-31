# TypeScript Widgets for ArcGIS API for JavaScript 4.x

### Description
This folder contains templates for TypeScript Widgets designed for applications based on plain ArcGIS API for JavaScript 4.x.

### Enabling JSX and decorators in the TypeScript compiler
Please modify your **tsconfig.json** like this:
```
{
  "compileOnSave": true,
  "compilerOptions": {
    "target": "es5",
    "module": "amd",
    "sourceMap": true,
    "watch": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "jsx": "react",
    "jsxFactory": "tsx",
    "suppressImplicitAnyIndexErrors": true
  },
  "exclude" : ["node_modules"]
}
```

### Contents
#### Basic Sample: Camera Status
This sample shows the concepts of the widget lifecycle, JSX integration and TypeScript decorators. It watches the "camera" property of a SceneView and renders the current camera parameters to the screen.
