const Router=require('express').Router;
const cloudRouter=new Router();
const authMiddleware=require('../middleware/auth-middleware');
const cloudController=require('../controllers/cloud-controller');

cloudRouter.use(authMiddleware);


cloudRouter.post('/addFile',cloudController.addFile);
cloudRouter.put('/updateFileById',cloudController.updateFileById);
cloudRouter.get('/getFileById',cloudController.getFileById)
cloudRouter.get('/getAllFiles',cloudController.getAllFiles);
cloudRouter.delete('/deleteFileById',cloudController.deleteFileById);


module.exports=cloudRouter;
