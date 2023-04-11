const Router=require('express').Router;
const cloudRouter=new Router();
const authMiddleware=require('../middleware/auth-middleware');
const cloudController=require('../controllers/cloud-controller');
const fileMiddleware=require('../middleware/file-middleware');
const fileShareRouter=require('../router/fileshare-router');

cloudRouter.use(authMiddleware);
cloudRouter.use('/fileShare',fileShareRouter);


cloudRouter.post('/addFile',cloudController.addFile);
cloudRouter.get('/getAllFiles',cloudController.getAllFiles);
cloudRouter.put('/updateFileById',fileMiddleware,cloudController.updateFileById);
cloudRouter.get('/getFileById',fileMiddleware,cloudController.getFileById)
cloudRouter.delete('/deleteFileById',fileMiddleware,cloudController.deleteFileById);


module.exports=cloudRouter;
