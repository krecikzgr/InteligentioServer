const networkScanner = require('../networkScanner/networkScanner')

const getEndDevices = (start, size) => {
    return networkScanner.availableServices
};

const getEndDevice = id => {
    const deviceId = parseInt(id, 10);
    return networkScanner.availableServices.find(device => device.id == deviceId);
};

module.exports = {
    getEndDevices,
    getEndDevice
};
