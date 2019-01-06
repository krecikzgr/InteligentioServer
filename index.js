const server = require('./server/Server');
const endDevicesResource = require('./endDevices/EndDevicesResource')
const scenesResource = require('./scenes/ScenesResource')
const sensorResource = require('./sensor/SensorResource')
const sceneSettingResource = require('./sceneSetting/SceneSettingResource')
const roomResource = require('./room/RoomResource')
const eventResource = require('./event/EventResource')
//const baseResource = require('./scenes/ScenesResource');

server.start();
server.register(endDevicesResource);
server.register(scenesResource);
server.register(sensorResource);
server.register(sceneSettingResource);
server.register(roomResource)
server.register(eventResource);
