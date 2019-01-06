const DatabaseManager = require("../baseObject/DatabaseManager").DatabaseManager
const Event= require("./Event").Event
const ResponseBuilder = require('../utils/ResponseBuilder').ResponseBuilder

const validation = require("../server/common/Validation")
const queryUtil = require('../utils/queryUtils')
const stringUtil = require('../utils/StringUtils')
const yup = require('yup');
const databaseManager = new DatabaseManager()

const basePath = 'event';

module.exports = server => {
    server.get('/'+basePath, async (req, res, next) => {
        let responseBuilder = new ResponseBuilder();
        let paging = queryUtil.getPageAndSize(req);
        let results = await databaseManager.getObjects(stringUtil.capitalize(basePath), paging.start, paging.size)
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
};

