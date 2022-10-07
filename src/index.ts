import { API } from 'homebridge';
import { PLATFORM_NAME } from './settings';
import { HBQolsysPanel } from './platform';

export = (api: API) => {
  api.registerPlatform(PLATFORM_NAME, HBQolsysPanel);
};
