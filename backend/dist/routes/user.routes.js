"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const tokens_1 = require("../lib/tokens");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10)
});
const updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    avatarUrl: zod_1.z.string().url().optional()
});
const passwordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string().min(6)
});
const forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
const resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(10),
    password: zod_1.z.string().min(6)
});
router.post('/register', (0, validate_1.validateBody)(registerSchema), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await prisma_1.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (userExists) {
            return res.status(400).json({
                error: 'Usuário já existe'
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Erro ao criar usuário'
        });
    }
});
router.post('/login', (0, validate_1.validateBody)(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(400).json({
                error: 'Email ou senha inválidos'
            });
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({
                error: 'Email ou senha inválidos'
            });
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        const token = (0, tokens_1.createAccessToken)(payload);
        const refreshToken = (0, tokens_1.createRefreshToken)(payload);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });
        return res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatarUrl
            },
            token,
            refreshToken
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Erro no login'
        });
    }
});
router.post('/refresh-token', (0, validate_1.validateBody)(refreshSchema), async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.id }
        });
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: 'Refresh token inválido' });
        }
        const newPayload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        const token = (0, tokens_1.createAccessToken)(newPayload);
        const newRefreshToken = (0, tokens_1.createRefreshToken)(newPayload);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken }
        });
        return res.json({ token, refreshToken: newRefreshToken });
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Refresh token inválido ou expirado' });
    }
});
router.get('/users/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const authUser = req.user;
        const id = String(req.params.id);
        if (authUser.id !== id && authUser.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        const user = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});
router.patch('/users/:id', auth_1.authMiddleware, (0, validate_1.validateBody)(updateUserSchema), async (req, res) => {
    try {
        const authUser = req.user;
        const id = String(req.params.id);
        const { name, email, avatarUrl } = req.body;
        if (authUser.id !== id && authUser.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        const user = await prisma_1.prisma.user.update({
            where: { id },
            data: { name, email, avatarUrl }
        });
        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});
router.patch('/users/:id/password', auth_1.authMiddleware, (0, validate_1.validateBody)(passwordSchema), async (req, res) => {
    try {
        const authUser = req.user;
        const id = String(req.params.id);
        const { currentPassword, newPassword } = req.body;
        if (authUser.id !== id && authUser.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        const user = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const passwordMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Senha atual incorreta' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });
        return res.json({ message: 'Senha alterada com sucesso' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao alterar senha' });
    }
});
router.post('/users/password/forgot', (0, validate_1.validateBody)(forgotPasswordSchema), async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const token = Math.random().toString(36).substring(2, 12);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
        await prisma_1.prisma.user.update({
            where: { email },
            data: {
                passwordResetToken: token,
                passwordResetExpires: expiresAt
            }
        });
        return res.json({
            message: 'Token de recuperação gerado',
            resetToken: token
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao gerar token de recuperação' });
    }
});
router.post('/users/password/reset', (0, validate_1.validateBody)(resetPasswordSchema), async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                passwordResetToken: token
            }
        });
        if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
            return res.status(400).json({ error: 'Token inválido ou expirado' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null
            }
        });
        return res.json({ message: 'Senha redefinida com sucesso' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao redefinir senha' });
    }
});
exports.default = router;
