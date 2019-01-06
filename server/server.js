
var restify = require('restify');
var networkScanner = require('../networkScanner/networkScanner');

const server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

module.exports = {
    start() {
        server.listen(3001, () => {
            console.log('server up');  
            networkScanner.discover(); 
        })
    },
    register(resource){
        resource(server);
    },
    getServer(){
        return server;
    }
};
