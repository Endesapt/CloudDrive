const UserModel=require('../models/user-model');
const ApiError =require('../exceptions/api-error');
const FileModel=require('../models/file-model');
const FileShareService=require('../service/fileshare-service');
const fs=require('fs');
const uniqid=require('uniqid');
const path=require('path');
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
        const [filename,ext]=decodeURIComponent(escape(fileInfo.name)).split('.');
        const fileId=uniqid();
        const fullName=fileId+'.'+ext;
        const fileBuffer=Buffer.from(fileInfo.data);
        
        const folderPath=path.join(__dirname,`../files/${userDto.id}`);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
        fs.writeFileSync(path.join(folderPath,fullName),fileBuffer);

        const file=await FileModel.create({
            ext:ext,
            name:filename+'.'+ext,
            URL:path.join(folderPath,fullName)
        });
        
        user.files.push({id:file.id,name:filename+'.'+ext});
        user.save();

        return user.files;
    }
    async getFileById(fileId){
        const file=await FileModel.findById(fileId);
        if(!file){
            throw ApiError.BadRequiest('Такого файла не существует');
        }

        return file.URL;
        
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
        fs.unlink(file.URL,(err)=>{if(err){throw new ApiError(500,err)}});
        

        const fileIndex=user.files.findIndex(file=>file.id==fileId);
        user.files.splice(fileIndex,1);
        user.save();
        return user.files;

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

        return user.files;

    }
    async addFileShare(userDto,name){
        const user= await UserModel.findById(userDto.id);
        if(!user){
            throw ApiError.BadRequiest(`There is no user with id ${userDto.id}`);
        }
        
        const fileShare=await FileShareService.createFileShare(name,userDto.id);

        user.fileShares.push({name:name,id:fileShare.id});
        user.save();
        return user.fileShares;


    }
    async getFileShares(userDto){
        const user=await UserModel.findById(userDto.id);
        if(!user){
            throw ApiError.BadRequiest(`There is no user with id ${userDto.id}`);
        }

        return user.fileShares; 
    }
}
module.exports=new CloudService();
