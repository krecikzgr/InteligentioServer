const EventEmitter = require('events');
const 

class ScenesEmmiter extends EventEmitter {

constructor(){
  super()
    this.registerEmmiter()
  }
  
  registerEmmiter() {
    this.on('sceneUpdated' , (scene) => {
      console.log("Scene has been updated " + scene.id)
    });
  }
}

module.exports = {
  ScenesEmmiter
}