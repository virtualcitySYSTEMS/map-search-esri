# Esri Search Plugin

Extends search widget using Locator ArcGIS Rest API

## Configuration:

| Property         | Type                   | State    | Description                                                                                                                                                                                  |
| ---------------- | ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`            | string                 | required | URL of the search service                                                                                                                                                                    |
| `addressMapping` | Record<string, string> | required | Mapping the [ESRI Geocoding attributes](https://desktop.arcgis.com/en/arcmap/latest/manage-data/geocoding/geocoding-a-table-of-addresses-about.htm) to the VC Map Address Balloon attributes |
| `maxLocations`   | string                 | optional | The Maximum number of results                                                                                                                                                                |
| `zoomDistance`   | number                 | optional | The distance to use, when flying to the result                                                                                                                                               |

Example:

```json
{
  "url": "https://service.foo.bar/arcgis/rest/services/Locator/locator_foo/GeocodeServer",
  "addressMapping": {
    "addressName": "Match_addr"
  },
  "maxLocations": 6,
  "zoomDistance": 240
}
```

For internal testing, you can find an example `vcm.config.js` to use with the given config in [the wiki](https://gitlab.virtualcitysystems.de/vcsuite/npm/vcmap/search-esri/-/wikis/home).
