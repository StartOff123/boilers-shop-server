import { Controller, Header, HttpCode, HttpStatus, Post, Body, Request, UseGuards, Get } from '@nestjs/common'
import { UsersService } from './users.service'
import { createUserDto } from './dto/create-user.dto'
import { LocalAuthGuard } from 'src/auth/local.auth.guard'
import { AuthenticatedGuard } from 'src/auth/authenticated.guard'
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { LoginCheckResponse, LoginUserRequest, LoginUserResponse, LogoutUserResponse, SignupResponse } from './types'

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('/signup')
    @HttpCode(HttpStatus.CREATED)
    @Header('content-type', 'application/json')
    @ApiOkResponse({ type: SignupResponse })
    createUser(@Body() createUserDto: createUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Post('/login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginUserRequest })
    @ApiOkResponse({ type: LoginUserResponse })
    login(@Request() req: Express.Request) {
        return {
            user: req.user, 
            msg: 'Logged in'
        }
    }
    
    @Get('/login-check')
    @UseGuards(AuthenticatedGuard)
    @ApiOkResponse({ type: LoginCheckResponse })
    loginCheck(@Request() req: Express.Request) {
        return req.user
    }

    @Get('/logout')
    @ApiOkResponse({ type: LogoutUserResponse })
    logout(@Request() req: Express.Request) {
        req.session.destroy((_: any) => {})
        return { msg: 'session has ended' }
    }
}
