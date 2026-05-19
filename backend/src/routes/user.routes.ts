import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { validateBody } from '../middlewares/validate'
import { authMiddleware } from '../middlewares/auth'
import { createAccessToken, createRefreshToken } from '../lib/tokens'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

const refreshSchema = z.object({
  refreshToken: z.string().min(10)
})

const updateUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  avatarUrl: z.string().url().optional()
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6)
})

const forgotPasswordSchema = z.object({
  email: z.string().email()
})

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6)
})

router.post('/register', validateBody(registerSchema), async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body

    const userExists =
      await prisma.user.findUnique({

        where: {
          email
        }

      })

    if (userExists) {

      return res.status(400).json({
        error: 'Usuário já existe'
      })
    }

    const hashedPassword =
      await bcrypt.hash(password, 10)

    const user =
      await prisma.user.create({

        data: {

          name,
          email,
          password: hashedPassword

        }

      })

    return res.json({

      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role

    })

  } catch (error) {

    console.log(error)

    return res.status(500).json({
      error: 'Erro ao criar usuário'
    })
  }

})

router.post('/login', validateBody(loginSchema), async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body

    const user =
      await prisma.user.findUnique({

        where: {
          email
        }

      })

    if (!user) {

      return res.status(400).json({
        error: 'Email ou senha inválidos'
      })
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      )

    if (!passwordMatch) {

      return res.status(400).json({
        error: 'Email ou senha inválidos'
      })
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    const token = createAccessToken(payload)
    const refreshToken = createRefreshToken(payload)

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    })

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
    })

  } catch (error) {

    console.log(error)

    return res.status(500).json({
      error: 'Erro no login'
    })
  }

})

router.post('/refresh-token', validateBody(refreshSchema), async (req, res) => {
  try {
    const { refreshToken } = req.body

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { id: string; email: string; role: string }

    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    })

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Refresh token inválido' })
    }

    const newPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    const token = createAccessToken(newPayload)
    const newRefreshToken = createRefreshToken(newPayload)

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    })

    return res.json({ token, refreshToken: newRefreshToken })
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'Refresh token inválido ou expirado' })
  }
})

router.get('/users/:id', authMiddleware, async (req, res) => {
  try {
    const authUser = (req as any).user
    const { id } = req.params

    if (authUser.id !== id && authUser.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
})

router.patch('/users/:id', authMiddleware, validateBody(updateUserSchema), async (req, res) => {
  try {
    const authUser = (req as any).user
    const { id } = req.params
    const { name, email, avatarUrl } = req.body

    if (authUser.id !== id && authUser.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { name, email, avatarUrl }
    })

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao atualizar usuário' })
  }
})

router.patch('/users/:id/password', authMiddleware, validateBody(passwordSchema), async (req, res) => {
  try {
    const authUser = (req as any).user
    const { id } = req.params
    const { currentPassword, newPassword } = req.body

    if (authUser.id !== id && authUser.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password)

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Senha atual incorreta' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    })

    return res.json({ message: 'Senha alterada com sucesso' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao alterar senha' })
  }
})

router.post('/users/password/forgot', validateBody(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    const token = Math.random().toString(36).substring(2, 12)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expiresAt
      }
    })

    return res.json({
      message: 'Token de recuperação gerado',
      resetToken: token
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao gerar token de recuperação' })
  }
})

router.post('/users/password/reset', validateBody(resetPasswordSchema), async (req, res) => {
  try {
    const { token, password } = req.body

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token
      }
    })

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ error: 'Token inválido ou expirado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    })

    return res.json({ message: 'Senha redefinida com sucesso' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao redefinir senha' })
  }
})

export default router