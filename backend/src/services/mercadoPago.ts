import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token:
    process.env.MERCADO_PAGO_ACCESS_TOKEN as string
})

export { mercadopago }