const UserModel=require('../models/user-model');
const ApiError =require('../exceptions/api-error');
const FileModel=require('../models/file-model');
const FileShareService=require('../service/fileshare-service');
class CloudService{
    async validateFile(userDto,fileId){
        try{
            const user=await UserModel.findById(userDto.id);
            if(user.files.findIndex(file=>file.id==fileId)<0){
                return null;
            }
            return true;
        }catch{
            return null;
        }
    }
    async addFile(userDto,fileInfo){
        const user=await UserModel.findById(userDto.id);
        if(!user){
            throw ApiError.BadRequiest(`пользователь ${user} не существует`);
        }

        const filename=fileInfo.name;
        const data=fileInfo.data;
        const mimetype=fileInfo.mimetype;
        const encoding=fileInfo.encoding;

        const file=await FileModel.create({
            name:filename,
            data:data,
            mimetype:mimetype,
            encoding:"base64"

        });
        
        user.files.push({id:file.id,name:filename});
        user.save();

        return file;
    }
    async getFileById(fileId){
        const file=await FileModel.findById(fileId);
        if(!file){
            throw ApiError.BadRequiest('Такого файла не существует');
        }

        const mimetype=file.mimetype;
        const encoding=file.encoding;
        const data=file.data.toString(encoding);
        const uri='data:' + mimetype + ';' + encoding + ',' + data;

        return uri;
    }
    async getAllFiles(userDto){

        const user= await UserModel.findById(userDto.id);
        if(!user){
            throw ApiError.BadRequiest(`There is no user with id ${userDto.id}`);
        }

        return user.files;
    }
    async deleteFileById(userDto,fileId){
        const user= await UserModel.findById(userDto.id);
        if(!user){
            throw ApiError.BadRequiest(`There is no user with id ${userDto.id}`);
        }
        const file=await FileModel.findByIdAndDelete(fileId);
        const fileIndex=user.files.findIndex(file=>file.id==fileId);
        user.files.splice(fileIndex,1);
        user.save();
        return file;

    }
    async updateFileById(fileId,userDto,newName){
        const user= await UserModel.findById(userDto.id);
        if(!user){
            throw ApiError.BadRequiest(`There is no user with id ${userDto.id}`);
        }
        const file=await FileModel.findById(fileId);
        const newFileName=file.name.replace(/.+(\..+)$/,`${newName}$1`);
        file.name=newFileName;
        file.save();

        //updating name in user database;
        const fileIndex=user.files.findIndex(file=>file.id==fileId);
        user.files[fileIndex].name=newFileName;
        user.markModified(`files`);
        user.save();

        return file;

    }
    async addFileShare(userDto,name){
        const user= await UserModel.findById(userDto.id);
        if(!user){
            throw ApiError.BadRequiest(`There is no user with id ${userDto.id}`);
        }
        
        const fileShare=await FileShareService.createFileShare(name,userDto.id);

        user.fileShares.push(fileShare.id);
        user.save();
        return fileShare;


    }
}
module.exports=new CloudService();
