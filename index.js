const server = require('./server/Server');
const endDevicesResource = require('./endDevices/EndDevicesResource')
const scenesResource = require('./scenes/ScenesResource')
const sensorResource = require('./sensor/SensorResource')
const sceneSettingResource = require('./sceneSetting/SceneSettingResource')
const roomResource = require('./room/RoomResource')
//const baseResource = require('./scenes/ScenesResource');


const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
    projectId: 'inteligentio-868bf',
    keyFilename: 'Inteligentio-dc3ac6475a63.json',
  });

  let query = firestore.collection('Sensor');

  var observer = query.onSnapshot(querySnapshot => {
    console.log(`Received query snapshot of size ${querySnapshot.size}`);
  }, err => {
    console.log(`Encountered error: ${err}`);
  });



server.start();
server.register(endDevicesResource);
server.register(scenesResource);
server.register(sensorResource);
server.register(sceneSettingResource);
server.register(roomResource)