
# Homebridge Plugin for Qolsys Panels
[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
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
| [IQ4](https://qolsys.com/iq-panel-4/) | Supported | Software >= 4.1.0,  >= 4.2.0: Enable 6-digit user codes |
| [IQ4 HUB](https://qolsys.com/iq4-hub/) | Status Pending |  |

## Supported Sensors
- Motion and Panel Motion
- Door, Window, Tilt
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
* `Sensor minimum trigger duration`: Some sensors are instantaneously reverting to a closed status after being brought in an open state. This option will introduce a small delay to make sure the event was properly registered by Homekit in Home App.  

## Qolsys Panel Configuration

Prerequsite: On the latest Qolsys firmwaare 6 digit PIN codes must be enabled.
- Settings
- Advanced Settings
- Enter Dealer Code (defaults to 2222)
- Installation
- Dealer Settings
- 6 Digit User Code
Once enabled all existing codes will have 00 appended.

### IQ2, IQ2+ and IQ4
1. Start by enabling Control 4 integration on Qolsys panel:
- Settings
- Advanced Settings 
- Enter Dealer Code (defaults to 2222 or 222200)
- Installation
- Devices
- WIFI Devices
- 3rd Party Connections
- Check the Control4 box
- Reboot Qolsys Panel

2. Reveal Secure Access Token:
- Settings
- Advanced Settings 
- Enter Dealer Code (defaults to 2222 or 222200)
- Installation
- Devices
- WIFI Devices
- 3rd Party Connections
- Select Reveal Secure Token field

### Timing Note 
Once Control 4 is enabled you have **10 minutes** to view the access token, configure the plugin, and have it make it's initial connection to the panel. If no connection is made in this time the panel will disable the Control 4 integration and reboot. (This behavior may be firmware dependent)

## Plugin Operation
### HomeKit Security System Accessory:
| Homekit Partition State | Qolsys Partition State|
| ------ | ------ | 
| Off | Disarmed
| Away | Arm Away, Exit Delay in config file
| Home | Arm Stay, Exit Delay in config file

### Tips
There are few things to be aware of in reguard to how HomeKit currenlty (iOS 16.0) represents security sensors.
If a room only contains sensors, and no controllable devices, it won't display the room in the Home View. This includes the Default room created for newly added devices after initial bridge enrollment. Such rooms are still selectable from the list of rooms to view. When viewing any specific room you can see its associated sensors. A summary of all currently triggered sensors will be displayed when the Security category is selected in Home View. Sensors that aren't triggered won't display in the summary, so if you have no activity the summary will be empty. This behaviour is different from the summarys for Lights or Speakers & TV, which will show devices independent of state.  When viwing the Security Summary, if multiple sensors of the same type are triggered selecting the sensor type will show a list of the triggered sensors. 

If you add sensors after the initial enrollment of the hub they will be added to a room named Default. For this reason it is generally a good idea to either add the HomeBridge to HomeKit after configuration of the plugin OR run the plugin as a child bridge and add it to HomeKit after you have confirmed proper configuration. The advantage of this approach is that when the bridge is added after the plugin is configured, HomeKit will present dialogs for each sensor allowing correct placement in each room as well as selection of display icon. While tedious, this approach is a simpler process to assign sensors to the correct room. If you don't follow this approach or add sensors later, they will be added to the Default room with default icon representation. Sensors can be moved to a different room, and the representative icon change, from the Settings similar to any other HomeKit device. The easist way to find any errant sensors is "Home Settings" -> "Home Hubs & Bridges" -> select either Homebridge or the Qolsys child bridge -> Accessories, this provides a view of all sensors that are directly part of the bridge. 

Flood sensors currently (iOS 16.0) have behavior distinct from other security sensors. When a flood sensor is enrolled, a new Summary Group for Water will be displayed in the Home View. Similar to Security Summary, when selected the summary view for water won't display any information about the flood sensors unless there is an active alert.


## Credits
- @andrewfblack, @CodyRWhite, @ifeign and @siglumous for beta testing initial plugin versions!
- [Home Assistant support thread](https://community.home-assistant.io/t/qolsys-iq-panel-2-and-3rd-party-integration/231405)
- [Don Caton @dcaton Hubitat-QolSysIQPanel plugin](https://github.com/dcaton/Hubitat/tree/main/QolSysIQPanel)
