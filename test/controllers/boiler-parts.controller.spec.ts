import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Test, TestingModule } from '@nestjs/testing'
import { databaseConfig } from 'src/config/configuration'
import { SequelizeConfigService } from 'src/config/sequelizeConfig'
import { User } from 'src/users/users.model'
import * as bcrypt from 'bcrypt'
import * as session from 'express-session'
import * as passport from 'passport'
import * as request from 'supertest'
import { AuthModule } from 'src/auth/auth.module'
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module'

const mockedUser = {
    username: 'Jhon',
    email: 'jhon@test.ru',
    password: '12345678'
}

describe('Boiler Parts Controller', () => {
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
                BoilerPartsModule,
                AuthModule,
            ]
        }).compile()

        app = testModule.createNestApplication()
        app.use(
            session({
                secret: 'keyword',
                resave: false,
                saveUninitialized: false,
            })
        )

        app.use(passport.initialize())
        app.use(passport.session())
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
    })

    it('should get one part', async () => {
        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send({ username: mockedUser.email, password: mockedUser.password })

        const response = await request(app.getHttpServer())
            .get('/boiler-parts/find/1')
            .set('Cookie', login.headers['set-cookie'])

        expect(response.body).toEqual(
            expect.objectContaining({
                id: 1,
                price: expect.any(Number),
                boiler_manufacturer: expect.any(String),
                parts_manufacturer: expect.any(String),
                vendor_code: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                compatibility: expect.any(String),
                images: expect.any(String),
                in_stock: expect.any(Number),
                bestseller: expect.any(Boolean),
                new: expect.any(Boolean),
                popularity: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        )
    })

    it('should get bestsellers', async () => {
        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send({ username: mockedUser.email, password: mockedUser.password })

        const response = await request(app.getHttpServer())
            .get('/boiler-parts/bestsellers')
            .set('Cookie', login.headers['set-cookie'])

        expect(response.body.rows).toEqual(
            expect.arrayContaining([{
                id: expect.any(Number),
                price: expect.any(Number),
                boiler_manufacturer: expect.any(String),
                parts_manufacturer: expect.any(String),
                vendor_code: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                compatibility: expect.any(String),
                images: expect.any(String),
                in_stock: expect.any(Number),
                bestseller: true,
                new: expect.any(Boolean),
                popularity: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }])
        )
    })

    it('should get new parts', async () => {
        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send({ username: mockedUser.email, password: mockedUser.password })

        const response = await request(app.getHttpServer())
            .get('/boiler-parts/new')
            .set('Cookie', login.headers['set-cookie'])

        expect(response.body.rows).toEqual(
            expect.arrayContaining([{
                id: expect.any(Number),
                price: expect.any(Number),
                boiler_manufacturer: expect.any(String),
                parts_manufacturer: expect.any(String),
                vendor_code: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                compatibility: expect.any(String),
                images: expect.any(String),
                in_stock: expect.any(Number),
                bestseller: expect.any(Boolean),
                new: true,
                popularity: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }])
        )
    })

    it('should search by string', async () => {
        const body = { search: 'n' }

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send({ username: mockedUser.email, password: mockedUser.password })

        const response = await request(app.getHttpServer())
            .post('/boiler-parts/search')
            .send(body)
            .set('Cookie', login.headers['set-cookie'])

        expect(response.body.rows.length).toBeLessThanOrEqual(20)
        response.body.rows.forEach((elem: any) => {
            expect(elem.name.toLowerCase()).toContain(body.search)
        })

        expect(response.body.rows).toEqual(
            expect.arrayContaining([{
                id: expect.any(Number),
                price: expect.any(Number),
                boiler_manufacturer: expect.any(String),
                parts_manufacturer: expect.any(String),
                vendor_code: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                compatibility: expect.any(String),
                images: expect.any(String),
                in_stock: expect.any(Number),
                bestseller: expect.any(Boolean),
                new: expect.any(Boolean),
                popularity: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }])
        )
    })

    it('should search by name', async () => {
        const body = { name: 'Sit vel.' }

        const login = await request(app.getHttpServer())
            .post('/users/login')
            .send({ username: mockedUser.email, password: mockedUser.password })

        const response = await request(app.getHttpServer())
            .post('/boiler-parts/name')
            .send(body)
            .set('Cookie', login.headers['set-cookie'])

        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                price: expect.any(Number),
                boiler_manufacturer: expect.any(String),
                parts_manufacturer: expect.any(String),
                vendor_code: expect.any(Number),
                name: 'Sit vel.',
                description: expect.any(String),
                compatibility: expect.any(String),
                images: expect.any(String),
                in_stock: expect.any(Number),
                bestseller: expect.any(Boolean),
                new: expect.any(Boolean),
                popularity: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        )
    })
})