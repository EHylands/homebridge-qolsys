import { Service, PlatformAccessory } from 'homebridge';
import { HKSensor } from './HKSensor';
import { QolsysController} from './QolsysController';
import { QolsysZoneStatus} from './QolsysZone';
import { HKSensorType, HBQolsysPanel } from './platform';

export class HKCOSensor extends HKSensor {

  constructor(
    protected readonly platform:HBQolsysPanel,
    protected readonly accessory: PlatformAccessory,
    readonly ZoneId: number,
  ) {

    super(platform, accessory, ZoneId, HKSensorType.COSensor);

    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Qolsys Panel')
      .setCharacteristic(this.platform.Characteristic.Model, 'HK CO2 Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.displayName);
  }

  GetService():Service{
    return this.accessory.getService(this.platform.Service.CarbonMonoxideSensor)
    || this.accessory.addService(this.platform.Service.CarbonMonoxideSensor);
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){

    const CODetected = ZoneStatus !== QolsysZoneStatus.OPEN;
    this.service.updateCharacteristic(this.platform.Characteristic.CarbonMonoxideDetected, CODetected );
  }
}
