const ApiError=require('../exceptions/api-error');
const fileShareService=require('../service/fileshare-service');
module.exports=async function(req,res,next){
    try{
        const fileShareId=req.query.fileShareId || req.body.fileShareId;
        const userDto=req.user;
        if(!fileShareId || !userDto) return next(ApiError.BadRequiest("No id provided"));

        if(await fileShareService.validateUser(fileShareId,userDto)){
            req.fileShare={id:fileShareId};
            return next();
        }
        return next(ApiError.BadRequiest("FileShare is not yours or fileShare with this id does not exist"));
    }catch(e){
        console.log(e);
        return next(new ApiError(500,"Unexpected error"));
    }
}