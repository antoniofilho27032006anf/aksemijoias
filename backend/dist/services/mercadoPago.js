"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mercadopago = void 0;
const mercadopago = require('mercadopago');
exports.mercadopago = mercadopago;
console.log(process.env
    .MERCADO_PAGO_ACCESS_TOKEN);
mercadopago.configure({
    access_token: process.env
        .MERCADO_PAGO_ACCESS_TOKEN
});
