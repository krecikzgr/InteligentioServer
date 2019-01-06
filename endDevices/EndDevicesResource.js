const endDevicesService = require('./EndDevicesService')
const axios = require('axios');
var db = require('../db/db')
var queryUtil = require('../utils/queryUtils')

module.exports = server => {
    server.get('/endDevices/', async (req, res, next) => {
        let paging = queryUtil.getPageAndSize(req);

        const pagedDevices = endDevicesService.getEndDevices(paging.page,paging.size)
        // const pagedDevices = await db.getObjects("sensor",paging.page,paging.size);
        // const result = await db.getObject("sensor",12341234);
        // res.send(result);
        res.send(pagedDevices);
        next();
    });


    server.post('/endDeviceAction/:id', (req, res, next) => {
        console.log(req.params.id);
        const deviceId = parseInt(req.params.id, 10);
        console.log(deviceId);
        const device = endDevicesService.getEndDevice(deviceId);
        if (device) {
            res.send(device)
        } else {
            res.send(404)
        }
        next();
    });

    server.post('/light/:id', (req,res,next) => {
        const deviceId = parseInt(req.params.id, 10);
        console.log(req.params.id);
        const device = endDevicesService.getEndDevice(deviceId)
        console.log(deviceId);
        axios({
            method:'post',
            url:'http://'+device.adress+ ':3001/changeLight'
          })
        .then(function(response) {
            console.log(response.data);
            res.send(response.data);
            next();
        })
        .catch(function (error) {
            console.log(error);
          })
        next();
    });
};

