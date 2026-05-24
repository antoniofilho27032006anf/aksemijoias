"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const stripe_1 = __importDefault(require("stripe"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const favorite_routes_1 = __importDefault(require("./routes/favorite.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const tag_routes_1 = __importDefault(require("./routes/tag.routes"));
const variation_routes_1 = __importDefault(require("./routes/variation.routes"));
const webhook_routes_1 = __importDefault(require("./routes/webhook.routes"));
const banner_routes_1 = __importDefault(require("./routes/banner.routes"));
const prisma_1 = require("./lib/prisma");
const email_1 = require("./services/email");
const auth_1 = require("./middlewares/auth");
const admin_1 = require("./middlewares/admin");
const logger_1 = require("./middlewares/logger");
const sanitize_1 = require("./middlewares/sanitize");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3333;
const stripe = process.env.STRIPE_SECRET_KEY
    ? new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
    : null;
app.use((0, cors_1.default)({ origin: '*' }));
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Muitas requisições. Tente novamente mais tarde.' }
}));
app.use(logger_1.requestLogger);
// Stripe webhook precisa do raw body, antes do express.json()
app.post('/webhooks/stripe', express_1.default.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET)
        return res.sendStatus(400);
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const orderId = session.metadata?.orderId;
                if (orderId) {
                    const order = await prisma_1.prisma.order.update({
                        where: { id: orderId },
                        data: { status: 'PAID' },
                        include: { user: true }
                    });
                    await prisma_1.prisma.orderEvent.create({
                        data: { orderId, status: 'PAID', description: 'Pagamento confirmado via Stripe' }
                    });
                    (0, email_1.sendOrderStatusEmail)(order.user.email, {
                        orderId,
                        status: 'PAID',
                        description: 'Seu pagamento foi confirmado!'
                    }).catch(console.error);
                }
                break;
            }
        }
    }
    catch (error) {
        console.log(error);
    }
    return res.sendStatus(200);
});
app.use(sanitize_1.sanitizeMiddleware);
app.use(express_1.default.json({ limit: '10mb' }));
app.use('/orders', auth_1.authMiddleware);
app.use('/cart', auth_1.authMiddleware);
app.use('/favorites', auth_1.authMiddleware);
app.use('/admin', auth_1.authMiddleware, admin_1.adminMiddleware);
app.use('/upload', auth_1.authMiddleware);
app.use(order_routes_1.default);
app.use(cart_routes_1.default);
app.use(favorite_routes_1.default);
app.use(admin_routes_1.default);
app.use(user_routes_1.default);
app.use(product_routes_1.default);
app.use(upload_routes_1.default);
app.use(category_routes_1.default);
app.use(tag_routes_1.default);
app.use(variation_routes_1.default);
app.use(webhook_routes_1.default);
app.use(banner_routes_1.default);
app.get('/', (_req, res) => {
    return res.json({ message: 'API AKsemijoias funcionando' });
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
