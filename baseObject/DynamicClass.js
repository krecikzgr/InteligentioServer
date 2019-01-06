var Scene= require('../scenes/Scene').Scene
var Sensor = require('../sensor/Sensor').Sensor
var SceneSetting = require('../sceneSetting/SceneSetting').SceneSetting
var Room = require('../room/Room').Room
var Event = require('../event/Event').Event

const classes = {
    Scene,
    Sensor,
    SceneSetting,
    Room,
    Event
};

class DynamicClass {
    constructor (className) {
        return new classes[className]();
    }
}

module.exports = {
    DynamicClass
}