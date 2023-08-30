import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Test, TestingModule } from '@nestjs/testing'
import { databaseConfig } from 'src/config/configuration'
import { SequelizeConfigService } from 'src/config/sequelizeConfig'
import { User } from 'src/users/users.model'
import { UsersModule } from 'src/users/users.module'
import * as bcrypt from 'bcrypt'
import { UsersService } from 'src/users/users.service'

describe('Users Service', () => {
    let app: INestApplication
    let usersService: UsersService

    beforeEach(async () => {
        const testModule: TestingModule = await Test.createTestingModule({
            imports: [
                SequelizeModule.forRootAsync({
                    imports: [ConfigModule],
                    useClass: SequelizeConfigService
                }),
                ConfigModule.forRoot({
                    load: [databaseConfig],
                }),
                UsersModule,
            ]
        }).compile()

        usersService = testModule.get<UsersService>(UsersService)
        app = testModule.createNestApplication()
        await app.init()
    })

    afterEach(async () => {
        await User.destroy({ where: { email: 'test@test.ru' } })
    })

    it('should create user', async () => {
        const newUser = {
            username: 'Test',
            email: 'test@test.ru',
            password: 'test123'
        }
        
        const user = await usersService.create(newUser) as User
        const passwordIsValid = await bcrypt.compare(newUser.password, user.password)

        expect(user.username).toBe(newUser.username)
        expect(user.email).toBe(newUser.email)
        expect(passwordIsValid).toBe(true)
    })
})