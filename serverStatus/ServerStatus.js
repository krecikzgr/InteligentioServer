// class ServerStatus {
//     constructor() {
//         super()
//         this.tableName = "Sensor"
//         this.isActive = false;
//         this.roomId = 0
//         this.name = "";
//         this.description = "";
//         this.id = -1
//         this.type = 0
//     }

//     getTableName() {
//         return "Sensor"
//     }

//     async isActive() {
//         //TODO READ THE VALUE FROM ARDUINO
//         this.isActive = false
//         return false;
//     }

//     async setActive(active) {
//         //TODO SET THE VALUE ON ARDUINO
//         this.isActive = active
//         await this.store()
//     }

//     async applySetting(sceneSetting){
//         this.setActive(sceneSetting.isActive)
//     }
// }

// module.exports = {
//     SServerStatus
// };