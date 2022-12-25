
# Homebridge Plugin for Qolsys Panels
[![npm downloads](https://badgen.net/npm/dt/homebridge-qolsys)](https://www.npmjs.com/package/homebridge-qolsys)

alpha stage, not ready for prime time !

## Supported Qolsys Panels
| Panel  | Status | Notes |
| ------ | ------ |  ------ |
| IQ | Not supported|  |
| IQ2 | Status pending | Software >= 2.4.0 |
| IQ2+ | Status pending| For software  2.6.2: Enable 6-digit user codes |
| IQ4 | Status pending | Software >= 4.1.0 |

## Supported Sensors
- Motion and PanelMotion
- Door Window
- Water
- Smoke Detector
- CO Detector

## Homebride pluging configuration
### General parameters
* `Name` : Plugin name
* `Host`:  Qolsys Panel IP address
* `Port`:  Qolsys Panel Port number (defaults to 12345)
* `Secure Token`: Control 4 Integration Secure Token 
* `User Pin Code`: User security code

## Qolsys Panel Configuration
### IQ Panel 2
TBD
### IQ Panel 2 +
Start by enabling Control 4 integration on Qolsys panel:
- Settings
- Advanced Settings 
- Enter Dealer Code (defaults to 2222)
- Installation
- Devices
- WIFI Devices
- 3rd Party Connections
- Check the box for Control4
- Reboot Qolsys Panel

Reveal Secure Access Token:
- Settings
- Advanced Settings 
- Enter Dealer Code (defaults to 2222)
- Installation
- Devices
- WIFI Devices
- 3rd Party Connections
- Select Reveal Secure Token field

### IQ Panel 4
TBD