const ApiError=require('../exceptions/api-error');
const FileShareService=require('../service/fileshare-service');
module.exports=async function(req,res,next){
    try{
        const fileId=req.query.id || req.body.id;
        const fileShareId=req.fileShare.id;
        if(!fileId || !fileShareId) return next(ApiError.BadRequiest("No id provided"));
        if(await FileShareService.validateFile(fileId,fileShareId)){
            req.fileId=fileId;
            return next();
        }

        return next(ApiError.BadRequiest("File is not yours or file with this id does not exist"));

    }catch(e){
        return next(new ApiError(500,"Unexpected error"));
    }
}