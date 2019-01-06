const DatabaseManager = require("../baseObject/DatabaseManager").DatabaseManager
const Room = require("./Room").Room;
const ResponseBuilder = require('../utils/ResponseBuilder').ResponseBuilder

const validation = require("../server/common/Validation")
const queryUtil = require('../utils/queryUtils')
const stringUtil = require('../utils/StringUtils')
const yup = require('yup');
const databaseManager = new DatabaseManager()

const basePath = 'room';

module.exports = server => {
    server.get('/'+basePath, async (req, res, next) => {
        let responseBuilder = new ResponseBuilder();
        let paging = queryUtil.getPageAndSize(req);
        let results = await databaseManager.getObjects(stringUtil.capitalize(basePath), paging.start, paging.size)
        await Promise.all(results.map(async (element) => {
            await element.isActive()
          }));
        responseBuilder.withJsonData(results).withMessage("Objects").build(res);
        next();
    });

    server.get('/'+basePath+'/:id', async  (req,res,next) => {
        let responseBuilder = new ResponseBuilder();
        const objectId = parseInt(req.params.id, 10);
        const obj = await databaseManger.getObject(stringUtil.capitalize(basePath), objectId);
        if (obj == null) {
            responseBuilder.withHttpResourceNotAvailable().withMessage("Resource not found").build(res)
        } else { 
            res.send(obj);
        }
        next()
    });

    server.put('/'+basePath+'/', validation.validatePostBody({
        name: yup.string().min(3).max(100).required(),
        description: yup.string().max(200).notRequired(),
        //Add here the possibility to input the scene settings values
    }), async (req,res,next) => {
        let newObject = new Room();
        newObject.pupulateWithObject(req.body)
        newObject.store();
        res.send(newObject);
        next();
    });

    server.patch('/'+basePath+'/:id', validation.validatePostBody({
        name: yup.string().min(3).max(100).required(),
        description: yup.string().max(300)
    }), validation.validateQueryParams({})
    , async (req,res,next) => {
        let responseBuilder = new ResponseBuilder();
        const sceneId = parseInt(req.params.id, 10);
        let objectToUpdate = Room()
        let result = await objectToUpdate.loadWith(sceneId)
        if( result == true ) {
            objectToUpdate.pupulateWithObject(req.body)
            await objectToUpdate.store()
            responseBuilder.withMessage("Object updated").withJsonData(objectToUpdate).build(res)
        } else {
            responseBuilder.withHttpResourceNotAvailable().withMessage("Resource not found").build(res)
        }
        next();
    });
    
    server.patch('/'+basePath+'/:id/activate', validation.validatePostBody({
        isActive: yup.boolean().required()
    }), async (req,res,next) => {
        let responseBuilder = new ResponseBuilder();
        const objectId = parseInt(req.params.id, 10);
        let objectToUpdate = new Room()
        let result = await objectToUpdate.loadWith(objectId)
        if( result == true ) {
            await objectToUpdate.activateRoom(req.body.isActive)
            await objectToUpdate.isRoomActive()
            responseBuilder.withMessage("Room\'" + objectToUpdate.name + "\' is actiaved ").withJsonData(objectToUpdate).build(res)
        } else {
            responseBuilder.withHttpResourceNotAvailable().withMessage("Resource not found").build(res)
        }
        next();
    });

    // server.post('/endDeviceAction/:id', (req, res, next) => {
    //     console.log(req.params.id);
    //     const deviceId = parseInt(req.params.id, 10);
    //     console.log(deviceId);
    //     const device = endDevicesService.getEndDevice(deviceId);
    //     if (device) {
    //         res.send(device)
    //     } else {
    //         res.send(404)
    //     }
    //     next();
    // });

    // server.post('/light/:id', (req,res,next) => {
    //     const deviceId = parseInt(req.params.id, 10);
    //     console.log(req.params.id);
    //     const device = endDevicesService.getEndDevice(deviceId)
    //     console.log(deviceId);
    //     axios({
    //         method:'post',
    //         url:'http://'+device.adress+ ':3001/changeLight'
    //       })
    //     .then(function(response) {
    //         console.log(response.data);
    //         res.send(response.data);
    //         next();
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //       })
    //     next();
    // });
};

