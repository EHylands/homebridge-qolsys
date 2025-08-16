import { Service } from 'homebridge';
import { HKSensor } from './HKSensor.js';
import { QolsysZoneStatus } from './QolsysZone.js';
import { HKSensorType, HBQolsysPanel } from './platform.js';

export class HKContactSensor extends HKSensor {

  private service: Service;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected ZoneId: number,
    protected readonly Name:string,
    protected readonly UUID:string,

  ) {
    super(platform, ZoneId, HKSensorType.ContactSensor, Name, UUID);

    // set accessory information
    this.Accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Model, 'HK Contact Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    this.service = this.Accessory.getService(this.platform.Service.ContactSensor)
    || this.Accessory.addService(this.platform.Service.ContactSensor);
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){

    const ContactDetected = ZoneStatus === QolsysZoneStatus.CLOSED;

    if(ContactDetected){
      setTimeout(() => {
        this.service.getCharacteristic(this.platform.Characteristic.ContactSensorState)
          .updateValue(this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED);
        this.LastEvent = new Date();

      }, this.EventDelayNeeded());

    } else{
      setTimeout(() => {
        this.service.getCharacteristic(this.platform.Characteristic.ContactSensorState)
          .updateValue(this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED);
        this.LastEvent = new Date();
      }, this.EventDelayNeeded());
    }
  }
}
