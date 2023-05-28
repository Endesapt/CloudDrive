const ApiError=require('../exceptions/api-error');
const cloudService=require('../service/cloud-service');
class CloudController{
    async addFile(req,res,next){
        try {
            const fileInfo=req.files.file;
            if(!fileInfo){
                throw ApiError.BadRequiest('No file uploaded');
            }

            const userDto=req.user;
            const files=await cloudService.addFile(userDto,fileInfo);
            res.json(files);


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
            const fileURL=await cloudService.getFileById(fileId);
            
            
            res.sendFile(fileURL);

        } catch (error) {
            next(error);
        }
    }
    async deleteFileById(req,res,next){
        try {
            const fileId=req.fileId;

            const userDto=req.user;
            const files=await cloudService.deleteFileById(userDto,fileId);

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

            const userDto=req.user;

            const files=await cloudService.updateFileById(fileId,userDto,newName);

            res.json(files);
        } catch (error) {
            next(error);
        }
    }
    async addFileShare(req,res,next){
        try {
            const {name}=req.body;
            const userDto=req.user;
            if(!name)throw ApiError.BadRequiest('No name provided');

            const fileShares=await cloudService.addFileShare(userDto,name);

            res.json(fileShares);
        } catch (error) {
            next(error);
        }

    }
    async getFileShares(req,res,next){
        try {
            const userDto=req.user;

            const fileShares=await cloudService.getFileShares(userDto);

            res.json(fileShares);
        } catch (error) {
            next(error);
        }
    }
    async addFileShareLink(req,res,next){
        try{
            const userDto=req.user;
            const fileShareLink=req.params.id;

            const fileShare=await cloudService.addFileShareLink(userDto,fileShareLink);

            res.redirect('http://localhost:5000/');
        }catch(error){
            next(error)
        }
    }
}

module.exports=new CloudController();