import { PluginConfig } from './esriSearch.js';

export default function getDefaultOptions(): PluginConfig {
  return {
    url: '',
    addressMapping: {
      addressName: 'address',
    },
    maxLocations: 6,
    zoomDistance: 240,
  };
}
