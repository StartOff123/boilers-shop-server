import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { MakePaymentDto } from './dto/make-payment.dto'
import { AuthenticatedGuard } from 'src/auth/authenticated.guard'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { MakePaymentResponse } from './types'

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Post()
    @UseGuards(AuthenticatedGuard)
    @ApiOkResponse({ type: MakePaymentResponse })
    makePayment(@Body() makePaymentDto: MakePaymentDto) {
        return this.paymentService.makePayment(makePaymentDto)
    }
}