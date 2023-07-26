import { QolsysZoneStatus} from './QolsysZone';
import { HKSensorType, HBQolsysPanel} from './platform';
import { HKAccessory } from './HKAccessory';

export abstract class HKSensor extends HKAccessory{
  protected LastEvent: Date;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected readonly ZoneId: number,
    protected readonly SensorType: HKSensorType,
    protected readonly Name:string,
    protected readonly UUID,
  ) {
    super(platform, Name, UUID);

    this.SensorType = SensorType;
    this.platform.log.info('Zone'+ this.ZoneId + ' (' + SensorType + '): ' + this.Accessory.displayName);
    this.LastEvent = new Date();
  }

  //abstract GetService(): Service;
  abstract HandleEventDetected(ZoneStatus: QolsysZoneStatus);
  protected EventDelayNeeded():number{

    if(!this.platform.SensorDelay){
      return 0;
    }

    const Delta = new Date().getTime() - this.LastEvent.getTime();

    if(Delta < 1000){
      return 2000;
    }

    this.platform.log.debug('No delay to Homekit');
    return 0;
  }
}