import { HKSensor } from './HKSensor';
import { QolsysZoneStatus} from './QolsysZone';
import { HKSensorType, HBQolsysPanel } from './platform';

export class HKMotionOccupancySensor extends HKSensor {

  private InitialRun = true;
  private TimerMotion: ReturnType<typeof setTimeout>;
  private TimerOccupancy: ReturnType<typeof setTimeout>;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected ZoneId: number,
    protected readonly Name:string,
    protected readonly UUID,
  ) {

    super(platform, ZoneId, HKSensorType.MotionOccupancySensor, Name, UUID);

    this.TimerMotion = setTimeout(() => {/**/}, 0);
    this.TimerOccupancy = setTimeout(() => {/**/}, 0);

    // set accessory information
    this.Accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Model, 'HK Motion Occupancy Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    this.AddService(this.platform.Service.MotionSensor, Name, 'Motion');
    this.AddService(this.platform.Service.OccupancySensor, Name, 'Occupancy');
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){

    const MotionDetected = (ZoneStatus === QolsysZoneStatus.OPEN);

    if(this.InitialRun && !MotionDetected){

      this.Accessory.getServiceById(this.platform.Service.MotionSensor, 'Motion')
        ?.updateCharacteristic(this.platform.Characteristic.MotionDetected, MotionDetected);

      this.Accessory.getServiceById(this.platform.Service.OccupancySensor, 'Occupancy')
        ?.updateCharacteristic(this.platform.Characteristic.OccupancyDetected, MotionDetected);

      this.InitialRun = false;
    }

    if(MotionDetected){

      this.Accessory.getServiceById(this.platform.Service.MotionSensor, 'Motion')
        ?.updateCharacteristic(this.platform.Characteristic.MotionDetected, MotionDetected);

      this.Accessory.getServiceById(this.platform.Service.OccupancySensor, 'Occupancy')
        ?.updateCharacteristic(this.platform.Characteristic.OccupancyDetected, MotionDetected);

      clearTimeout(this.TimerMotion);
      clearTimeout(this.TimerOccupancy);

      // Motion timeout
      this.TimerMotion = setTimeout(() => {
        this.Accessory.getServiceById(this.platform.Service.MotionSensor, 'Motion')
          ?.updateCharacteristic(this.platform.Characteristic.MotionDetected, !MotionDetected);
      }, this.platform.MotionDelay * 60 * 1000);

      // Occupancy timeout
      this.TimerOccupancy = setTimeout(() => {
        this.Accessory.getServiceById(this.platform.Service.OccupancySensor, 'Occupancy')
          ?.updateCharacteristic(this.platform.Characteristic.OccupancyDetected, !MotionDetected);
      }, this.platform.OccupancyDelay * 60 * 1000);
    }
  }
}
