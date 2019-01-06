const databaseService = require("../baseObject/DatabaseManager")
const scenesService = require("./Scene");

const validation = require("../server/common/Validation")
const queryUtil = require('../utils/queryUtils')
const yup = require('yup');


const databaseManger = new databaseService.DatabaseManager();
const Scene = scenesService.Scene;
const ResponseBuilder = require('../utils/ResponseBuilder').ResponseBuilder
const basePath = 'scene';

module.exports = server => {
    server.get('/'+basePath, async (req, res, next) => {
        let responseBuilder = new ResponseBuilder();
        let paging = queryUtil.getPageAndSize(req);
        let results = await databaseManger.getObjects("Scene", paging.start, paging.size)
        await Promise.all(results.map(async (element) => {
            await element.isSceneActive()
          }));
        responseBuilder.withJsonData(results).withMessage("Objects").build(res);
        next();
    });

    server.get('/'+basePath+'/:id', async  (req,res,next) => {
        let responseBuilder = new ResponseBuilder();
        const sceneId = parseInt(req.params.id, 10);
        const obj = await databaseManger.getObject("Scene", sceneId);
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
        let testScene = new Scene();
        testScene.pupulateWithObject(req.body)
        testScene.isActive = false;
        testScene.store();
        res.send(testScene);
        next();
    });

    server.patch('/'+basePath+'/:id', validation.validatePostBody({
        name: yup.string().min(3).max(100).required(),
        description: yup.string().max(300)
    }), validation.validateQueryParams({})
    , async (req,res,next) => {
        let responseBuilder = new ResponseBuilder();
        const sceneId = parseInt(req.params.id, 10);
        let scene = new Scene()
        let result = await scene.loadWith(sceneId)
        if( result == true ) {
            scene.pupulateWithObject(req.body)
            await scene.store()
            responseBuilder.withMessage("Object updated").withJsonData(scene).build(res)
        } else {
            responseBuilder.withHttpResourceNotAvailable().withMessage("Resource not found").build(res)
        }
        next();
    });
    
    server.patch('/'+basePath+'/:id/activate', validation.validatePostBody({
        isActive: yup.boolean().required()
    }), async (req,res,next) => {
        let responseBuilder = new ResponseBuilder();
        const sceneId = parseInt(req.params.id, 10);
        let scene = new Scene()
        let result = await scene.loadWith(sceneId)
        if( result == true ) {
            await scene.activateScene()
            await scene.isSceneActive()
            responseBuilder.withMessage("Scene\'" + scene.name + "\' is actiaved ").withJsonData(scene).build(res)
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

