import { Service } from 'homebridge';
import { HKSensor } from './HKSensor';
import { QolsysZoneStatus} from './QolsysZone';
import { HKSensorType, HBQolsysPanel } from './platform';

export class HKDoorbellSensor extends HKSensor {

  private DoorbellService: Service;
  private ProgrammableSwitchService: Service;

  constructor(
    protected readonly platform: HBQolsysPanel,
    protected ZoneId: number,
    protected readonly Name:string,
    protected readonly UUID,

  ) {
    super(platform, ZoneId, HKSensorType.DoorbellSensor, Name, UUID);

    // set accessory information
    this.Accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Model, 'HK Doorbell Sensor')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'QolsysZone' + ZoneId);

    this.DoorbellService = this.Accessory.getService(this.platform.Service.Doorbell)
     || this.Accessory.addService(this.platform.Service.Doorbell);

    this.ProgrammableSwitchService = this.Accessory.getService(this.platform.Service.StatelessProgrammableSwitch)
     || this.Accessory.addService(this.platform.Service.StatelessProgrammableSwitch);

    // Hide long and double press events by setting max value
    this.ProgrammableSwitchService
      .getCharacteristic(this.platform.Characteristic.ProgrammableSwitchEvent)
      .setProps({
        maxValue: this.platform.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS,
      });
  }

  HandleEventDetected(ZoneStatus: QolsysZoneStatus){
    if(ZoneStatus === QolsysZoneStatus.OPEN){
      this.DoorbellService.getCharacteristic(this.platform.Characteristic.ProgrammableSwitchEvent).updateValue(0);
      this.ProgrammableSwitchService.getCharacteristic(this.platform.Characteristic.ProgrammableSwitchEvent).updateValue(0);
    }
  }
}
