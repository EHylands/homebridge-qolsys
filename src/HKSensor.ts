import { Service, PlatformAccessory } from 'homebridge';
import { QolsysZoneStatus} from './QolsysZone';
import { HKSensorType, HBQolsysPanel} from './platform';

export abstract class HKSensor {
  protected service: Service;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected readonly accessory: PlatformAccessory,
    protected readonly ZoneId: number,
    protected readonly SensorType: HKSensorType,
  ) {

    this.SensorType = SensorType;
    this.service = this.GetService();
    this.platform.log.info('Zone'+ this.ZoneId + ' (' + SensorType + '): ' + accessory.displayName);
  }

  abstract GetService(): Service;
  abstract HandleEventDetected(ZoneStatus: QolsysZoneStatus);
}