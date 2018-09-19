# TypeScript Widget Templates
This repository provides setup instructions and starting points to develop widgets with TypeScript for applications based on the ArcGIS API for JavaScript in different versions, with or without the ArcGIS Web AppBuilder.

### Prerequisites:
Install [node.js](https://nodejs.org).
Install [Visual Studio Code](https://code.visualstudio.com).

### Notes for Gulp documentation:
* If tasks from tasks.json are not found after "npm install", please restart VS Code.

### Random notes
* gulp.dest() at the end of the compileTs job puts files into one specific folder. To keep the original relative folder structure, you have to put ```"rootDir": ""``` and ```"outDir": ""``` in your tsconfig. 

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

#### First Build
You should already see .JS and .JS.MAP files generated from your .TS file after running the first build:
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

### Recommended steps to start your first project (optional)
When starting your own project, we recommend the following steps:

#### Initialize GIT
In case you need source control, we recommend to start up a new GIT repository in your project folder.
```
git init
```
#### Create browser-readable project
As the code in the "JS_API_4.x" and "WebAppBuilder" folders is not embedded into a project that is browser-readable, you should take the desired widget code and place it into your own project. In case you just want to see the simple 4.x "CameraStatus" widget in action, you're free to use the small sample app in the "docs" folder, which is live under https://esride.github.io/typescript-widget-templates/.

### Sample Coding
```
import Map = require("esri/map")
let m = new Map("mapDiv", {
    basemap: "streets",
    center: [10, 54],
    zoom: 8
});
```