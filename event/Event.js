let DatabaseObject = require("../baseObject/DatabaseObject").DatabaseObject

//Event types:
//0-LightStateChanged
//

class Event extends DatabaseObject {
    constructor() {
        super()
        this.message = "";
        this.readed = false
        this.timeStamp = new Date().toISOString()
        this.tableName = "Event"
        this.sensorId = 0
    }

    getTableName() {
        return "Event"
    }

    async setAsReaded(readed){
        this.readed = readed
        await this.store()
    }
}

module.exports = {
    Event
}