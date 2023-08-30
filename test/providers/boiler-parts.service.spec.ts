import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Test, TestingModule } from '@nestjs/testing'
import { databaseConfig } from 'src/config/configuration'
import { SequelizeConfigService } from 'src/config/sequelizeConfig'
import { BoilerPartsModule } from 'src/boiler-parts/boiler-parts.module'
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service'

describe('Boiler Parts Service', () => {
    let app: INestApplication
    let boilerPartsService: BoilerPartsService

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
            ]
        }).compile()

        app = testModule.createNestApplication()
        boilerPartsService = testModule.get<BoilerPartsService>(BoilerPartsService)
        await app.init()
    })

    it('should find by id', async () => {
        const part = await boilerPartsService.findOne(1)

        expect(part.dataValues).toEqual(
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
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        )
    })

    it('should find by name', async () => {
        const part = await boilerPartsService.findOneByName('Sit vel.')

        expect(part.dataValues).toEqual(
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
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        )
    })

    it('should find by search string', async () => {
        const parts = await boilerPartsService.searchByString('vel')

        expect(parts.rows.length).toBeLessThanOrEqual(20)

        parts.rows.forEach(elem => {
            expect(elem.name.toLowerCase()).toContain('vel')
            expect(elem.dataValues).toEqual(
                expect.objectContaining({
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
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            )
        })

    })

    it('should find by bestsellers', async () => {
        const parts = await boilerPartsService.bestsellers()

        parts.rows.forEach(elem => {
            expect(elem.dataValues).toEqual(
                expect.objectContaining({
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
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            )
        })
    })

    it('should find by new', async () => {
        const parts = await boilerPartsService.new()

        parts.rows.forEach(elem => {
            expect(elem.dataValues).toEqual(
                expect.objectContaining({
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
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            )
        })
    })
})