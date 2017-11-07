# Workflow Widget

## Description

The Workflow Widget provides a guided workflow through several work steps to reduce human error. The basic idea is to use standard widgets for standard functionality (like Select or Edit) instead of implementing that functionality in the Workflow Widget itself.
Avoid instantiation conflicts, e.g. several div boxes with same IDs.

## Compatibility

Tested on Web AppBuilder versions 2.4 and 2.5.

## Dependencies

### Other Widgets

Sends events to control the widgets RemoteSelect and RemoteEdit.

### Services and Data

* All layers need to be in a WebMap.
* Buffer functionality needs a point layer. The layerId that appears in the WebMap has to be stored in the Widget config.
* Edit polygons functionality needs a polygon layer. The layerId that appears in the WebMap has to be stored in the Widget config.