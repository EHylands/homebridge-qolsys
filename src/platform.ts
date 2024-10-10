import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { QolsysController, QolsysControllerError } from './QolsysController';
import { QolsysZone, QolsysZoneStatus, QolsysZoneType} from './QolsysZone';
import { QolsysAlarmMode} from './QolsysPartition';
import { HKSecurityPanel } from './HKSecurityPanel';
import { HKContactSensor } from './HKContactSensor';
import { HKLeakSensor } from './HKLeakSensor';
import { HKSmokeSensor } from './HKSmokeSensor';
import { HKCOSensor } from './HKCOSensor';
import { HKDoorbellSensor } from './HKDoorbellSensor';
import { HKSensor } from './HKSensor';
import { HKMotionOccupancySensor } from './HKMotionOccupancySensor';

export enum HKSensorType {
  MotionSensor = 'MotionSensor',
  ContactSensor = 'ContactSensor',
  LeakSensor = 'LeakSensor',
  SmokeSensor = 'SmokeSensor',
  COSensor = 'COSensor',
  OccupancySensor = 'OccupancySensor',
  MotionOccupancySensor = 'MotionOccupancySensor',
  DoorbellSensor = 'DoorbellSensor'
}

export class HBQolsysPanel implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  public accessories: PlatformAccessory[] = [];
  public CreatedAccessories: PlatformAccessory[] = [];

  private PanelHost = '';
  private PanelPort = 14999;
  private PanelSecureToken = '';
  private UserPinCode = '';
  public readonly Controller: QolsysController;

  private Zones:Record<number, HKSensor> = {};
  private InitialRun = true;
  private ReceivingPanelNotification = false;

  private ShowSecurityPanel = true;
  private ShowMotion = true;
  private ShowContact = true;
  private ShowCO = true;
  private ShowSmoke = true;
  private ShowHeat = true;
  private ShowLeak = true;
  private ShowTilt = true;
  private ShowDoorbell = true;
  private ShowFreeze = true;
  private ShowBluetooth = false;
  private ShowGlassBreak = false;
  private ShowTakeover = false;
  private LogPartition = true;
  private LogZone = false;
  private LogDebug = false;
  ForceArm = true;
  AwayExitDelay = 120;
  HomeExitDelay = 120;
  SensorDelay = true;

  // Motion Occupancy sensors options
  MotionDelay = 5;
  OccupancyDelay = 15;
  MotionSensorMode = 'Motion';

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {

    if(!this.CheckConfig()){
      this.Controller = new QolsysController(this.PanelHost, this.PanelPort);
      return;
    }

    this.Controller = new QolsysController(this.PanelHost, this.PanelPort);
    this.Controller.SecureToken = this.PanelSecureToken;
    this.Controller.UserPinCode = this.UserPinCode;

    this.api.on('didFinishLaunching', () => {
      this.discoverDevices();
    });
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.accessories.push(accessory);
  }

  // First config check
  // check if panel host, port and passcode are set
  CheckConfig():boolean{
    const Host = this.config.Host;
    const Port = this.config.Port;
    const SecureToken = this.config.SecureToken;
    const UserPinCode = this.config.UserPinCode;

    if(Host === undefined || Host === ''){
      this.log.error('Aborting plugin operation - Invalid Host: ' + Host);
      return false;
    }

    if(Port === undefined || isNaN(Port)){
      this.log.error('Aborting plugin operation - Invalid Port: ' + Port);
      return false;
    }

    if(SecureToken === undefined || SecureToken === ''){
      this.log.error('Aborting plugin operation - Invalid SecureToken');
      return false;
    }

    if(UserPinCode === undefined || UserPinCode === ''){
      this.log.error('Aborting plugin operation - Invalid User Pin Code');
      return false;
    }

    if(this.config.ShowSecurityPanel !== undefined){
      this.ShowSecurityPanel = this.config.ShowSecurityPanel;
    }

    if(this.config.ShowMotion !== undefined){
      this.ShowMotion = this.config.ShowMotion;
    }

    if(this.config.ShowContact !== undefined){
      this.ShowContact = this.config.ShowContact;
    }

    if(this.config.ShowCO !== undefined){
      this.ShowCO = this.config.ShowCO;
    }

    if(this.config.ShowSmoke !== undefined){
      this.ShowSmoke = this.config.ShowSmoke;
    }

    if(this.config.ShowHeat !== undefined){
      this.ShowHeat = this.config.ShowHeat;
    }

    if(this.config.ShowLeak !== undefined){
      this.ShowLeak = this.config.ShowLeak;
    }

    if(this.config.Tilt !== undefined){
      this.ShowTilt = this.config.ShowTilt;
    }

    if(this.config.ShowGlassBreak !== undefined){
      this.ShowGlassBreak = this.config.ShowGlassBreak;
    }

    if(this.config.ShowDoorbell !== undefined){
      this.ShowDoorbell = this.config.ShowDoorbell;
    }

    if(this.config.ShowFreeze !== undefined){
      this.ShowFreeze = this.config.ShowFreeze;
    }

    if(this.config.LogPartition !== undefined){
      this.LogPartition = this.config.LogPartition;
    }

    if(this.config.LogZone !== undefined){
      this.LogZone = this.config.LogZone;
    }

    if(this.config.LogDebug !== undefined){
      this.LogDebug = this.config.LogDebug;
    }

    if(this.config.ForceArm !== undefined){
      this.ForceArm = this.config.ForceArm;
    }

    if(this.config.AwayExitDelay !== undefined){
      this.AwayExitDelay = this.config.AwayExitDelay;
    }

    if(this.config.HomeExitDelay !== undefined){
      this.HomeExitDelay = this.config.HomeExitDelay;
    }

    if(this.config.OccupancyDelay !== undefined){
      this.OccupancyDelay = this.config.OccupancyDelay;
    }

    if(this.config.MotionDelay !== undefined){
      this.MotionDelay = this.config.MotionDelay;
    }

    if(this.config.MotionSensorMode !== undefined){
      this.MotionSensorMode = this.config.MotionSensorMode;
    }

    this.PanelHost = Host;
    this.PanelPort = Port;
    this.PanelSecureToken = SecureToken;
    this.UserPinCode = UserPinCode;

    return true;
  }

  private DiscoverPartitions(){
    for(const PartitionId in this.Controller.GetPartitions()){

      const Partition = this.Controller.GetPartitions()[PartitionId];

      if(!this.ShowSecurityPanel){
        this.log.info('Partition' + Partition.PartitionId + ': Skipped in config file');
        continue;
      }

      new HKSecurityPanel(this, Partition.PartitionId, Partition.PartitionName, 'QolsysPartition' + Partition.PartitionId,
        Partition.NightModeEnabled);
    }
  }

  private DiscoverZones(){
    for(const ZoneId in this.Controller.GetZones()){
      const Zone = this.Controller.GetZones()[ZoneId];
      this.CreateSensor(Zone);
    }
  }

  private DeviceCacheCleanUp(){
    // Do some cleanup of point that have been restored and are not in config file anymore
    for(let i = 0; i < this.accessories.length;i++){
      if(this.CreatedAccessories.indexOf(this.accessories[i]) === -1){
        this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [this.accessories[i]]);
      }
    }
  }

  discoverDevices() {

    this.Controller.on('PanelReadyForOperation', () => {

      this.DumpPanelInfo();

      if(this.InitialRun){
        this.log.info('-----------------------------------------');
        this.log.info('Configuring Homebridge plugin accessories');
        this.log.info('-----------------------------------------');
        this.DiscoverPartitions();
        this.DiscoverZones();
        this.DeviceCacheCleanUp();
        this.InitialRun = false;
      }

      // Start panel event notifications.
      this.log.info('-----------------------------------------');
      this.log.info('Starting Controller Operation');
      this.log.info('-----------------------------------------');
      this.Controller.StartOperation();
    });

    this.Controller.on('PrintDebugInfo', (DebugString) => {
      if(this.LogDebug){
        this.log.info(DebugString);
      } else{
        this.log.debug(DebugString);
      }
    });

    this.Controller.on('ZoneStatusChange', (Zone) => {
      const msg = 'Zone' + Zone.ZoneId + '(' + Zone.ZoneName + '): ' + QolsysZoneStatus[Zone.ZoneStatus];
      if(this.LogZone){
        this.log.info(msg);
      } else{
        this.log.debug(msg);
      }

      const Sensor = this.Zones[Zone.ZoneId];
      if(Sensor !== undefined){
        Sensor.HandleEventDetected(Zone.ZoneStatus);
      }
    });

    this.Controller.on('PartitionAlarmModeChange', (Partition)=>{
      const msg = 'Partition'+ Partition.PartitionId + '(' + Partition.PartitionName +'): ' + QolsysAlarmMode[Partition.PartitionStatus];
      if(this.LogPartition){
        this.log.info(msg);
      } else{
        this.log.debug(msg);
      }
    });


    this.Controller.on('ControllerError', (Error, ErrorString) => {
      this.log.error(Error + ' (' + ErrorString + ')');

      // Reconnect if connection to panel has been lost
      if(Error === QolsysControllerError.ConnectionError){

        if(this.ReceivingPanelNotification === true){
          this.ReceivingPanelNotification = false;
          this.log.info('-----------------------------------------');
          this.log.info('Stopping Control Panel Operation');
          this.log.info('-----------------------------------------');
        }

        setTimeout(() => {
          this.log.info('Trying to reconnect ....');
          this.Controller.Connect();
        }, 60000); // Try to reconnect every 60 sec
      }
    });

    // Start panel initialisation
    this.Controller.Connect();
  }

  private CreateSensor(Zone:QolsysZone):boolean{

    switch(Zone.ZoneType){

      case QolsysZoneType.Motion:{

        if(this.ShowMotion){

          if(this.MotionSensorMode === 'Motion'){
            this.Zones[Zone.ZoneId] = new HKMotionOccupancySensor(this, Zone.ZoneId, Zone.ZoneName,
              'QolsysZone' + Zone.ZoneType + Zone.ZoneId, true, false);
          }

          if(this.MotionSensorMode === 'Occupancy'){
            this.Zones[Zone.ZoneId] = new HKMotionOccupancySensor(this, Zone.ZoneId, Zone.ZoneName,
              'QolsysZone' + Zone.ZoneType + Zone.ZoneId, false, true);
          }

          if(this.MotionSensorMode === 'MotionOccupancy'){
            this.Zones[Zone.ZoneId] = new HKMotionOccupancySensor(this, Zone.ZoneId, Zone.ZoneName,
              'QolsysZone' + Zone.ZoneType + Zone.ZoneId, true, true);
          }

          return true;

        } else{
          this.log.info('Zone' + Zone.ZoneId + ': Skipped in config file - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.PanelMotion:{
        if(this.ShowMotion){

          if(this.MotionSensorMode === 'Motion'){
            this.Zones[Zone.ZoneId] = new HKMotionOccupancySensor(this, Zone.ZoneId, Zone.ZoneName,
              'QolsysZone' + Zone.ZoneType + Zone.ZoneId, true, false);
          }

          if(this.MotionSensorMode === 'Occupancy'){
            this.Zones[Zone.ZoneId] = new HKMotionOccupancySensor(this, Zone.ZoneId, Zone.ZoneName,
              'QolsysZone' + Zone.ZoneType + Zone.ZoneId, false, true);
          }

          if(this.MotionSensorMode === 'MotionOccupancy'){
            this.Zones[Zone.ZoneId] = new HKMotionOccupancySensor(this, Zone.ZoneId, Zone.ZoneName,
              'QolsysZone' + Zone.ZoneType + Zone.ZoneId, true, true);
          }

          return true;

        } else{
          this.log.info('Zone' + Zone.ZoneId + ': Skipped in config file - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.DoorWindow:{
        if(this.ShowContact){
          this.Zones[Zone.ZoneId] = new HKContactSensor(this, Zone.ZoneId, Zone.ZoneName, 'QolsysZone' + Zone.ZoneType + Zone.ZoneId);
          return true;
        } else{
          this.log.info('Zone' + Zone.ZoneId + ': Skipped in config file - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.Water :{
        if(this.ShowLeak){
          this.Zones[Zone.ZoneId] = new HKLeakSensor(this, Zone.ZoneId, Zone.ZoneName, 'QolsysZone' + Zone.ZoneType + Zone.ZoneId);
          return true;
        } else{
          this.log.info('Zone' + Zone.ZoneId + ': Skipped in config file - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.SmokeDetector :{
        if(this.ShowSmoke){
          this.Zones[Zone.ZoneId] = new HKSmokeSensor(this, Zone.ZoneId, Zone.ZoneName, 'QolsysZone' + Zone.ZoneType + Zone.ZoneId);
          return true;
        } else{
          this.log.info('Zone' + Zone.ZoneId + ': Skipped in config file - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.Heat :{
        if(this.ShowHeat){
          this.Zones[Zone.ZoneId] = new HKSmokeSensor(this, Zone.ZoneId, Zone.ZoneName, 'QolsysZone' + Zone.ZoneType + Zone.ZoneId);
          return true;
        } else{
          this.log.info('Zone' + Zone.ZoneId + ': Skipped in config file - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.CODetector :{
        if(this.ShowCO){
          this.Zones[Zone.ZoneId] = new HKCOSensor(this, Zone.ZoneId, Zone.ZoneName, 'QolsysZone' + Zone.ZoneType + Zone.ZoneId);
          return true;
        } else{
          this.log.info('Zone' + Zone.ZoneId + ': Skipped in config file - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.Bluetooth :{
        if(this.ShowBluetooth){
          this.Zones[Zone.ZoneId] = new HKContactSensor(this, Zone.ZoneId, Zone.ZoneName, 'QolsysZone' + Zone.ZoneType + Zone.ZoneId);
          return true;
        } else{
          this.log.info('Zone' + Zone.ZoneId + ': No HomeKit plugin available - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.GlassBreak :{
        if(this.ShowGlassBreak){
          this.Zones[Zone.ZoneId] = new HKContactSensor(this, Zone.ZoneId, Zone.ZoneName, 'QolsysZone' + Zone.ZoneType + Zone.ZoneId);
          return true;
        } else{
          this.log.info('Zone' + Zone.ZoneId + ': Skipped in config file - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.PanelGlassBreak :{
        if(this.ShowGlassBreak){
          this.Zones[Zone.ZoneId] = new HKContactSensor(this, Zone.ZoneId, Zone.ZoneName, 'QolsysZone' + Zone.ZoneType + Zone.ZoneId);
          return true;
        } else{
          this.log.info('Zone' + Zone.ZoneId + ': Skipped in config file - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.TakeoverModule :{
        if(this.ShowTakeover){
          this.Zones[Zone.ZoneId] = new HKContactSensor(this, Zone.ZoneId, Zone.ZoneName, 'QolsysZone' + Zone.ZoneType + Zone.ZoneId);
          return true;
        } else{
          this.log.info('Zone' + Zone.ZoneId + ': No HomeKit plugin available - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.Tilt :{
        if(this.ShowTilt){
          this.Zones[Zone.ZoneId] = new HKContactSensor(this, Zone.ZoneId, Zone.ZoneName, 'QolsysZone' + Zone.ZoneType + Zone.ZoneId);
          return true;
        } else{
          this.log.info('Zone' + Zone.ZoneId + ': Skipped in config file - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.Doorbell:{
        if(this.ShowDoorbell){
          this.Zones[Zone.ZoneId] = new HKDoorbellSensor(this, Zone.ZoneId, Zone.ZoneName, 'QolsysZone' + Zone.ZoneType + Zone.ZoneId);
          return true;
        } else{
          this.log.info('Zone' + Zone.ZoneId + ': Skipped in config file - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      case QolsysZoneType.Freeze :{
        if(this.ShowFreeze){
          this.Zones[Zone.ZoneId] = new HKContactSensor(this, Zone.ZoneId, Zone.ZoneName, 'QolsysZone' + Zone.ZoneType + Zone.ZoneId);
          return true;
        } else{
          this.log.info('Zone' + Zone.ZoneId + ': Skipped in config file - ' + QolsysZoneType[Zone.ZoneType]);
          return false;
        }
      }

      default:
        this.log.info('Zone' + Zone.ZoneId + ': No HomeKit plugin available - ' + QolsysZoneType[Zone.ZoneType]);
        return false;
    }
  }

  private DumpPanelInfo(){
    this.log.info('-----------------------------------------');
    this.log.info('Qolsys Panel Information');
    this.log.info('-----------------------------------------');

    this.log.info('Motion sensor mode: ' + this.MotionSensorMode);

    for (const PartitionId in this.Controller.GetPartitions()){
      const Partition = this.Controller.GetPartitions()[PartitionId];
      this.log.info('Partition' + Partition.PartitionId + ': ' + Partition.PartitionName);

      for(const ZoneId in this.Controller.GetZones()){
        const Zone = this.Controller.GetZones()[ZoneId];
        if(Zone.PartitionId === Partition.PartitionId){
          this.log.info('Zone' + Zone.ZoneId + ': ' + Zone.ZoneName);
        }
      }
    }
  }
}