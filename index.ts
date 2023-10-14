
import * as fs from 'fs';


function findNearestDevices(devices: Record<string, any>, lat: number, lng: number): [string | null, string | null] {
    let nearestDeviceTyp1: string | null = null;
    let nearestDeviceTyp2: string | null = null;
    let minDistanceTyp1 = Number.MAX_VALUE;
    let minDistanceTyp2 = Number.MAX_VALUE;
    for (const [devId, devData] of Object.entries(devices)) {
        const { dev_info } = devData;
        // "groupId": "64c116da4fddbd508bdf1c65" sensor for distance, humidity, pressure, temp
        // "groupId": "64c116ec4fddbd508bdf1c67" sensor for rain, rain_time, rainIntensity
        if (dev_info.groupId === '64c116da4fddbd508bdf1c65' || dev_info.groupId === '64c116ec4fddbd508bdf1c67') {
            const { location } = dev_info;
            const distance = Math.sqrt(Math.pow(location.lat - lat, 2) + Math.pow(location.lng - lng, 2));
            if (dev_info.groupId === '64c116da4fddbd508bdf1c65' && distance < minDistanceTyp1) {
                minDistanceTyp1 = distance;
                nearestDeviceTyp1 = devId;
            }
            if (dev_info.groupId === '64c116ec4fddbd508bdf1c67' && distance < minDistanceTyp2) {
                minDistanceTyp2 = distance;
                nearestDeviceTyp2 = devId;
            }
        }
    }
    return [nearestDeviceTyp1, nearestDeviceTyp2];
}

//type interface for device_data.json
interface DeviceData {
    [key: string]: {
        measurements: {
            time: string;
            value: number;
        };
        distance: {
            time: string;
            value: number;
        };
        humidity: {
            time: string;
            value: number;
        };
        temperature: {
            time: string;
            value: number;
        };
        pressure: {
            time: string;
            value: number;
        };
        Rain: {
            time: string;
            value: number;
        };
        Rain_time: {
            time: string;
            value: number;
        };
        RainIntensity: {
            time: string;
            value: number;
        };
        dev_info: {
            groupId: string;
            serviceId: string;
            name: string;
            description: string;
            state: string;
            lastSeen: number;
            location: {
                lat: number;
                lng: number;
            };
        };
    };
}


const data = fs.readFileSync('./device_data.json', 'utf-8');
const device_data :DeviceData = JSON.parse(data);

const [dev1, dev2] = findNearestDevices(device_data, 52.1, 9.5);

if (dev1) {
    console.log(dev1)
    console.log(device_data[dev1].dev_info)
    console.log(device_data[dev1].dev_info.name)
   // console.log(devices[dev1].distance)
}
if (dev2) {
    console.log(dev2)
    console.log(device_data[dev2].dev_info)
    console.log(device_data[dev2].dev_info.name)

}
