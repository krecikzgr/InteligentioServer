var bonjour = require('bonjour')()
var availableServices = [];

const discover = () => {
    bonjour = require('bonjour')()
    bonjour.find({ type: 'HAD' }, function (service) {

        var availableService = {
            id: service.addresses[0].split('.').join(""),
            adress: service.addresses[0],
            name:service.name,
            port:service.port,
            host:service.host};
        availableServices.push(availableService);

    })
}

module.exports = {
    discover,
    availableServices
};

