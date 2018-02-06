# TypeScript Widget Templates
This repository provides setup instructions and starting points to develop widgets with TypeScript for applications based on the ArcGIS API for JavaScript in different versions, with or without the ArcGIS Web AppBuilder.

### Set up Visual Studio Code:

#### Install latest Typescript Compiler
```
npm install -g typescript
```
#### Initialize Typescript Project
(creates tsconfig.json)
```
tsc -init
```
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
    "strictNullChecks": true
  },
  "exclude" : ["node_modules"]
}
```

#### Initialize GIT
```
git init
```
#### First Build
```
Ctrl-Shift B
```

#### Load typescript definitions
https://github.com/Esri/jsapi-resources/tree/master/3.x/typescript  
**npm install --save @types/arcgis-js-api@3**  
https://github.com/Esri/jsapi-resources/tree/master/4.x/typescript  
**npm install --save @types/arcgis-js-api@4**  

Type definitions for Dojo v1.9  
Project: http://dojotoolkit.org  
Definitions by: Michael Van Sickle <https://github.com/vansimke>  
Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped  
**npm install --save @types/dojo**  

#### Sample Coding:
```
import Map = require("esri/map")
let m = new Map("mapDiv", {
    basemap: "streets",
    center: [10, 54],
    zoom: 8
});
```