export enum QolsysZoneStatus{
  CLOSED,
  OPEN,
  Unknow
}

export enum QolsysZoneType{
  DoorWindow,
  GlassBreak,
  PanelGlassBreak,
  SmokeDetector,
  CODetector,
  Motion,
  PanelMotion,
  Water,
  AuxiliaryPendant,
  TakeoverModule,
  Bluetooth,
  Keypad,
  KeyFob,
  Tilt,
  Unknow
}

export class QolsysZone{

  readonly ZoneId:number;
  PartitionId = 0;
  ZoneStatus = QolsysZoneStatus.Unknow;
  ZoneName = '';
  ZoneType = QolsysZoneType.Unknow;

  constructor(ZoneId: number){
    this.ZoneId = ZoneId;
  }

  SetZoneStatusFromString(Status:string):boolean{
    switch(Status){
      case 'Open':
        return this.SetZoneStatus(QolsysZoneStatus.OPEN);
      case 'Closed':
        return this.SetZoneStatus(QolsysZoneStatus.CLOSED);
      default:
        return this.SetZoneStatus(QolsysZoneStatus.Unknow);
    }
  }

  SetZoneStatus(Status:QolsysZoneStatus):boolean{
    if(Status !== this.ZoneStatus){
      this.ZoneStatus = Status;
      return true;
    }
    return false;
  }

  SetZoneType(Type:string){
    switch(Type){
      case 'Door_Window':
        this.ZoneType = QolsysZoneType.DoorWindow;
        break;
      case 'GlassBreak':
        this.ZoneType = QolsysZoneType.GlassBreak;
        break;

      case 'Panel Glass Break':
        this.ZoneType = QolsysZoneType.PanelGlassBreak;
        break;

      case 'Motion':
        this.ZoneType = QolsysZoneType.Motion;
        break;

      case 'Panel Motion':
        this.ZoneType = QolsysZoneType.Motion;
        break;

      case 'SmokeDetector':
        this.ZoneType = QolsysZoneType.SmokeDetector;
        break;

      case 'Smoke_M':
        this.ZoneType = QolsysZoneType.SmokeDetector;
        break;

      case 'AuxiliaryPendant':
        this.ZoneType = QolsysZoneType.AuxiliaryPendant;
        break;

      case 'Water':
        this.ZoneType = QolsysZoneType.Water;
        break;

      case 'CODetector':
        this.ZoneType = QolsysZoneType.CODetector;
        break;

      case 'Bluetooth':
        this.ZoneType = QolsysZoneType.Bluetooth;
        break;

      case 'Keypad':
        this.ZoneType = QolsysZoneType.Keypad;
        break;

      case 'TakeoverModule':
        this.ZoneType = QolsysZoneType.TakeoverModule;
        break;

      case 'Tilt':
        this.ZoneType = QolsysZoneType.Tilt;
        break;

      case 'KeyFob':
        this.ZoneType = QolsysZoneType.KeyFob;
        break;

      default:
        this.ZoneType = QolsysZoneType.Unknow;
    }
  }


}