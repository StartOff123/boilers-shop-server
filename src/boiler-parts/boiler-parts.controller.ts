import { Controller, Get, Param, Post, Query, UseGuards, Body } from '@nestjs/common'
import { BoilerPartsService } from './boiler-parts.service'
import { AuthenticatedGuard } from 'src/auth/authenticated.guard'
import {
    FindOneResponse,
    GetBestsellersResponse,
    GetByNameRequest,
    GetByNameResponse,
    GetNewResponse,
    IBoilerPartsQuery,
    PaginateAndFilterResponse,
    SearchRequest,
    SearchResponse
} from './types'
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller('boiler-parts')
@ApiTags('boiler-parts')
export class BoilerPartsController {
    constructor(private readonly boilerPartsService: BoilerPartsService) { }

    @Get()
    @UseGuards(AuthenticatedGuard)
    @ApiOkResponse({ type: PaginateAndFilterResponse })
    paginateAndFilter(@Query() query: IBoilerPartsQuery) {
        return this.boilerPartsService.paginateAndFilter(query)
    }

    @Get('find/:id')
    @UseGuards(AuthenticatedGuard)
    @ApiOkResponse({ type: FindOneResponse })
    getOne(@Param('id') id: string) {
        return this.boilerPartsService.findOne(id)
    }

    @Get('bestsellers')
    @UseGuards(AuthenticatedGuard)
    @ApiOkResponse({ type: GetBestsellersResponse })
    getBestsellers() {
        return this.boilerPartsService.bestsellers()
    }

    @Get('new')
    @UseGuards(AuthenticatedGuard)
    @ApiOkResponse({ type: GetNewResponse })
    getNew() {
        return this.boilerPartsService.new()
    }

    @Post('search')
    @UseGuards(AuthenticatedGuard)
    @ApiBody({ type: SearchRequest })
    @ApiOkResponse({ type: SearchResponse })
    search(@Body() { search }: { search: string }) {
        return this.boilerPartsService.searchByString(search)
    }

    @Post('name')
    @UseGuards(AuthenticatedGuard)
    @ApiBody({ type: GetByNameRequest })
    @ApiOkResponse({ type: GetByNameResponse })
    getByName(@Body() { name }: { name: string }) {
        return this.boilerPartsService.findOneByName(name)
    }
}