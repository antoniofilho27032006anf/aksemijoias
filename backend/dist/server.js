"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

import adminRoutes from './routes/admin.routes'
app.use(adminRoutes)

Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const prisma_1 = require("./lib/prisma");
const mercadoPago_1 = require("./services/mercadoPago");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3333;
console.log({
    userRoutes: user_routes_1.default,
    productRoutes: product_routes_1.default,
    orderRoutes: order_routes_1.default
});
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use(express_1.default.json());
app.use(order_routes_1.default);
app.use(user_routes_1.default);
app.use(product_routes_1.default);
app.get('/', (req, res) => {
    return res.json({
        message: 'API AKsemijoias funcionando'
    });
});
app.post('/webhook/mercadopago', async (req, res) => {
    try {
        const paymentId = req.body?.data?.id;
        if (!paymentId) {
            return res.sendStatus(200);
        }
        const payment = await mercadoPago_1.paymentClient.get({
            id: paymentId
        });
        const status = payment.status;
        if (status === 'approved') {
            await prisma_1.prisma.order.updateMany({
                where: {
                    paymentId: paymentId.toString()
                },
                data: {
                    status: 'PAID'
                }
            });
        }
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
