import { Service } from 'homebridge';
import { HKSensor } from './HKSensor.js';
import { QolsysZoneStatus } from './QolsysZone.js';
import { HKSensorType, HBQolsysPanel } from './platform.js';

export class HKSmokeSensor extends HKSensor {

  private service: Service;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected ZoneId: number,
    protected readonly Name:string,
    protected readonly UUID:string,
  ) {

    super(platform, ZoneId, HKSensorType.SmokeSensor, Name, UUID);

    this.Accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Model, 'HK Smoke Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    this.service = this.Accessory.getService(this.platform.Service.SmokeSensor)
     || this.Accessory.addService(this.platform.Service.SmokeSensor);
  }


  HandleEventDetected(ZoneStatus: QolsysZoneStatus){
    const SmokeDetected = ZoneStatus === QolsysZoneStatus.OPEN;

    if(SmokeDetected){
      setTimeout(() => {
        this.service.updateCharacteristic(this.platform.Characteristic.SmokeDetected,
          this.platform.Characteristic.SmokeDetected.SMOKE_DETECTED);
        this.LastEvent = new Date();
      }, this.EventDelayNeeded());
    } else{
      setTimeout(() => {
        this.service.updateCharacteristic(this.platform.Characteristic.SmokeDetected,
          this.platform.Characteristic.SmokeDetected.SMOKE_NOT_DETECTED);
        this.LastEvent = new Date();
      }, this.EventDelayNeeded());
    }
  }
}
