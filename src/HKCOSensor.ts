import { Service } from 'homebridge';
import { HKSensor } from './HKSensor.js';
import { QolsysZoneStatus } from './QolsysZone.js';
import { HKSensorType, HBQolsysPanel } from './platform.js';

export class HKCOSensor extends HKSensor {

  private service: Service;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected ZoneId: number,
    protected readonly Name:string,
    protected readonly UUID:string,
  ) {

    super(platform, ZoneId, HKSensorType.COSensor, Name, UUID);

    this.Accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Model, 'HK CO Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    this.service = this.Accessory.getService(this.platform.Service.CarbonMonoxideSensor)
    || this.Accessory.addService(this.platform.Service.CarbonMonoxideSensor);
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){

    const CODetected = ZoneStatus === QolsysZoneStatus.OPEN;

    setTimeout(() => {
      this.service.updateCharacteristic(this.platform.Characteristic.CarbonMonoxideDetected, CODetected );
      this.LastEvent = new Date();
    }, this.EventDelayNeeded());
  }
}
