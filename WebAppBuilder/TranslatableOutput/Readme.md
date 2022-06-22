# TranslatableOutput

## Description
The widget is the most simple widget without an interactive settings page. 

## HowTo:
1. Start coding in your "Widget.ts" file
2. Create links to the Web AppBuilder stemapp (and to you app path):  

```
// You need to be admin to execute the following lines:
mklink /d <WAB Path>\client\stemapp\widgets\DerivedTemplate <Dev Path>\Widgets\DerivedTemplate 
mklink /d <WAB Path>\server\apps\<your app number>>\widgets\DerivedTemplate <Dev Path>\Widgets\DerivedTemplate 
```

## Golden rules:
- Use the ReadmeTemplate.md in this sample as a template for your Readme.md. Every widget should have a Readme.md!

## Compatibility
Created and tested for 2D apps in Web AppBuilder 2.24

## Dependencies

### Other Widgets
None.

### Services and Data
None. 
