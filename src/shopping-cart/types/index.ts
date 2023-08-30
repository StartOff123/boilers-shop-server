import { ApiProperty } from '@nestjs/swagger'

class SoppingCartItem {
    @ApiProperty({ example: 9 })
    partId: number

    @ApiProperty({ example: 4990 })
    price: number

    @ApiProperty({ example: 9 })
    in_stock: number

    @ApiProperty({ example: 2 })
    count: number

    @ApiProperty({ example: 9980 })
    total_price: number

    @ApiProperty({ example: 1 })
    id: number

    @ApiProperty({ example: 1 })
    userId: number

    @ApiProperty({ example: 'Chaffoteaux&Maury' })
    boiler_manufacturer: string

    @ApiProperty({ example: 'Salmon' })
    parts_manufacturer: string

    @ApiProperty({ example: 'https://loremflickr.com/640/480/technics?lock=4079483455799296' })
    image: string

    @ApiProperty({ example: 'Culpa dicta' })
    name: string

    @ApiProperty({ example: '2023-08-16T09:02:40.941Z' })
    updatedAt: string

    @ApiProperty({ example: '2023-08-16T09:02:40.941Z' })
    createdAt: string
}

export class GetAllResponse extends SoppingCartItem {}
export class AddToCartResponse extends SoppingCartItem {}

export class UpdateCountResponse {
    @ApiProperty({ example: 1 })
    count: number

    @ApiProperty({ example: 4990 })
    total_price: number
}

export class UpdateCountRequest {
    @ApiProperty({ example: 1 })
    count: number
}

export class RemoveResponse {
    @ApiProperty({ example: 'Successfully' })
    msg: string
}