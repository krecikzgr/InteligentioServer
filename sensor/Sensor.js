let DatabaseObject = require("../baseObject/DatabaseObject").DatabaseObject
let Event = require("../event/Event").Event


class Sensor extends DatabaseObject {

    constructor() {
        super()
        this.tableName = "Sensor"
        this.isActive = false;
        this.roomId = 0
        this.name = "";
        this.description = "";
        this.type = 0
    }

    getTableName() {
        return "Sensor"
    }

    async isSensorActive() {
        //TODO READ THE VALUE FROM ARDUINO
        this.isActive = false
        return false;
    }

    async setActive(active) {
        if(active != this.isActive ){
            let event = new Event()
            event.message = "Sensor " + this.name + " changed state to " + active;
            event.sensorId = this.id
            await event.store();
        }
        //TODO SET THE VALUE ON ARDUINO
        this.isActive = active
        await this.store()
    }

    async getNewEvents() {
        let searchParameters  = new Object()
        searchParameters.sensorId = this.id
        searchParameters.readed = false;
        let results = await new Event().getObjectsWhere("'"+ JSON.stringify(searchParameters) + "'");
        this.newEvents = results.length
        return results
    }

    async applySetting(sceneSetting){
        this.setActive(sceneSetting.isActive)
    }
}

module.exports = {
    Sensor
};
