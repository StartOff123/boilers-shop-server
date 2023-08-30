import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './users.model'
import * as bcrypt from 'bcrypt'
import { createUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User
    ) { }

    findOne(filter: { where: { id?: string, username?: string, email?: string } }): Promise<User> {
        return this.userModel.findOne({ ...filter })
    }

    async create(createUserDto: createUserDto): Promise<User | { warningMessage: string }> {
        const user = new User()
        const existingByEmail = await this.findOne({ where: { email: createUserDto.email } })

        if (existingByEmail) return { warningMessage: `Пользователь с такой почтой уже существует` }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

        user.username = createUserDto.username
        user.password = hashedPassword
        user.email = createUserDto.email

        return user.save()
    }
}