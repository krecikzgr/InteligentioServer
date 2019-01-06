const sceneSettingService = require("./SceneSetting");
const databaseService = require("../baseObject/DatabaseManager")

const validation = require("../server/common/Validation")
const queryUtil = require('../utils/queryUtils')
const stringUtil = require('../utils/StringUtils')
const yup = require('yup');

const SceneSetting = sceneSettingService.SceneSetting;
const ResponseBuilder = require('../utils/ResponseBuilder').ResponseBuilder
const databaseManger = new databaseService.DatabaseManager();
const basePath = 'sceneSetting';

module.exports = server => {
    server.get('/'+basePath, async (req, res, next) => {
        let responseBuilder = new ResponseBuilder();
        let paging = queryUtil.getPageAndSize(req);
        let results = await databaseManger.getObjects(stringUtil.capitalize(basePath), paging.start, paging.size)
        responseBuilder.withJsonData(results).withMessage("Objects").build(res);
        next();
    });

    server.put('/'+basePath+'/', validation.validatePostBody({
        isActive: yup.boolean().required(),
        sensorId: yup.number().integer().required(),
        sceneId: yup.number().integer().required()
    }), async (req,res,next) => { 
        let responseBuilder = new ResponseBuilder(); 
        let object = new SceneSetting();
        object.pupulateWithObject(req.body)
        await object.store();
        responseBuilder.withJsonData(object).withMessage("Object created").build(res);
        next();
    });

};