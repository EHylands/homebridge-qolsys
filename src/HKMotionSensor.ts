import { Service, PlatformAccessory } from 'homebridge';
import { HKSensor } from './HKSensor';
import { QolsysZoneStatus} from './QolsysZone';
import { HKSensorType, HBQolsysPanel } from './platform';

export class HKMotionSensor extends HKSensor {

  private InitialRun = true;
  private TriggerDuration = 330000; // 5 minutes 30 sec
  private Timer: ReturnType<typeof setTimeout>;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected readonly accessory: PlatformAccessory,
    readonly ZoneId: number,
  ) {

    super(platform, accessory, ZoneId, HKSensorType.MotionSensor);

    this.Timer = setTimeout(() => {/**/}, 0);

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
      }, this.TriggerDuration);
    }
  }
}
