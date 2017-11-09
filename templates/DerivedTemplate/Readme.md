# Derived Widget Template 

## Description
The template widget shows how to derive from a ESRI widget. 

## HowTo:
1. Copy original "widget.js" to "<AnyName>Widget.js"
2. Start coding in your "Widget.ts" file
3. Create links to the Web AppBuilder stemapp (and to you app path):  

```
// You need to be admin to execute the following lines:
mklink /d <WAB Path>\client\stemapp\widgets\DerivedTemplate <Dev Path>\Widgets\DerivedTemplate 
mklink /d <WAB Path>\server\apps\3\widgets\DerivedTemplate <Dev Path>\Widgets\DerivedTemplate 
```

## Golden rules:
- Do not edit the Widget.html. If you need additional HTML elements, add them via code (domConstruct.create etc.)
- Only add "@import" to the original CSS file and save your modifications to your own CSS.
- Use the ReadmeTemplate.md in this sample as a template for your Readme.md. Every widget should have a Readme.md!


## Compatibility
Created and tested for Web AppBuilder 2.4, 2.5 and 2.6

## Dependencies

### Other Widgets
None.

### Services and Data
None. 
