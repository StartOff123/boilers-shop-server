import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ShoppingCartService } from './shopping-cart.service'
import { AuthenticatedGuard } from 'src/auth/authenticated.guard'
import { AddToCartDto } from './dto/add-to-cart.dto'
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AddToCartResponse, GetAllResponse, RemoveResponse, UpdateCountRequest, UpdateCountResponse } from './types'

@Controller('shopping-cart')
@ApiTags('shopping-cart')
export class ShoppingCartController {
    constructor(private readonly shoppingCartService: ShoppingCartService) {}

    @Get(':id')
    @UseGuards(AuthenticatedGuard)
    @ApiOkResponse({ type: [GetAllResponse] })
    getAll(@Param('id') userId: string) {
        return this.shoppingCartService.findAll(userId)
    }

    @Post('/add')
    @UseGuards(AuthenticatedGuard)
    @ApiOkResponse({ type: AddToCartResponse })
    getToCart(@Body() addToCartDto: AddToCartDto) {
        return this.shoppingCartService.add(addToCartDto)
    }

    @Patch('/count/:id')
    @UseGuards(AuthenticatedGuard)
    @ApiBody({ type: UpdateCountRequest })
    @ApiOkResponse({ type: UpdateCountResponse })
    updateCount(@Body() { count }: { count: number }, @Param('id') partId: string ) {
        return this.shoppingCartService.updateCount(count, partId)
    }

    @Delete('/remove-one/:id')
    @UseGuards(AuthenticatedGuard)
    @ApiOkResponse({ type: RemoveResponse })
    removeOne(@Param('id') userId: string, @Query('partId') partId: string) {
        return this.shoppingCartService.remove(userId, partId)
    }
    
    @Delete('/remove-all/:id')
    @UseGuards(AuthenticatedGuard)
    @ApiOkResponse({ type: RemoveResponse })
    removeAll(@Param('id') userId: string) {
        return this.shoppingCartService.removeAll(userId)
    }
}