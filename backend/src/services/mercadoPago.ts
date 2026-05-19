import {
  MercadoPagoConfig,
  Payment
} from 'mercadopago'

const client =
  new MercadoPagoConfig({

    accessToken:
      process.env
        .MERCADO_PAGO_ACCESS_TOKEN as string

  })

const paymentClient =
  new Payment(client)

export {
  paymentClient
}