const EventEmitter = require('events');


class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
const myEmitter2 = new MyEmitter();
let m = 0,n=0;
myEmitter.on('event',() => {
  console.log("M value:",++m);
})
myEmitter.emit('emit');
myEmitter.emit('event');
myEmitter2.once('event', () => {
  console.log("N value:",++n);
});
myEmitter2.emit('event');
// Prints: 1
myEmitter2.emit('event');
//Ignored