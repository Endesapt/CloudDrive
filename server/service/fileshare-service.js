const FileShareModel=require('../models/fileshare-model');
const ApiError =require('../exceptions/api-error');
const FileModel=require('../models/file-model');
const userModel = require('../models/user-model');
class FileShareService{
    async validateUser(fileShareId,userDto){
        try{
            const fileShare=await FileShareModel.findById(fileShareId);
            if(fileShare.allowedUsers.indexOf(userDto.id)<0){
                return null;
            }
            return true;
        }catch(e){
            return null;
        }
    }
    async validateFile(fileId,fileShareId){
        try{
            const fileShare=await FileShareModel.findById(fileShareId);
            if(fileShare.files.findIndex(file=>file.id==fileId)<0){
                return null;
            }
            return true;
        }catch{
            return null;
        }
    }
    async addFile(fileShareDto,fileInfo){
        const fileShare=await FileShareModel.findById(fileShareDto.id);

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
        
        fileShare.files.push({id:file.id,name:filename});
        fileShare.save();

        return file.name;
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
    async getAllFiles(fileShareDto){

        const fileShare= await FileShareModel.findById(fileShareDto.id);
        if(!fileShare){
            throw ApiError.BadRequiest(`There is no fileShare with id ${fileShareDto.id}`);
        }

        return fileShare.files;
    }
    async deleteFileById(fileShareDto,fileId){
        const fileShare= await FileShareModel.findById(fileShareDto.id);
        if(!fileShare){
            throw ApiError.BadRequiest(`There is no fileShare with id ${fileShareDto.id}`);
        }
        const file=await FileModel.findByIdAndDelete(fileId);
        const fileIndex=fileShare.files.findIndex(file=>file.id==fileId);
        fileShare.files.splice(fileIndex,1);
        fileShare.save();
        return file.name;

    }
    async updateFileById(fileId,fileShareDto,newName){
        const fileShare= await FileShareModel.findById(fileShareDto.id);
        if(!fileShare){
            throw ApiError.BadRequiest(`There is no fileShare with id ${fileShareDto.id}`);
        }
        const file=await FileModel.findById(fileId);
        const newFileName=file.name.replace(/.+(\..+)$/,`${newName}$1`);
        file.name=newFileName;
        file.save();

        //updating name in fileShare database;
        const fileIndex=fileShare.files.findIndex(file=>file.id==fileId);
        fileShare.files[fileIndex].name=newFileName;
        fileShare.markModified(`files`);
        fileShare.save();

        return file.name;

    }
    async createFileShare(name,userId){
        const fileShare=await FileShareModel.create({
            name:name,
            allowedUsers:[userId]
        })
        return fileShare;
    }
    async addAlowedUser(fileShareId,userId){
        const fileShare=await FileShareModel.findById(fileShareId);

        fileShare.allowedUsers.push(userId);
        fileShare.save();

        const user=await userModel.findById(userId);
        user.fileShares.push({name:fileShare.name,id:fileShare.id})
        user.save();

        return fileShare;

    }
}
module.exports=new FileShareService();
