const UserModel=require('../models/user-model');
const ApiError =require('../exceptions/api-error');
const FileModel=require('../models/file-model');
class CloudService{
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
}
module.exports=new CloudService();
