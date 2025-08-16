import { Service } from 'homebridge';
import { HKSensor } from './HKSensor.js';
import { QolsysZoneStatus } from './QolsysZone.js';
import { HKSensorType, HBQolsysPanel } from './platform.js';

export class HKLeakSensor extends HKSensor {

  private service: Service;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected ZoneId: number,
    protected readonly Name:string,
    protected readonly UUID:string,
  ) {

    super(platform, ZoneId, HKSensorType.LeakSensor, Name, UUID);

    // set accessory information
    this.Accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Model, 'HK Leak Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    this.service = this.Accessory.getService(this.platform.Service.LeakSensor)
    || this.Accessory.addService(this.platform.Service.LeakSensor);
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){
    const LeakDetected = ZoneStatus === QolsysZoneStatus.OPEN;

    setTimeout(() => {
      this.service.updateCharacteristic(this.platform.Characteristic.LeakDetected, LeakDetected);
      this.LastEvent = new Date();
    }, this.EventDelayNeeded());
  }
}
