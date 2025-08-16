import { PlatformAccessory, Service, WithUUID } from 'homebridge';
import { HBQolsysPanel } from './platform.js';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';


export abstract class HKAccessory {
  public readonly Accessory: PlatformAccessory;

  constructor(
        protected readonly platform: HBQolsysPanel,
        protected readonly Name:string,
        protected readonly UUID:string,
  ) {
    const uuid = this.platform.api.hap.uuid.generate(UUID);
    let accessory = this.platform.accessories.find(accessory => accessory.UUID === uuid);
    if(accessory){
      this.platform.api.updatePlatformAccessories([accessory]);
    } else{
      accessory = new this.platform.api.platformAccessory(this.Name, uuid);
      this.platform.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    }
    platform.CreatedAccessories.push(accessory);
    this.Accessory = accessory;

      this.Accessory.getService(this.platform.Service.AccessoryInformation)!
        .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Qolsys');
  }

  protected AddService(Type: WithUUID<typeof Service>, Name:string, Subtype:string){

    let service: Service | undefined;
    if (Subtype) {
      service = this.Accessory.getServiceById(Type, Subtype);
    } else {
      service = this.Accessory.getService(Type);
    }

    return service || this.Accessory.addService(Type, Name, Subtype);
  }
}