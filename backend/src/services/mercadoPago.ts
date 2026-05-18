const mercadopago =
  require('mercadopago')

console.log(
  process.env
    .MERCADO_PAGO_ACCESS_TOKEN
)

mercadopago.configure({

  access_token:
    process.env
      .MERCADO_PAGO_ACCESS_TOKEN

})

export { mercadopago }