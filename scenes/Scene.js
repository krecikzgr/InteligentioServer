
let DatabaseObject = require("../baseObject/DatabaseObject").DatabaseObject
let SceneSetting = require("../sceneSetting/SceneSetting").SceneSetting
let Sensor = require("../sensor/Sensor").Sensor

class Scene extends DatabaseObject {

    constructor() {
        super()
        this.tableName = "Scene"
        this.name = "";
        this.description = "";
        this.type = 0
    }

    getTableName() {
        return "Scene"
    }

    async isSceneActive() {
        let results = await this.getSceneSettings()
        if( results == null  || results.length == 0) {
            this.isActive = false
        } else {
            this.isActive = true;
            await Promise.all(results.map(async (element) => {
                let sensor = new Sensor()
                let resultSensor = await sensor.getObject(element.sensorId)
                if(resultSensor.isActive != element.isActive) {
                   this.isActive = false
                }
              }));  
        }
    }

    async getSceneSettings() {
        let searchParameters  = new Object()
        searchParameters.sceneId = this.id
        console.log("ACTIVATE SCENE PARAMETERS " + JSON.stringify(searchParameters));
        let results = await new SceneSetting().getObjectsWhere("'"+ JSON.stringify(searchParameters) + "'");
        return results
    }

    async activateScene() {
        let results = await this.getSceneSettings()
        if( results != null ){
            results.forEach(async element => {
                let sensor = new Sensor()
                let resultSensor = await sensor.getObject(element.sensorId)
                if(resultSensor != null) {
                    await resultSensor.applySetting(element)
                }
            })
        }
    }
}

module.exports = {
    Scene
}