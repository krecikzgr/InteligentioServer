let DatabaseService = require("../baseObject/DatabaseObject");

class SceneSetting extends DatabaseService.DatabaseObject {
    constructor() {
        super()
        this.tableName = "SceneSetting"
        this.isActive = false;
        this.sensorId = 0
        this.sceneId = 0
        this.type = 0
    }

    getTableName() {
        return "SceneSetting"
    }
}



module.exports = {
    SceneSetting
};
