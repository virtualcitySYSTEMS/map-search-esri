import { PluginConfigEditor, VcsPlugin, VcsUiApp } from '@vcmap/ui';
import { Component } from 'vue';
import { name, version, mapVersion } from '../package.json';
import EsriSearch, { PluginConfig } from './esriSearch.js';
import ConfigEditor from './ConfigEditor.vue';
import getDefaultOptions from './defaultOptions.js';

export default function esriSearchPlugin(
  config: PluginConfig,
): VcsPlugin<Record<never, never>, Record<never, never>> {
  return {
    get name(): string {
      return name;
    },
    get version(): string {
      return version;
    },
    get mapVersion(): string {
      return mapVersion;
    },
    initialize(vcsUiApp: VcsUiApp): void {
      // eslint-disable-next-line
      // @ts-ignore
      vcsUiApp.search.add(new EsriSearch(vcsUiApp, config), name);
    },
    getDefaultOptions,
    toJSON(): PluginConfig {
      const defaultOptions = getDefaultOptions();
      const options: PluginConfig = {
        url: config.url ? config.url : defaultOptions.url,
        addressMapping: config.addressMapping
          ? config.addressMapping
          : defaultOptions.addressMapping,
      };
      if (
        config.maxLocations &&
        config.maxLocations !== defaultOptions.maxLocations
      ) {
        options.maxLocations = config.maxLocations;
      }
      if (
        config.zoomDistance &&
        config.zoomDistance !== defaultOptions.zoomDistance
      ) {
        options.zoomDistance = config.zoomDistance;
      }
      return options;
    },
    i18n: {
      en: {
        searchEsri: {
          configEditor: {
            params: {
              maxLocations: 'Maximum number of results',
              zoomDistance: 'Zoom Distance',
            },
            addressMapping: 'Address Attribute Mapping',
            isRequired: 'Input is required',
          },
        },
      },
      de: {
        searchEsri: {
          configEditor: {
            params: {
              maxLocations: 'Maximale Anzahl Resultate',
              zoomDistance: 'Zoom Distance',
            },
            addressMapping: 'Adressattribute Abbildung',
            isRequired: 'Eingabe ist erforderlich',
          },
        },
      },
    },
    getConfigEditors(): PluginConfigEditor[] {
      return [{ component: ConfigEditor as Component & { title: string } }];
    },
  };
}
