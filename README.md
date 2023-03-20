
# Homebridge Plugin for Qolsys Panels
[![npm downloads](https://badgen.net/npm/dt/homebridge-qolsys)](https://www.npmjs.com/package/homebridge-qolsys)

This plugin only supports the IQ Panel basic security features:

 | Feature  | Status |
 | ------ | ------ |
 | Arming partition (Arm-Away, Arm-Stay | Supported |
 | Disarming partition | Supported |
 | RF and wired sensor status | Supported |
 | Z-Wave accessory status and control | Not Supported  |
 | IQ Panel smart home features |  Not Supported |
 | Other Alarm.com features |  Not Supported |
 
## Supported Qolsys Panels
| Panel  | Status | Notes |
| ------ | ------ |  ------ |
| [IQ](https://qolsys.com/iq-panel/) | Not Supported|  |
| [IQ HUB](https://qolsys.com/iq4-hub/) |Not Supported |  |
| [IQ2](https://qolsys.com/iq-panel-2/) | Supported | Software >= 2.4.0 |
| [IQ2+](https://qolsys.com/iq-panel-2-plus/) | Supported| For software >= 2.6.2: Enable 6-digit user codes |
| [IQ4](https://qolsys.com/iq-panel-4/) | Supported | Software >= 4.1.0 |
| [IQ4 HUB](https://qolsys.com/iq4-hub/) | Status Pending |  |

## Supported Sensors
- Motion and Panel Motion
- Door, Window
- Water
- Smoke Detector
- CO Detector
- Bluetooth
- Glass Break and Panel Glass Break
- Takeover Module

## Homebride Pluging Configuration
### General Parameters
* `Host`:  Qolsys Panel IP address
* `Port`:  Qolsys Panel Port number (defaults to 12345)
* `Secure Token`: C4 Integration Secure Token 
* `User Pin Code`: User security code
* `Arm Away Exit Delay`: How much time users have to exit the location before the panel arms itself to Arm Away (0 sec or any number higher than your panel long exit delay (120 sec by default))
* `Arm Stay Exit Delay`: How much time before the panel arms itself to Arm Stay (0 sec or any number higher than your panel long exit delay (120 sec by default))
* `Force Arm`: Bypass open or faulted sensors when arming partition

## Qolsys Panel Configuration
### IQ2, IQ2+ and IQ4
1. Start by enabling Control 4 integration on Qolsys panel:
- Settings
- Advanced Settings 
- Enter Dealer Code (defaults to 2222)
- Installation
- Devices
- WIFI Devices
- 3rd Party Connections
- Check the Control4 box
- Reboot Qolsys Panel

2. Reveal Secure Access Token:
- Settings
- Advanced Settings 
- Enter Dealer Code (defaults to 2222)
- Installation
- Devices
- WIFI Devices
- 3rd Party Connections
- Select Reveal Secure Token field

## Plugin Operation
### HomeKit Security System Accessory:
| Homekit Partition State | Qolsys Partition State|
| ------ | ------ | 
| Off | Disarmed
| Away | Arm Away, Exit Delay in config file
| Home | Arm Stay, Exit Delay in config file

## Credits
- @andrewfblack, @CodyRWhite, @ifeign and @siglumous for beta testing initial plugin versions!
- [Home Assistant support thread](https://community.home-assistant.io/t/qolsys-iq-panel-2-and-3rd-party-integration/231405)
- [Don Caton @dcaton Hubitat-QolSysIQPanel plugin](https://github.com/dcaton/Hubitat/tree/main/QolSysIQPanel)
