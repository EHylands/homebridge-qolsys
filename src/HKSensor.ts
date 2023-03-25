import { Service, PlatformAccessory } from 'homebridge';
import { QolsysZoneStatus} from './QolsysZone';
import { HKSensorType, HBQolsysPanel} from './platform';

export abstract class HKSensor {
  protected service: Service;
  protected LastEvent: Date;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected readonly accessory: PlatformAccessory,
    protected readonly ZoneId: number,
    protected readonly SensorType: HKSensorType,
  ) {

    this.SensorType = SensorType;
    this.service = this.GetService();
    this.platform.log.info('Zone'+ this.ZoneId + ' (' + SensorType + '): ' + accessory.displayName);
    this.LastEvent = new Date();
  }

  abstract GetService(): Service;
  abstract HandleEventDetected(ZoneStatus: QolsysZoneStatus);

  protected EventDelayNeeded():number{

    if(!this.platform.SensorDelay){
      this.platform.log.debug('No delay to Homekit');
      return 0;
    }

    const Delta = new Date().getTime() - this.LastEvent.getTime();

    if(Delta < 1000){
      this.platform.log.debug('Introducing 2 sec delay to Homekit');
      return 2000;
    }

    this.platform.log.debug('No delay to Homekit');
    return 0;
  }
}