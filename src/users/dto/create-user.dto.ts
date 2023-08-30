import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class createUserDto {
    @ApiProperty({ example: 'test@test.ru' })
    @IsNotEmpty()
    readonly email: string
    
    @ApiProperty({ example: 'Дмитрий' })
    @IsNotEmpty()
    readonly username: string

    @ApiProperty({ example: '12345678' })
    @IsNotEmpty()
    readonly password: string
}