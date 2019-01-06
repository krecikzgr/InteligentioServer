const sensorsService = require("./Sensor");
const databaseService = require("../baseObject/DatabaseManager")

const validation = require("../server/common/Validation")
const queryUtil = require('../utils/queryUtils')
const stringUtil = require('../utils/StringUtils')
const yup = require('yup');

const Sensor = sensorsService.Sensor;
const ResponseBuilder = require('../utils/ResponseBuilder').ResponseBuilder
const databaseManger = new databaseService.DatabaseManager();
const basePath = 'sensor';

module.exports = server => {
    server.get('/'+basePath, async (req, res, next) => {
        let responseBuilder = new ResponseBuilder();
        let paging = queryUtil.getPageAndSize(req);
        let results = await databaseManger.getObjects(stringUtil.capitalize(basePath), paging.start, paging.size)
        responseBuilder.withJsonData(results).withMessage("Objects").build(res);
        next();
    });

    server.get('/'+basePath+'/:id', async  (req,res,next) => {
        let responseBuilder = new ResponseBuilder();
        const sceneId = parseInt(req.params.id, 10);
        const obj = await databaseManger.getObject(stringUtil.capitalize(basePath), sceneId);
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
        type: yup.number().integer().required()
    }), async (req,res,next) => { 
        let responseBuilder = new ResponseBuilder(); 
        let object = new Sensor();
        object.pupulateWithObject(req.body)
        await object.store();
        responseBuilder.withJsonData(object).withMessage("Object created").build(res);
        next();
    });

    server.patch('/'+basePath+'/:id', validation.validatePostBody({
        name: yup.string().min(3).max(100),
        roomId: yup.number().integer(),
        type: yup.number().integer(),
        description: yup.string().max(300)
    }), validation.validateQueryParams({})
    , async (req,res,next) => {
        let responseBuilder = new ResponseBuilder();
        const sceneId = parseInt(req.params.id, 10);
        let scene = new Sensor()
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
        let sensor = new Sensor()
        let result = await sensor.loadWith(sceneId)
        if( result == true ) {
            await sensor.setActive(req.body.isActive);
            responseBuilder.withMessage("Sensor \'" + sensor.name + "\' is actiaved " + req.body.isActive).withJsonData(sensor).build(res)
        } else {
            responseBuilder.withHttpResourceNotAvailable().withMessage("Resource not found").build(res)
        }
        next();
    });
};

