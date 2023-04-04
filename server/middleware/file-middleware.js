const ApiError=require('../exceptions/api-error');
const cloudService=require('../service/cloud-service');
module.exports=async function(req,res,next){
    try{
        const fileId=req.query.id || req.body.id;
        const userDto=req.user;
        if(!fileId || !userDto) return next(ApiError.BadRequiest("No id provided"));

        if(await cloudService.validateFile(userDto,fileId)){
            req.fileId=fileId;
            return next();
        }

        return next(ApiError.BadRequiest("File is not yours or file with this id does not exist"));

    }catch(e){
        return next(new ApiError(500,"Unexpected error"));
    }
}