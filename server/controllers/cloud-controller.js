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
    async getFileById(req,res,next){
        try {
            const id=req.query.id;
            if(!id){
                throw ApiError.BadRequiest('No id provided');
            }
            const fileuri=await cloudService.getFileById(id);
            
            
            res.json(fileuri);

        } catch (error) {
            next(error);
        }
    }
    async getAllFiles(req,res,next){
        try {
            
        } catch (error) {
            next(error);
        }
    }
    async deleteFileById(req,res,next){
        try {
            
        } catch (error) {
            next(error);
        }
    }
    async updateFilesById(req,res,next){
        try {
            
        } catch (error) {
            next(error);
        }
    }
}

module.exports=new CloudController();