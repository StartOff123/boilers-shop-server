import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Test, TestingModule } from '@nestjs/testing'
import { databaseConfig } from 'src/config/configuration'
import { SequelizeConfigService } from 'src/config/sequelizeConfig'
import { User } from 'src/users/users.model'
import { UsersModule } from 'src/users/users.module'
import * as bcrypt from 'bcrypt'
import * as request from 'supertest'

const mockedUser = {
    username: 'Jhon',
    email: 'jhon@test.ru',
    password: '12345678'
}

describe('Users Controller', () => {
    let app: INestApplication

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

        app = testModule.createNestApplication()
        await app.init()
    })

    beforeEach(async () => {
        const user = new User()

        const hashedPassword = await bcrypt.hash(mockedUser.password, 10)

        user.username = mockedUser.username
        user.password = hashedPassword
        user.email = mockedUser.email

        return user.save()
    })

    afterEach(async () => {
        await User.destroy({ where: { email: mockedUser.email } })
        await User.destroy({ where: { email: 'test@test.ru' } })
    })

    it('should create user', async () => {
        const newUser = {
            username: 'Test',
            email: 'test@test.ru',
            password: 'test123'
        }

        const response = await request(app.getHttpServer())
            .post('/users/signup')
            .send(newUser)

        const passwordIsValid = await bcrypt.compare(newUser.password, response.body.password)

        expect(response.body.username).toBe(newUser.username)
        expect(response.body.email).toBe(newUser.email)
        expect(passwordIsValid).toBe(true)
    })
})