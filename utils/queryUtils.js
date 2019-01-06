
const getPageAndSize = req => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    const size = req.query.size ? parseInt(req.query.size, 10) : 10;
    const start = (page - 1) * size;
    return {
        size:size,
        page:page,
        start:start
    }
}


module.exports = {
    getPageAndSize
};
