import { Injectable } from '@nestjs/common'
import { ShoppingCart } from './shopping-cart.model'
import { InjectModel } from '@nestjs/sequelize'
import { UsersService } from 'src/users/users.service'
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service'
import { AddToCartDto } from './dto/add-to-cart.dto'

@Injectable()
export class ShoppingCartService {
    constructor(
        @InjectModel(ShoppingCart)
        private shoppingCatrModel: typeof ShoppingCart,
        private readonly usersService: UsersService,
        private readonly boilerPartsService: BoilerPartsService
    ) { }

    async findAll(userId: number | string): Promise<ShoppingCart[]> {
        return this.shoppingCatrModel.findAll({ where: { userId } })
    }

    async add(addToCartDto: AddToCartDto) {
        const cart = new ShoppingCart()
        const user = await this.usersService.findOne({ where: { email: addToCartDto.email } })
        const part = await this.boilerPartsService.findOne(addToCartDto.partId)

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
    }

    async updateCount(count: number, partId: number | string): Promise<{ count: number; total_price: number }> {
        const part = await this.shoppingCatrModel.findOne({ where: { partId } })
        await this.shoppingCatrModel.update({ count, total_price: part.price * count }, { where: { partId } })
        const partFinal = await this.shoppingCatrModel.findOne({ where: { partId } })

        return { count: partFinal.count, total_price: partFinal.total_price }
    }

    async remove(userId: number | string, partId: number | string): Promise<{ msg: string }> {
        const part = await this.shoppingCatrModel.findOne({ where: { partId, userId } })
        await part.destroy()

        return { msg: 'Successfully' }
    }

    async removeAll(userId: number | string): Promise<{ msg: string }> {
        await this.shoppingCatrModel.destroy({ where: { userId } })

        return { msg: 'Successfully' }
    }
}