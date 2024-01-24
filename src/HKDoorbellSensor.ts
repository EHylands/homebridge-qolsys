import { Service } from 'homebridge';
import { HKSensor } from './HKSensor';
import { QolsysZoneStatus} from './QolsysZone';
import { HKSensorType, HBQolsysPanel } from './platform';

export class HKDoorbellSensor extends HKSensor {

  private service: Service;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected ZoneId: number,
    protected readonly Name:string,
    protected readonly UUID,

  ) {
    super(platform, ZoneId, HKSensorType.DoorbellSensor, Name, UUID);

    // set accessory information
    this.Accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Model, 'HK Doorbell Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    this.service = this.Accessory.getService(this.platform.Service.Doorbell)
    || this.Accessory.addService(this.platform.Service.Doorbell);
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){
    if(ZoneStatus === QolsysZoneStatus.OPEN){
      this.service.getCharacteristic(this.platform.Characteristic.ProgrammableSwitchEvent).setValue(0);
    }
  }
}
