const ApiError=require('../exceptions/api-error');
const fileShareService=require('../service/fileshare-service');
class FileShareController{
    async addFile(req,res,next){
        try {
            const fileInfo=req.files.file;
            if(!fileInfo){
                throw ApiError.BadRequiest('No file uploaded');
            }

            const fileShareDto=req.fileShare;
            const file=await fileShareService.addFile(fileShareDto,fileInfo);
            res.json(file);


        } catch (error) {
            next(error);
        }
    }
    
    //actually,returns ID and naes of files user have
    async getAllFiles(req,res,next){
        try {

            const fileShareDto=req.fileShare;
            const files=await fileShareService.getAllFiles(fileShareDto);
            
            res.json(files);
        } catch (error) {
            next(error);
        }
    }
    async getFileById(req,res,next){
        try {
            const fileId=req.fileId;
            const fileURL=await fileShareService.getFileById(fileId);
            
            
            res.sendFile(fileURL);

        } catch (error) {
            next(error);
        }
    }
    async deleteFileById(req,res,next){
        try {
            const fileId=req.fileId;

            const fileShareDto=req.fileShare;
            const files=await fileShareService.deleteFileById(fileShareDto,fileId);

            res.json(files);
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

            const fileShareDto=req.fileShare;

            const files=await fileShareService.updateFileById(fileId,fileShareDto,newName);

            res.json(files);
        } catch (error) {
            next(error);
        }
    }
    async addAllowedUser(req,res,next){
        try {
            const {userMail}=req.body;
            if(!userMail)throw ApiError.BadRequiest('No userMail  provided');
            const fileShareId=req.fileShare.id;

            const fileShare=await fileShareService.addAlowedUser(fileShareId,userMail);

            res.json(fileShare);
            

        } catch (error) {
            next(error);
        }
    }
    async addUsersFile(req,res,next){
        try{
            const fileId=req.fileId;
            const fileShareId=req.fileShare.id;
            
            const fileShare=await fileShareService.addUsersFile(fileShareId,fileId);

            res.json(fileShare);
        }catch(error){
            next(error);
        }
    }
    async deleteFileShare(req,res,next){
        try{
            const fileShareId=req.fileShare.id;

            const fileShare=await fileShareService.deleteFileShare(fileShareId);

            res.json(fileShare);
        }catch(error){
            next(error);
        }
    }
    async leaveFileShare(req,res,next){
        try {
            const fileShareId=req.fileShare.id;
            const userId=req.user.id;

            const fileShare=await fileShareService.leaveFileShare(fileShareId,userId);

            res.json(fileShare);
        } catch (error) {
            next(error);
        }
    }
    async getFileShareLink(req,res,next){
        try{
            const fileShareId=req.fileShare.id;

            const link=await fileShareService.getFileShareLink(fileShareId);

            res.send(link);
        }catch(error){
            next(error);
        }
        
    }
}

module.exports=new FileShareController();