import { Service } from 'homebridge';
import { HKSensor } from './HKSensor.js';
import { QolsysZoneStatus } from './QolsysZone.js';
import { HKSensorType, HBQolsysPanel } from './platform.js';

export class HKMotionSensor extends HKSensor {

  private InitialRun = true;
  private Timer: ReturnType<typeof setTimeout>;
  private service: Service;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected ZoneId: number,
    protected readonly Name:string,
    protected readonly UUID:string,
  ) {

    super(platform, ZoneId, HKSensorType.MotionSensor, Name, UUID);

    this.Timer = setTimeout(() => {/**/}, 0);

    // set accessory information
    this.Accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Model, 'HK Motion Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    this.service = this.Accessory.getService(this.platform.Service.MotionSensor)
    || this.Accessory.addService(this.platform.Service.MotionSensor);
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){

    const MotionDetected = (ZoneStatus === QolsysZoneStatus.OPEN);

    if(this.InitialRun && !MotionDetected){
      this.service.updateCharacteristic(this.platform.Characteristic.MotionDetected, MotionDetected);
      this.InitialRun = false;
    }

    if(MotionDetected){
      this.service.updateCharacteristic(this.platform.Characteristic.MotionDetected, MotionDetected);
      clearTimeout(this.Timer);

      this.Timer = setTimeout(() => {
        this.service.updateCharacteristic(this.platform.Characteristic.MotionDetected, !MotionDetected );
      }, this.platform.MotionDelay * 60 * 1000);
    }
  }
}
