## Print ##
### Overview ###
The Print widget works with the PrintTask class, which generates a printer-ready version of the map through the new ExportWebMap server task in ArcGIS 10.1 and up. Configure this task with the custom layout templates. It also provides a set of output types, such as PDF, PNG, and SVG. The ExportWebMap server task works by taking the current map to define display content, extent, and symbology.

### Attributes ###
* `serviceURL`: String. There is no default. This is the URL to the Export Web Map Task REST endpoint (for example,  http://<servername>/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task). You can change the URL to your own Export Web Map Task (requires ArcGIS 10.1 and up for Server).
* `defaultTitle`: String. There is no default. This is the default title for the printed output.
* `defaultAuthor`: String. There is no default. This is the default author of the printed output.
* `defaultCopyright`: String. There is no default. This is the default copyright of the printed output.
* `defaultFormat`: String. There is no default. This is the default format of the printed output.
* `defaultLayout`: String. There is no default. This is the default layout of the printed output.

  Example:
```
{
  "serviceURL": "//utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
  "defaultTitle": "ArcGIS WebMap",
  "defaultAuthor": "",
  "defaultCopyright": "",
  "defaultFormat": "PDF",
  "defaultLayout": "Letter ANSI A Landscape"
}
```
