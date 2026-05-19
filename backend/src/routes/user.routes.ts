import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { prisma } from '../lib/prisma'

const router = Router()

router.post('/register', async (req, res) => {

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

router.post('/login', async (req, res) => {

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

    const token =
      jwt.sign(

        {
          id: user.id,
          email: user.email,
          role: user.role
        },

        process.env.JWT_SECRET as string,

        {
          expiresIn: '7d'
        }

      )

    return res.json({

      user: {

        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role

      },

      token

    })

  } catch (error) {

    console.log(error)

    return res.status(500).json({
      error: 'Erro no login'
    })
  }

})

export default router