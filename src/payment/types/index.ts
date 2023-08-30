import { ApiProperty } from '@nestjs/swagger'

export class MakePaymentResponse {
    @ApiProperty({ example: '2c6fee31-000f-5000-9000-13ec462995db' })
    id: string

    @ApiProperty({ example: 'pending' })
    status: string

    @ApiProperty({ example: { value: '100.00', currency: 'RUB' } })
    amount: {
        value: string,
        currency: string
    }

    @ApiProperty({ example: 'Заказ №1' })
    description: string

    @ApiProperty({ example: { account_id: '244314', gateway_id: '2107809' } })
    recipient: {
        account_id: string,
        gateway_id: string
    }

    @ApiProperty({ example: '2023-08-17T08:29:37.294Z' })
    created_at: string

    @ApiProperty({ example: { type: 'redirect', confirmation_url: 'https://yoomoney.ru/checkout/payments/v2/contract?orderId=2c6fee31-000f-5000-9000-13ec462995db' } })
    confirmation: {
        type: string,
        confirmation_url: string
    }

    @ApiProperty({ example: true })
    test: boolean

    @ApiProperty({ example: false })
    paid: boolean

    @ApiProperty({ example: false })
    refundable: boolean

    @ApiProperty({ example: {} })
    metadata: object
}