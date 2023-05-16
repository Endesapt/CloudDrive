const UserModel = require('../models/user-model');
const bcrypt=require('bcrypt');
const tokenService=require('../service/token-service');
const UserDto=require('../dto/user-dto');
const ApiError=require('../exceptions/api-error');
const userModel = require('../models/user-model');


class UserService{
    async registration(email,password){
        const candidate = await UserModel.findOne({email});
        if(candidate){
            throw ApiError.BadRequiest(`Пользователь с почтовым адресом ${email} уже существует`);
        }
        const hashPassword=await bcrypt.hash(password,4);
        const user= await UserModel.create({email,password:hashPassword,files:[]});
        
        const userDto=new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.SaveToken(userDto.id,tokens.refreshToken);

        return {
            ...tokens,
            user:userDto
        }
    }
    async login(email,password){
        const user= await UserModel.findOne({email});
        if(!user){
            throw ApiError.BadRequiest(`Ползовател с email ${email} не найден`);
        }
        const isPassEquals =await  bcrypt.compare(password,user.password);
        
        if(!isPassEquals){
            throw ApiError.BadRequiest(`Неправильный пароль`);
        }
        const userDto=new UserDto(user);
        const tokens=tokenService.generateToken({...userDto});
        await tokenService.SaveToken(userDto.id,tokens.refreshToken);
        return {
            ...tokens,
            user:userDto
        }

    }
    async logout(refreshToken){
        const token=await tokenService.removeToken(refreshToken);
        return token;
    }
    async refresh(refreshToken){
        if(!refreshToken)throw ApiError.UnauthorizedError()
        const userData=tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb=await tokenService.findToken(refreshToken);
        console.log(userData);
        console.log(tokenFromDb);
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id)
        const userDto=new UserDto(user);
        const tokens=tokenService.generateToken({...userDto});

        await tokenService.SaveToken(userDto.id,tokens.refreshToken);
        return {
            ...tokens,
            user:userDto
        }
        
    }
    
}

module.exports=new UserService();