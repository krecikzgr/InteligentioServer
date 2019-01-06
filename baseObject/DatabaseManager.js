var db =  require('../db/db')
var dynamicClass = require('../baseObject/DynamicClass')

const DynamicClass =  dynamicClass.DynamicClass

class DatabaseManager {
    constructor() {
    }

    async getObjects (name, start, size){
        let results = []
        try {
            let databaseResults = await db.getObjects(name, start, size)
            databaseResults.forEach(element => {
                console.log(element.id)
                let dynamicObejct = new DynamicClass(name);
                dynamicObejct.populate(element);
                results.push(dynamicObejct);
            });
        } catch (e) {
            console.log("Get objects error  " + e + " with class name " + name)
        }
        return results
    }

    async getObject(name, id) {
        if(Number.isNaN(id)) {
            return null
        }
        let databaseResult = await db.getObject(name,id)
        if (databaseResult == null){
            return null
        } else {
            let dynamicClass = new DynamicClass(name);
            dynamicClass.populate(databaseResult);
            return dynamicClass
        }
    }

    async getObjectsWhere(name, whereCause) {
        let results = []
        try {
            let databaseResults = await db.getObjectsWhere(name, whereCause)
            databaseResults.forEach(element => {
                console.log(element.id)
                let dynamicObejct = new DynamicClass(name);
                dynamicObejct.populate(element);
                results.push(dynamicObejct);
            });
        } catch (e) {
            console.log("Get objects error  " + e + " with class name " + name)
        }
        return results
    }
}

module.exports = {
    DatabaseManager
}