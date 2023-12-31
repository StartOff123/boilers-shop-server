import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOne({ where: { email: username } })

        if (!user) { throw new UnauthorizedException('Неверный логин или пароль') }
        
        const passwordValid = await bcrypt.compare(password, user.password)

        if (!passwordValid) { throw new UnauthorizedException('Неверный логин или пароль') }

        if (user && passwordValid) {
            return {
                userid: user.id,
                username: user.username,
                email: user.email
            }
        }

        return null
    }
}