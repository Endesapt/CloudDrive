const Router=require('express').Router;
const fileShareRouter=new Router();
const fileShareController=require('../controllers/fileshare-controller');
const fileShareMiddleware=require('../middleware/fileshare-middleware');


fileShareRouter.use(fileShareMiddleware);

fileShareRouter.post('/addFile',fileShareController.addFile);
fileShareRouter.get('/getAllFiles',fileShareController.getAllFiles);
fileShareRouter.put('/updateFileById',fileShareController.updateFileById);
fileShareRouter.get('/getFileById',fileShareController.getFileById);
fileShareRouter.delete('/deleteFileById',fileShareController.deleteFileById);


module.exports=fileShareRouter;