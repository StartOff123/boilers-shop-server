import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Test, TestingModule } from '@nestjs/testing'
import { databaseConfig } from 'src/config/configuration'
import { SequelizeConfigService } from 'src/config/sequelizeConfig'
import { User } from 'src/users/users.model'
import * as bcrypt from 'bcrypt'
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module'
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service'
import { UsersService } from 'src/users/users.service'
import { ShoppingCart } from 'src/shopping-cart/shopping-cart.model'
import { ShoppingCartModule } from 'src/shopping-cart/shopping-cart.module'
import { ShoppingCartService } from 'src/shopping-cart/shopping-cart.service'

const mockedUser = {
    username: 'Jhon',
    email: 'jhon@test.ru',
    password: '12345678'
}

describe('Shopping Cart Controller', () => {
    let app: INestApplication
    let boilerPartsService: BoilerPartsService
    let usersService: UsersService
    let shoppingCartService: ShoppingCartService

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
                ShoppingCartModule,
                BoilerPartsModule,
            ]
        }).compile()

        boilerPartsService = testModule.get<BoilerPartsService>(BoilerPartsService)
        usersService = testModule.get<UsersService>(UsersService)
        shoppingCartService = testModule.get<ShoppingCartService>(ShoppingCartService)

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

    beforeEach(async () => {
        const cart = new ShoppingCart()
        const user = await usersService.findOne({ where: { email: mockedUser.email } })
        const part = await boilerPartsService.findOne(1)

        cart.userId = user.id
        cart.partId = part.id
        cart.boiler_manufacturer = part.boiler_manufacturer
        cart.parts_manufacturer = part.parts_manufacturer
        cart.price = part.price
        cart.in_stock = part.in_stock
        cart.image = JSON.parse(part.images)[0]
        cart.name = part.name
        cart.total_price = part.price

        return cart.save()
    })

    afterEach(async () => {
        await User.destroy({ where: { email: mockedUser.email } })
        await ShoppingCart.destroy({ where: { partId: 1 } })
    })

    it('should return all cart items', async () => {
        const user = await usersService.findOne({ where: { email: mockedUser.email } })

        const cart = await shoppingCartService.findAll(user.id)

        cart.forEach((item) =>
            expect(item.dataValues).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    userId: user.id,
                    partId: expect.any(Number),
                    price: expect.any(Number),
                    boiler_manufacturer: expect.any(String),
                    parts_manufacturer: expect.any(String),
                    name: expect.any(String),
                    image: expect.any(String),
                    count: expect.any(Number),
                    total_price: expect.any(Number),
                    in_stock: expect.any(Number),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            )
        )
    })

    it('should add cart item', async () => {
        await shoppingCartService.add({
            email: mockedUser.email,
            partId: 3
        })

        const user = await usersService.findOne({ where: { email: mockedUser.email } })

        const cart = await shoppingCartService.findAll(user.id)

        expect(cart.find(item => item.partId === 3)).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                userId: user.id,
                partId: 3,
                price: expect.any(Number),
                boiler_manufacturer: expect.any(String),
                parts_manufacturer: expect.any(String),
                name: expect.any(String),
                image: expect.any(String),
                count: expect.any(Number),
                total_price: expect.any(Number),
                in_stock: expect.any(Number),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        )
    })

    it('should return updated count and total price', async () => {
        const result = await shoppingCartService.updateCount(1, 1)

        expect(result.count).toEqual(1)
    })

    it('should delete cart item', async () => {
        const user = await usersService.findOne({ where: { email: mockedUser.email } })
        await shoppingCartService.remove(user.id, 1)

        const cart = await shoppingCartService.findAll(user.id)

        expect(cart.find(item => item.partId === 1)).toBeUndefined()
    })

    it('should delete all cart items', async () => {
        const user = await usersService.findOne({ where: { email: mockedUser.email } })
        await shoppingCartService.removeAll(user.id)

        const cart = await shoppingCartService.findAll(user.id)

        expect(cart).toStrictEqual([])
    })
})