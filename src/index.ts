import { PluginConfigEditor, VcsPlugin, VcsUiApp } from '@vcmap/ui';
import { name, version, mapVersion } from '../package.json';
import EsriSearch, { PluginConfig } from './esriSearch.js';
import ConfigEditor from './ConfigEditor.vue';
import getDefaultOptions from './defaultOptions.js';

export default function esriSearchPlugin(
  config: PluginConfig,
): VcsPlugin<PluginConfig, Record<never, never>> {
  let app: VcsUiApp;
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
      app = vcsUiApp;
      // eslint-disable-next-line
      // @ts-ignore
      vcsUiApp.search.add(new EsriSearch(vcsUiApp, config), name);
    },
    getDefaultOptions,
    toJSON(): PluginConfig {
      const defaultOptions = getDefaultOptions();
      const options: PluginConfig = {
        url: config.url,
        addressMapping: config.addressMapping,
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
            title: 'ESRI Search Editor',
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
            title: 'ESRI-Suche Editor',
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
    getConfigEditors(): PluginConfigEditor<object>[] {
      return [
        {
          component: ConfigEditor,
          title: 'searchEsri.configEditor.title',
          infoUrlCallback: app?.getHelpUrlCallback(
            '/components/plugins/searchToolConfig.html#id_searchEsriConfig',
            'app-configurator',
          ),
        },
      ];
    },
  };
}
