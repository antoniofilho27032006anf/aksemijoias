"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3333;
console.log({
    userRoutes: user_routes_1.default,
    productRoutes: product_routes_1.default,
    orderRoutes: order_routes_1.default
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(order_routes_1.default);
app.use(user_routes_1.default);
app.use(product_routes_1.default);
app.get('/', (req, res) => {
    return res.json({
        message: 'API AKsemijoias funcionando'
    });
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
