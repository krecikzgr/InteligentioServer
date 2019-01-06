var Scene= require('../scenes/Scene').Scene
var Sensor = require('../sensor/Sensor').Sensor
var SceneSetting = require('../sceneSetting/SceneSetting').SceneSetting
var Room = require('../room/Room').Room

const classes = {
    Scene,
    Sensor,
    SceneSetting,
    Room
};

class DynamicClass {
    constructor (className) {
        return new classes[className]();
    }
}

module.exports = {
    DynamicClass
}