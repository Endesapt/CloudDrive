const Router=require('express').Router;
const fileShareRouter=new Router();
const fileShareController=require('../controllers/fileshare-controller');
const fileShareMiddleware=require('../middleware/fileshare-middleware');
const fileShareFileMiddleware=require('../middleware/fileshare-file-middleware');
const fileMiddleware=require('../middleware/file-middleware')

fileShareRouter.use(fileShareMiddleware);

fileShareRouter.post('/addFile',fileShareController.addFile);
fileShareRouter.get('/getAllFiles',fileShareController.getAllFiles);
fileShareRouter.put('/updateFileById',fileShareFileMiddleware,fileShareController.updateFileById);
fileShareRouter.get('/getFileById',fileShareFileMiddleware,fileShareController.getFileById);
fileShareRouter.delete('/deleteFileById',fileShareFileMiddleware,fileShareController.deleteFileById);
fileShareRouter.put('/addAllowedUser',fileShareController.addAllowedUser);
fileShareRouter.post('/addUsersFile',fileMiddleware,fileShareController.addUsersFile);
fileShareRouter.post('/deleteFileShare',fileShareMiddleware,fileShareController.deleteFileShare);
fileShareRouter.post('/leaveFileShare',fileShareMiddleware,fileShareController.leaveFileShare);
fileShareRouter.post('/getFileShareLink',fileShareController.getFileShareLink);

module.exports=fileShareRouter;