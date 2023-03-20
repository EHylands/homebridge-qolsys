import { Service, PlatformAccessory } from 'homebridge';
import { HKSensor } from './HKSensor';
import { QolsysZoneStatus} from './QolsysZone';
import { HKSensorType, HBQolsysPanel } from './platform';

export class HKMotionSensor extends HKSensor {

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected readonly accessory: PlatformAccessory,
    readonly ZoneId: number,
  ) {

    super(platform, accessory, ZoneId, HKSensorType.MotionSensor);

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Qolsys Panel')
      .setCharacteristic(this.platform.Characteristic.Model, 'HK Motion Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.displayName);
  }

  GetService():Service{
    return this.accessory.getService(this.platform.Service.MotionSensor)
    || this.accessory.addService(this.platform.Service.MotionSensor);
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){

    const CurrentStatus = this.service.getCharacteristic(this.platform.Characteristic.MotionDetected);
    const MotionDetected = (ZoneStatus === QolsysZoneStatus.OPEN);


    if(CurrentStatus && !MotionDetected){
      setTimeout(() => {
        this.service.updateCharacteristic(this.platform.Characteristic.MotionDetected, MotionDetected );
      }, 2000);
    }
    else{
      this.service.updateCharacteristic(this.platform.Characteristic.MotionDetected, MotionDetected );
    }


  }
}
