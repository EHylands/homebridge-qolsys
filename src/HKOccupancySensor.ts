import { Service } from 'homebridge';
import { HKSensor } from './HKSensor.js';
import { QolsysZoneStatus } from './QolsysZone.js';
import { HKSensorType, HBQolsysPanel } from './platform.js';

export class HKOccupancySensor extends HKSensor {

  private InitialRun = true;
  private Timer: ReturnType<typeof setTimeout>;
  private service: Service;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected ZoneId: number,
    protected readonly Name:string,
    protected readonly UUID:string,
  ) {

    super(platform, ZoneId, HKSensorType.OccupancySensor, Name, UUID);

    this.Timer = setTimeout(() => {/**/}, 0);

    // set accessory information
    this.Accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Model, 'HK Occupancy Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    //this.service.setCharacteristic(this.platform.Characteristic.Name, this.Accessory.displayName);
    this.service = this.Accessory.getService(this.platform.Service.OccupancySensor)
    || this.Accessory.addService(this.platform.Service.OccupancySensor);
  }

  //GetService():Service{
  //  return this.Accessory.getService(this.platform.Service.OccupancySensor)
  //  || this.Accessory.addService(this.platform.Service.OccupancySensor);
  //}

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){

    const OccupancyDetected = (ZoneStatus === QolsysZoneStatus.OPEN);

    if(this.InitialRun && !OccupancyDetected){
      this.service.updateCharacteristic(this.platform.Characteristic.OccupancyDetected, OccupancyDetected);
      this.InitialRun = false;
    }

    if(OccupancyDetected){
      this.service.updateCharacteristic(this.platform.Characteristic.OccupancyDetected, OccupancyDetected);

      clearTimeout(this.Timer);

      this.Timer = setTimeout(() => {
        this.service.updateCharacteristic(this.platform.Characteristic.OccupancyDetected, !OccupancyDetected );
      }, this.platform.OccupancyDelay * 60 * 1000);
    }
  }
}
