import { ForbiddenException, Injectable } from '@nestjs/common'
import { MakePaymentDto } from './dto/make-payment.dto'
import axios from 'axios'

@Injectable()
export class PaymentService {
    async makePayment(makePaymentDto: MakePaymentDto) {
        try {
            const { data } = await axios({
                method: 'POST',
                url: 'https://api.yookassa.ru/v3/payments',
                headers: {
                    "Content-Type": "application/json",
                    "Idempotence-Key": Date.now(),
                },
                auth: {
                    username: "244314",
                    password: 'test_SCYdrAVm3UqRy1iOIbIUVvp_u6-quBqHMfwIx_gsZwM'
                },
                data: {
                    amount: {
                        value: makePaymentDto.amount,
                        currency: "RUB"
                    },
                    capture: true,
                    confirmation: {
                        type: 'redirect',
                        return_url: 'http://localhost:3000/order'
                    },
                    description: 'Заказ №1'
                }
            })

            return data
        } catch (error) {
            throw new ForbiddenException(error)
        }
    }
}