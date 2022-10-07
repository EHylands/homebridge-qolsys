import { Service, PlatformAccessory } from 'homebridge';
import { HKSensor } from './HKSensor';
import { QolsysController} from './QolsysController';
import { QolsysZoneStatus} from './QolsysZone';
import { HKSensorType, HBQolsysPanel } from './platform';

export class HKContactSensor extends HKSensor {

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected readonly accessory: PlatformAccessory,
    readonly ZoneId: number,
  ) {

    super(platform, accessory, ZoneId, HKSensorType.ContactSensor);

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Qolsys Panel')
      .setCharacteristic(this.platform.Characteristic.Model, 'HK Contact Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.displayName);
  }

  GetService():Service{
    return this.accessory.getService(this.platform.Service.ContactSensor)
    || this.accessory.addService(this.platform.Service.ContactSensor);
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){

    const ContactDetected = ZoneStatus === QolsysZoneStatus.CLOSED;

    if(ContactDetected){
      this.service.getCharacteristic(this.platform.Characteristic.ContactSensorState)
        .updateValue(this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED);
    } else{
      this.service.getCharacteristic(this.platform.Characteristic.ContactSensorState)
        .updateValue(this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED);
    }
  }
}
