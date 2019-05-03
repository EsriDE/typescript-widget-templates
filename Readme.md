## Web AppBuilder for ArcGIS
# TypeScript Widget Templates
This repository provides setup instructions and starting points to develop widgets with TypeScript for applications based on the ArcGIS API for JavaScript in different versions, with or without the ArcGIS Web AppBuilder.

## Getting started
### Installation
Checkout repository and execute ```npm install``` to install necessary node packages.

### First Build
You should already see .JS and .JS.MAP files generated from your .TS file after running the first build: ```Ctrl-Shift B```

That's it. You should be good to go. The main build task has been defined in ```./vscode/tasks.json```. I points to a Gulp task called ```watchCompileDeploy```, which 
* builds the TypeScript files
* copies them over into the demo applications in the ```docs``` folder 
* starts BrowserSync to serve from the root directory
* starts a file watcher to build and deploy on every change


## Further information

This is just background info. You don't need to perform the steps below to have a running demo application.

### Random notes
* We recommend using [Visual Studio Code](https://code.visualstudio.com).
* If tasks from .vscode/tasks.json are not found after "npm install", please restart VS Code.
* gulp.dest() at the end of the compileTs job puts files into one specific folder. To keep the original relative folder structure, you have to put ```"rootDir": ""``` and ```"outDir": ""``` in your tsconfig. 


### TypeScript definitions
Definitions are interfaces of each referenced class that the TypeScript compiler uses to enable Intellisense in your IDE. Definitions for many well-known frameworks have been collected in on https://github.com/DefinitelyTyped/DefinitelyTyped. They can be downloaded and manually put into the project or installed via NPM as described below.

#### Loading TypeScript definitions
Just FYI. You don't need to do this. It's all included in our package.json and automatically installed when you run ```npm install```.

https://github.com/Esri/jsapi-resources/tree/master/3.x/TypeScript  
**npm install @types/arcgis-js-api@3**  
https://github.com/Esri/jsapi-resources/tree/master/4.x/TypeScript  
**npm install @types/arcgis-js-api@4**  

Type definitions for Dojo v1.9  
Project: http://dojotoolkit.org  
Definitions by: Michael Van Sickle <https://github.com/vansimke>  
Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped  
**npm install @types/dojo**  



### Recommended steps to start your first project
When starting your own project, we recommend the following steps:

#### Install Visual Studio Code
From there, navigate to your project folder to be and open the terminal.

#### Initialize NPM
When you do this, a package.json file will be created that will contain references to the packages you install. In the future, you just need to run ```npm install``` to download all dependencies. You'll have to answer a couple of questions first:
```
npm init
```

#### Install latest TypeScript Compiler
```
npm install -g typescript
```

#### Initialize TypeScript Project
This creates tsconfig.json:
```
tsc -init
```

For ArcGIS API for JavaScript applications, please modify your **tsconfig.json** like this:
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
In case you need source control, we recommend to start up a new GIT repository in your project folder.
```
git init
```

#### Create browser-readable project
If you're developing a Web AppBuilder for ArcGIS widget, you don't want to check in the WAB itself but just your widget code. The problem is now: You don't have an executable project in your repository. To see the results, you must take your widget code and place it into an app. You can use our gulp deployment task for that, as we do with the "demo" application in this repo.

#### Sample TS Coding
```
import Map = require("esri/map");
let m = new Map("mapDiv", {
    basemap: "streets",
    center: [10, 54],
    zoom: 8
});
```