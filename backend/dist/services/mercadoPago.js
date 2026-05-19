"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentClient = void 0;
const mercadopago_1 = require("mercadopago");
const client = new mercadopago_1.MercadoPagoConfig({
    accessToken: process.env
        .MERCADO_PAGO_ACCESS_TOKEN
});
const paymentClient = new mercadopago_1.Payment(client);
exports.paymentClient = paymentClient;
