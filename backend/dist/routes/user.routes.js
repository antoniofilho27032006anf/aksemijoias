"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
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
    return res.json(user);
});
router.post('/login', async (req, res) => {
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
    const token = jsonwebtoken_1.default.sign({
        id: user.id
    }, 'AKSEGREDO', {
        expiresIn: '7d'
    });
    return res.json({
        user,
        token
    });
});
exports.default = router;
