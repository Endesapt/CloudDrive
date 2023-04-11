const FileShareModel=require('../models/fileshare-model');
const ApiError =require('../exceptions/api-error');
const FileModel=require('../models/file-model');
class FileShareService{
    async validateUser(fileShareId,userDto){
        try{
            const fileShare=await fileShareModel.findById(fileShareId);

            if(fileShare.files.indexOf(userDto.id)<0){
                return null;
            }
            return true;
        }catch(e){
            return null;
        }
    }
    async addFile(fileShareDto,fileInfo){
        const fileShare=await fileShareModel.findById(fileShareDto.id);

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
    async getAllFiles(fileShareDto){

        const fileShare= await fileShareModel.findById(fileShareDto.id);
        if(!fileShare){
            throw ApiError.BadRequiest(`There is no fileShare with id ${fileShareDto.id}`);
        }

        return fileShare.files;
    }
    async deleteFileById(fileShareDto,fileId){
        const fileShare= await fileShareModel.findById(fileShareDto.id);
        if(!fileShare){
            throw ApiError.BadRequiest(`There is no fileShare with id ${fileShareDto.id}`);
        }
        const file=await FileModel.findByIdAndDelete(fileId);
        const fileIndex=fileShare.files.findIndex(file=>file.id==fileId);
        fileShare.files.splice(fileIndex,1);
        fileShare.save();
        return file;

    }
    async updateFileById(fileId,fileShareDto,newName){
        const fileShare= await fileShareModel.findById(fileShareDto.id);
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

        return file;

    }
}
module.exports=new FileShareService();
