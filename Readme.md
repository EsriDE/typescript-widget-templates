# TypeScript Widget Templates
This repository provides setup instructions and starting points to develop widgets with TypeScript for applications based on the ArcGIS API for JavaScript in different versions, with or without the ArcGIS Web AppBuilder.

### Prerequisites:
Install [node.js](https://nodejs.org).
Install [Visual Studio Code](https://code.visualstudio.com).

### Set up Visual Studio Code:

#### Install latest TypeScript Compiler
```
npm install -g typescript
```
#### Initialize TypeScript Project
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

### TypeScript definitions
Definitions are interfaces of each referenced class that the TypeScript compiler uses to enable Intellisense in your IDE. Definitions for many well-known frameworks have been collected in on https://github.com/DefinitelyTyped/DefinitelyTyped. They can be downloaded and manually put into the project or installed via NPM as described below.

#### Load TypeScript definitions
https://github.com/Esri/jsapi-resources/tree/master/3.x/TypeScript  
**npm install @types/arcgis-js-api@3**  
https://github.com/Esri/jsapi-resources/tree/master/4.x/TypeScript  
**npm install @types/arcgis-js-api@4**  

Type definitions for Dojo v1.9  
Project: http://dojotoolkit.org  
Definitions by: Michael Van Sickle <https://github.com/vansimke>  
Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped  
**npm install @types/dojo**  

#### Sample Coding:
```
import Map = require("esri/map")
let m = new Map("mapDiv", {
    basemap: "streets",
    center: [10, 54],
    zoom: 8
});
```