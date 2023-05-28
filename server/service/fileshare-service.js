const FileShareModel=require('../models/fileshare-model');
const ApiError =require('../exceptions/api-error');
const FileModel=require('../models/file-model');
const userModel = require('../models/user-model');
const fs=require('fs');
const uniqid=require('uniqid');
const path=require('path');
const fileModel = require('../models/file-model');
const uuid=require('uuid');
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

        const [filename,ext]=decodeURIComponent(escape(fileInfo.name)).split('.');
        const fileId=uniqid();
        const fullName=fileId+'.'+ext;
        const fileBuffer=Buffer.from(fileInfo.data);
        
        const folderPath=path.join(__dirname,`../fileShares/${fileShare.id}`);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
        fs.writeFileSync(path.join(folderPath,fullName),fileBuffer);

        const file=await FileModel.create({
            ext:ext,
            name:filename+'.'+ext,
            URL:path.join(folderPath,fullName)
        });
        
        fileShare.files.push({id:file.id,name:filename+'.'+ext});
        fileShare.save();

        return fileShare.files;
    }
    async getFileById(fileId){
        const file=await FileModel.findById(fileId);
        if(!file){
            throw ApiError.BadRequiest('Такого файла не существует');
        }
        return file.URL;
    }
    async getAllFiles(fileShareDto){

        const fileShare= await FileShareModel.findById(fileShareDto.id);
        if(!fileShare){
            throw ApiError.BadRequiest(`There is no fileShare with id ${fileShareDto.id}`);
        }

        return fileShare.files;
    }
    async deleteFileById(fileShareDto,fileId){
        
        const file=await FileModel.findByIdAndDelete(fileId);
        fs.unlink(file.URL,(err)=>{if(err){throw new ApiError(500,err)}});
        //in case we are deleting whole fileShare

        const fileShare= await FileShareModel.findById(fileShareDto.id);
        if(!fileShare){
            throw ApiError.BadRequiest(`There is no fileShare with id ${fileShareDto.id}`);
        }
        const fileIndex=fileShare.files.findIndex(file=>file.id==fileId);
        fileShare.files.splice(fileIndex,1);
        fileShare.save((err)=>{
            console.log(err);
        });
        return fileShare.files;
        

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

        return fileShare.files;

    }
    async createFileShare(name,userId){
        const addUserId=uuid.v4();
        const fileShare=await FileShareModel.create({
            name:name,
            allowedUsers:[userId],
            addUserId:addUserId
        })
        return fileShare;
    }
    async addAlowedUser(fileShareId,userMail){
        const fileShare=await FileShareModel.findById(fileShareId);

        const user=await userModel.findOne({email:userMail});
        if(!user)throw  ApiError.BadRequiest("No such email " + userMail);

        fileShare.allowedUsers.push(user.id);
        fileShare.save();

        
        user.fileShares.push({name:fileShare.name,id:fileShare.id})
        user.save();

        return fileShare;

    }
    async addUsersFile(fileShareId,fileId){
        const fileShare=await FileShareModel.findById(fileShareId);

        const file=await fileModel.findById(fileId);

        const folderPath=path.join(__dirname,'../fileShares',fileShare.id);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
        fs.copyFile(file.URL,path.join(folderPath,file.id+'.'+file.ext),(err)=>{});

        const newFile=await FileModel.create({
            ext:file.ext,
            name:file.name,
            URL:path.join(folderPath,file.id+'.'+file.ext)
        });
        
        fileShare.files.push({id:newFile.id,name:file.name});
        fileShare.save();

        return fileShare;
    }
    async deleteFileShare(fileShareId){
        const fileShare=await FileShareModel.findById(fileShareId);
        for(let fileDto of fileShare.files){
            const file=await FileModel.findByIdAndDelete(fileDto.id);
            fs.unlink(file.URL,(err)=>{if(err){throw new ApiError(500,err)}});
        }
        for(let userDto of fileShare.allowedUsers){
            let user=await userModel.findById(userDto);
            const index = user.fileShares.findIndex((obj) => obj.id === fileShare.id);
            user.fileShares.splice(index,1);
            user.markModified("fileShares");
            user.save();
        }
        fileShare.deleteOne();
        return fileShare;
    }
    async leaveFileShare(fileShareId,userId){
        const fileShare= await FileShareModel.findById(fileShareId);
        const user=await userModel.findById(userId);
        user.fileShares.splice(user.fileShares.findIndex((val)=>val.id==fileShareId),1);
        fileShare.allowedUsers.splice(fileShare.allowedUsers.findIndex((val)=>val.id==userId),1);
        if(fileShare.allowedUsers.length==0)this.deleteFileShare(fileShareId);

        fileShare.markModified("allowedUsers");
        user.markModified('fileShares');

        fileShare.save();
        user.save();

        return fileShare;

    }
    async getFileShareLink(fileShareId){
        const fileShare=await FileShareModel.findById(fileShareId);

        const linkId=fileShare.addUserId;

        return "http://localhost:5000/cloud/addFileShareLink/"+linkId;
    }
}
module.exports=new FileShareService();
