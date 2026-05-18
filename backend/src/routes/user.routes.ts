import { Router } from 'express'
import bcrypt from 'bcryptjs'

import { prisma } from '../lib/prisma'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (userExists) {
    return res.status(400).json({
      error: 'Usuário já existe'
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return res.json(user)
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (!user) {
    return res.status(400).json({
      error: 'Email ou senha inválidos'
    })
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  )

  if (!passwordMatch) {
    return res.status(400).json({
      error: 'Email ou senha inválidos'
    })
  }

  const token = jwt.sign(
    {
      id: user.id
    },
    'AKSEGREDO',
    {
      expiresIn: '7d'
    }
  )

  return res.json({
    user,
    token
  })
})

export default router