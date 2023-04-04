const ApiError=require('../exceptions/api-error');
const cloudService=require('../service/cloud-service');
class CloudController{
    async addFile(req,res,next){
        try {
            const fileInfo=req.files["undefined"];
            if(!fileInfo){
                throw ApiError.BadRequiest('No file uploaded');
            }

            const userDto=req.user;
            const file=await cloudService.addFile(userDto,fileInfo);
            res.json(file);


        } catch (error) {
            next(error);
        }
    }
    
    //actually,returns ID and naes of files user have
    async getAllFiles(req,res,next){
        try {

            const userDto=req.user;
            const files=await cloudService.getAllFiles(userDto);
            
            res.json(files);
        } catch (error) {
            next(error);
        }
    }
    async getFileById(req,res,next){
        try {
            const fileId=req.fileId;
            const fileuri=await cloudService.getFileById(fileId);
            
            
            res.json(fileuri);

        } catch (error) {
            next(error);
        }
    }
    async deleteFileById(req,res,next){
        try {
            const fileId=req.fileId;

            const userDto=req.user;
            const file=await cloudService.deleteFileById(userDto,fileId);

            res.json(file);
        } catch (error) {
            next(error);
        }
    }
    async updateFileById(req,res,next){
        try {
            const {newName}=req.body;
            const fileId=req.fileId;
            if(!fileId || !newName){
                throw ApiError.BadRequiest('No id or no name provided');
            }

            const userDto=req.user;

            const file=await cloudService.updateFileById(fileId,userDto,newName);

            res.json(file);
        } catch (error) {
            next(error);
        }
    }
}

module.exports=new CloudController();