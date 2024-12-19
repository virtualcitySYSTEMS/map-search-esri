import {
  AddressBalloonFeatureInfoView,
  featureInfoViewSymbol,
  VcsUiApp,
  SearchImpl,
  ResultItem,
} from '@vcmap/ui';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import {
  mercatorProjection,
  Projection,
  Viewpoint,
  wgs84Projection,
} from '@vcmap/core';
import { AddressBalloonFeatureInfoViewOptions } from '@vcmap/ui/src/featureInfo/addressBalloonFeatureInfoView';
import { name } from '../package.json';

export type PluginConfig = {
  url: string;
  addressMapping: AddressBalloonFeatureInfoViewOptions;
  zoomDistance?: number;
  maxLocations?: number;
};

type Candidate = {
  address: string;
  location: { x: number; y: number };
  attributes: Record<string, unknown>;
};

class EsriSearch implements SearchImpl {
  app: VcsUiApp;

  url: string;

  addressMapping: AddressBalloonFeatureInfoViewOptions;

  defaultQueryParams: Record<string, unknown>;

  zoomDistance: number;

  private _abortController: AbortController | undefined;

  constructor(app: VcsUiApp, config: PluginConfig) {
    this.app = app;
    this.url = config.url;
    this.addressMapping = config.addressMapping;
    this.defaultQueryParams = {
      outSR: '{ latestWkid: 4326, wkid: 4326 }',
      outFields: '*',
      maxLocations: config.maxLocations ?? 6,
    };
    this.zoomDistance = config.zoomDistance ?? 240;
  }

  // eslint-disable-next-line class-methods-use-this
  get name(): string {
    return name;
  }

  async search(query: string): Promise<ResultItem[]> {
    const params = {
      SingleLineCityName: query,
      f: 'json',
      ...this.defaultQueryParams,
    };
    const url = new URL(
      `${this.url}/findAddressCandidates`,
      window.location.href,
    );
    url.search = new URLSearchParams(params).toString();
    this.abort();
    this._abortController = new AbortController();
    const response = await fetch(url, { signal: this._abortController.signal });
    const results = (await response.json()) as { candidates: Candidate[] };
    return results.candidates.map(this.createResultItem.bind(this));
  }

  async suggest(query: string): Promise<string[]> {
    if (query.length < 3) {
      return [];
    }
    const params = {
      text: query,
      f: 'json',
    };
    const url = new URL(`${this.url}/suggest`, window.location.href);
    url.search = new URLSearchParams(params).toString();
    this.abort();
    this._abortController = new AbortController();
    const response = await fetch(url, { signal: this._abortController.signal });
    const results = (await response.json()) as {
      suggestions: { text: string }[];
    };
    return results.suggestions.map((suggestion) => suggestion.text);
  }

  createResultItem(candidate: Candidate): ResultItem {
    const { location } = candidate;
    const feature = new Feature();
    const pointWGS84 = [Number(location.x), Number(location.y)];
    feature.setGeometry(
      new Point(
        Projection.transform(mercatorProjection, wgs84Projection, pointWGS84),
      ),
    );
    feature.setProperties(candidate.attributes);
    // @ts-expect-error: symbol not properly declared in ui
    feature[featureInfoViewSymbol] = new AddressBalloonFeatureInfoView({
      type: 'AddressBalloonFeatureInfoView',
      name: 'EsriSearchBalloon',
      balloonSubtitle: '',
      ...this.addressMapping,
    } as AddressBalloonFeatureInfoViewOptions);
    return {
      title: candidate.address,
      feature,
      clicked: (): Promise<void> => {
        this.app.maps
          .activeMap!.gotoViewpoint(
            new Viewpoint({
              name: 'viewpointFromExtend',
              distance: this.zoomDistance,
              groundPosition: pointWGS84,
              heading: 360,
              pitch: -90,
              roll: 0,
              animate: true,
            }),
          )
          .catch(() => {});
        return this.app.featureInfo.selectFeature(feature);
      },
    };
  }

  abort(): void {
    this._abortController?.abort();
    this._abortController = undefined;
  }

  destroy(): void {
    this.abort();
  }
}

export default EsriSearch;
