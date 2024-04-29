import {
  AddressBalloonFeatureInfoView,
  featureInfoViewSymbol,
  VcsUiApp,
} from '@vcmap/ui';
import { ResultItem, SearchImpl } from '@vcmap/ui/src/search/search';
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore, need fix of the returned type in core api
  async search(query: string): Array<ResultItem> {
    const params = {
      SingleLineCityName: query,
      f: 'json',
      ...this.defaultQueryParams,
    };
    const url = new URL(`${this.url}/findAddressCandidates`);
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url);
    const results = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
    return results.candidates.map(this.createResultItem.bind(this));
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
    // eslint-disable-next-line
    // @ts-ignore
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

  // eslint-disable-next-line class-methods-use-this
  abort(): void {}

  // eslint-disable-next-line class-methods-use-this
  destroy(): void {}
}

export default EsriSearch;
