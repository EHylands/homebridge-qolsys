import { Service, PlatformAccessory } from 'homebridge';
import { HKSensor } from './HKSensor';
import { QolsysZoneStatus} from './QolsysZone';
import { HKSensorType, HBQolsysPanel } from './platform';

export class HKSmokeSensor extends HKSensor {

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected readonly accessory: PlatformAccessory,
    readonly ZoneId: number,
  ) {

    super(platform, accessory, ZoneId, HKSensorType.SmokeSensor);

    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Qolsys Panel')
      .setCharacteristic(this.platform.Characteristic.Model, 'HK Smoke Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.displayName);
  }

  GetService():Service{
    return this.accessory.getService(this.platform.Service.SmokeSensor)
    || this.accessory.addService(this.platform.Service.SmokeSensor);
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){
    const SmokeDetected = ZoneStatus === QolsysZoneStatus.OPEN;

    if(SmokeDetected){
      this.service.updateCharacteristic(this.platform.Characteristic.SmokeDetected,
        this.platform.Characteristic.SmokeDetected.SMOKE_DETECTED);
    } else{
      this.service.updateCharacteristic(this.platform.Characteristic.SmokeDetected,
        this.platform.Characteristic.SmokeDetected.SMOKE_NOT_DETECTED);
    }
  }
}
