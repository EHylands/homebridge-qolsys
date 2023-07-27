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
    protected readonly MotionSensorActive:boolean,
    protected readonly OccupancySensorActive:boolean,
  ) {

    super(platform, ZoneId, HKSensorType.MotionOccupancySensor, Name, UUID);

    this.TimerMotion = setTimeout(() => {/**/}, 0);
    this.TimerOccupancy = setTimeout(() => {/**/}, 0);

    // set accessory information
    this.Accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Model, 'HK Motion Occupancy Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    if(MotionSensorActive){
      this.AddService(this.platform.Service.MotionSensor, Name, 'Motion');
    } else{
      // Motion Sensor not configured
      // Remove MotionSensor service if present
      for(const service of this.Accessory.services){
        if(service.UUID === this.platform.Service.MotionSensor.UUID ){
          this.Accessory.removeService(service);
        }
      }
    }

    if(OccupancySensorActive){
      this.AddService(this.platform.Service.OccupancySensor, Name, 'Occupancy');
    } else{
      // Occupancy Sensor not configured
      // Remove OccupancySensor service if present
      for(const service of this.Accessory.services){
        if(service.UUID === this.platform.Service.OccupancySensor.UUID){
          this.Accessory.removeService(service);
        }
      }
    }
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){

    const MotionDetected = (ZoneStatus === QolsysZoneStatus.OPEN);

    if(this.InitialRun && !MotionDetected){

      if(this.MotionSensorActive){
        this.Accessory.getServiceById(this.platform.Service.MotionSensor, 'Motion')
          ?.updateCharacteristic(this.platform.Characteristic.MotionDetected, MotionDetected);
      }

      if(this.OccupancySensorActive){
        this.Accessory.getServiceById(this.platform.Service.OccupancySensor, 'Occupancy')
          ?.updateCharacteristic(this.platform.Characteristic.OccupancyDetected, MotionDetected);
      }

      this.InitialRun = false;
    }

    if(MotionDetected){

      if(this.MotionSensorActive){
        this.Accessory.getServiceById(this.platform.Service.MotionSensor, 'Motion')
          ?.updateCharacteristic(this.platform.Characteristic.MotionDetected, MotionDetected);

        clearTimeout(this.TimerMotion);

        // Motion timeout
        this.TimerMotion = setTimeout(() => {
          this.Accessory.getServiceById(this.platform.Service.MotionSensor, 'Motion')
            ?.updateCharacteristic(this.platform.Characteristic.MotionDetected, !MotionDetected);
        }, this.platform.MotionDelay * 60 * 1000);

      }

      if(this.OccupancySensorActive){
        this.Accessory.getServiceById(this.platform.Service.OccupancySensor, 'Occupancy')
          ?.updateCharacteristic(this.platform.Characteristic.OccupancyDetected, MotionDetected);

        clearTimeout(this.TimerOccupancy);

        // Occupancy timeout
        this.TimerOccupancy = setTimeout(() => {
          this.Accessory.getServiceById(this.platform.Service.OccupancySensor, 'Occupancy')
            ?.updateCharacteristic(this.platform.Characteristic.OccupancyDetected, !MotionDetected);
        }, this.platform.OccupancyDelay * 60 * 1000);
      }
    }
  }
}