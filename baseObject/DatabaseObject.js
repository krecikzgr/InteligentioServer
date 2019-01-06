var db = require('../db/db')

class DatabaseObject {
    
    constructor () {
        this.tableName = ""
    }
    
    static getTableName() {
        return ""
    }

    pupulateWithJson(jsonString) {
        let dataObject = JSON.parse(jsonString);
        
        Object.keys(dataObject).forEach(element => {
            this[element] = dataObject[element];
        });
    } 

    populate(databaseObject) {
        this.id = databaseObject.id;
        let dataObject = JSON.stringify(databaseObject.data);
        this.pupulateWithJson(dataObject);
    }
    
    pupulateWithObject(dataObject) {
        Object.keys(dataObject).forEach(element => {
            this[element] = dataObject[element];
        });
    }

   async store() { 
       await this.initTable();
       const secondOobject = new Object();
       Object.assign(secondOobject, this);
       delete secondOobject["id"];
       delete secondOobject["tableName"];
       const stringifyResult = JSON.stringify(secondOobject);
       console.log("stringify result " + stringifyResult)
       await db.insertObject(this.tableName, stringifyResult, this.id);
       this.didUpdate()
    }

    async initTable() {
        await db.createTable(this.tableName, "id");
    }

    async didUpdate() {
        
    }

    async loadWith(id) {
        try {
            const parsedInt = parseInt(id);
            const result = await db.getObject(this.tableName, parsedInt)
            if( result == null ) {
                return false
            }
            await this.populate(result);
            return true
        } catch(err) {
            console.log(err)
            return false
        }
    }

    async getObjects(start, size){
        let results = []
        try {
            let databaseResults = await db.getObjects(this.getTableName(), start, size)
            databaseResults.forEach(element => {
                let dynamicObejct = new this.constructor();
                dynamicObejct.populate(element);
                results.push(dynamicObejct);
            });
        } catch (e) {
            console.log("Get objects error  " + e + " with class name " +  this.getTableName())
        }
        return results
    }

    async getObject(id) {
        if(Number.isNaN(id)) {
            return null
        }
        let databaseResult = await db.getObject(this.tableName,id)
        if (databaseResult == null){
            return null
        } else {
            let dynamicClass = new this.constructor();
            dynamicClass.populate(databaseResult);
            return dynamicClass
        }
    }

    async getObjectsWhere(whereCause) {
        let results = []
        try {
            let databaseResults = await db.getObjectsWhere(this.tableName, whereCause)
            databaseResults.forEach(element => {
                let dynamicObejct = new this.constructor();
                dynamicObejct.populate(element);
                results.push(dynamicObejct);
            });
        } catch (e) {
            console.log("Get objects error  " + e + " with class name " + this.tableName)
        }
        return results
    }

}

module.exports = {
    DatabaseObject
}