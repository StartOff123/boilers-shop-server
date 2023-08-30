import { ApiProperty } from '@nestjs/swagger'

export class LoginUserRequest {
    @ApiProperty({ example: 'test@test.ru' })
    username: string

    @ApiProperty({ example: '12345678' })
    password: string
}

export class LoginUserResponse {
    @ApiProperty({
        example: {
            userId: 1,
            username: 'Дмитрий',
            email: 'test@test.ru'
        }
    })
    user: {
        userId: number,
        username: string,
        email: string
    }

    @ApiProperty({ example: 'Logged in' })
    msg: string
}

export class LogoutUserResponse {
    @ApiProperty({ example: 'session has ended' })
    msg: string
}

export class LoginCheckResponse {
    @ApiProperty({ example: '1' })
    userId: number

    @ApiProperty({ example: 'Дмитрий' })
    username: string

    @ApiProperty({ example: 'test@test.ru' })
    email: string
}

export class SignupResponse {
    @ApiProperty({ example: '1' })
    userId: number

    @ApiProperty({ example: 'Дмитрий' })
    username: string

    @ApiProperty({ example: 'test@test.ru' })
    email: string

    @ApiProperty({ example: '$2b$10$X.azHwSlj7NLlWovgqW4GOtQ8J2IpFJf32TmpPr6IJpZcninhziZS' })
    password: string

    @ApiProperty({ example: '2023-08-14T09:46:58.061Z' })
    updatedAt: string

    @ApiProperty({ example: '2023-08-14T09:46:58.061Z' })
    createdAt: string
}