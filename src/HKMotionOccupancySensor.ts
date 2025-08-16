import { HKSensor } from './HKSensor.js';
import { QolsysZoneStatus } from './QolsysZone.js';
import { HKSensorType, HBQolsysPanel } from './platform.js';

export class HKMotionOccupancySensor extends HKSensor {

  private InitialRun = true;
  private TimerMotion: ReturnType<typeof setTimeout>;
  private TimerOccupancy: ReturnType<typeof setTimeout>;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected ZoneId: number,
    protected readonly Name:string,
    protected readonly UUID:string,
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
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.Accessory.getService(this.platform.Service.MotionSensor) || this.Accessory.addService(this.platform.Service.MotionSensor);
    } else{
      // Motion Sensor not configured, remove if present
      const MotionService = this.Accessory.getService(this.platform.Service.MotionSensor);
      if(MotionService){
        this.Accessory.removeService(MotionService);
      }
    }

    if(OccupancySensorActive){
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.Accessory.getService(this.platform.Service.OccupancySensor) || this.Accessory.addService(this.platform.Service.OccupancySensor);

    } else{
      // Occupancy Sensor not configured, remove if present
      const OccupancyService = this.Accessory.getService(this.platform.Service.OccupancySensor);
      if(OccupancyService){
        this.Accessory.removeService(OccupancyService);
      }
    }
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){

    const MotionDetected = (ZoneStatus === QolsysZoneStatus.OPEN);

    if(this.InitialRun && !MotionDetected){

      if(this.MotionSensorActive){
        this.Accessory.getService(this.platform.Service.MotionSensor)
          ?.updateCharacteristic(this.platform.Characteristic.MotionDetected, MotionDetected);
      }

      if(this.OccupancySensorActive){
        this.Accessory.getService(this.platform.Service.OccupancySensor)
          ?.updateCharacteristic(this.platform.Characteristic.OccupancyDetected, MotionDetected);
      }

      this.InitialRun = false;
    }

    if(MotionDetected){

      if(this.MotionSensorActive){
        this.Accessory.getService(this.platform.Service.MotionSensor)
          ?.updateCharacteristic(this.platform.Characteristic.MotionDetected, MotionDetected);

        clearTimeout(this.TimerMotion);

        let Delay = this.platform.MotionDelay * 60 * 1000;
        if(Delay === 0){
          Delay = this.EventDelayNeeded();
        }

        // Motion timeout
        this.TimerMotion = setTimeout(() => {
          this.Accessory.getService(this.platform.Service.MotionSensor)
            ?.updateCharacteristic(this.platform.Characteristic.MotionDetected, !MotionDetected);
        }, Delay);

      }

      if(this.OccupancySensorActive){
        this.Accessory.getService(this.platform.Service.OccupancySensor)
          ?.updateCharacteristic(this.platform.Characteristic.OccupancyDetected, MotionDetected);

        clearTimeout(this.TimerOccupancy);

        let Delay = this.platform.OccupancyDelay * 60 * 1000;
        if(Delay === 0){
          Delay = this.EventDelayNeeded();
        }

        // Occupancy timeout
        this.TimerOccupancy = setTimeout(() => {
          this.Accessory.getService(this.platform.Service.OccupancySensor)
            ?.updateCharacteristic(this.platform.Characteristic.OccupancyDetected, !MotionDetected);
        }, Delay);
      }
    }
  }
}