import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class AddToCartDto {
    @ApiProperty({ example: 'test@test.ru' })
    @IsNotEmpty()
    readonly email: string

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    userId?: number

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    readonly partId: number
}