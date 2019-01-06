let DatabaseObject = require("../baseObject/DatabaseObject").DatabaseObject
let SceneSetting = require("../sceneSetting/SceneSetting").SceneSetting
let Sensor = require("../sensor/Sensor").Sensor

class Room extends DatabaseObject {

    constructor() {
        super()
        this.tableName = "Room"
        this.name = "";
        this.description = "";
    }

    getTableName() {
        return "Room"
    }

    async isRoomActive() {
        let results = await this.getRoomSensors()
        if( results == null  || results.length == 0) {
            this.isActive = false
        } else {
            this.isActive = true;
            await Promise.all(results.map(async (element) => {
                if(element.isActive == false) {
                   this.isActive = false
                }
              }));  
        }
    }

    async getRoomSensors() {
        let searchParameters  = new Object()
        searchParameters.roomId = this.id
        let results = await new Sensor().getObjectsWhere("'"+ JSON.stringify(searchParameters) + "'");
        return  results
    }

    async activateRoom(active) {
        let results = await this.getRoomSensors()
        if( results != null ){
            await Promise.all(results.map(async (element) => {
                element.setActive(active)
              })); 
        }
    }

    async getNumberOfEvents() {
        let results = await this.getRoomSensors()
        var numberOfEvents = 0
        await Promise.all(results.map(async (element) => {
            numberOfEvents += await element.getNewEvents().length
            console.log("AWAIT RESULT " + numberOfEvents)
          }));  
        console.log("RETURNED NUMBER OF EVENTS " + numberOfEvents.length)
    }
}

module.exports = {
    Room
}