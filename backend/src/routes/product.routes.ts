import { Router } from 'express'
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { upload } from '../middlewares/upload'
import { adminMiddleware } from '../middlewares/admin'
import { validateBody } from '../middlewares/validate'

const cloudinary = require('cloudinary').v2

cloudinary.config({

  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET

})

const router = Router()

const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.preprocess((value) => Number(value), z.number().positive()),
  stock: z.preprocess((value) => Number(value), z.number().int().nonnegative())
})

router.post(
  '/products',
  adminMiddleware,
  upload.single('image'),
  validateBody(productSchema),
  async (req, res) => {
    const {
      name,
      description,
      price,
      stock
    } = req.body

    const file =
      req.file as Express.Multer.File

    const uploadedImage =
      await new Promise<any>(
        (resolve, reject) => {

          cloudinary.uploader
            .upload_stream(
              {
                folder: 'aksemijoias'
              },

              (
                error: any,
                result: any
              ) => {

                if (error) {
                  reject(error)
                }

                resolve(result)
              }
            )
            .end(file.buffer)
        }
      )

    const image =
      uploadedImage.secure_url

    const product =
      await prisma.product.create({
        data: {

          name,
          description,
          price: Number(price),
          stock: Number(stock),
          image,

          status: true

        }
      })

    return res.json(product)
  }
)

router.get(
  '/products',
  async (req, res) => {

    const products =
      await prisma.product.findMany({
        where: {
          status: true
        }
      })

    return res.json(products)
  }
)

router.put(
  '/products/:id',
  adminMiddleware,
  upload.single('image'),
  validateBody(productSchema),
  async (req, res) => {
    const { id } = req.params

    const {
      name,
      description,
      price,
      stock
    } = req.body

    let image

    const file =
      req.file as Express.Multer.File

    if (file) {

      const uploadedImage =
        await new Promise<any>(
          (resolve, reject) => {

            cloudinary.uploader
              .upload_stream(
                {
                  folder: 'aksemijoias'
                },

                (
                  error: any,
                  result: any
                ) => {

                  if (error) {
                    reject(error)
                  }

                  resolve(result)
                }
              )
              .end(file.buffer)
          }
        )

      image =
        uploadedImage.secure_url
    }

    const product =
      await prisma.product.update({
        where: {
          id: Array.isArray(id) ? id[0] : id
        },

        data: {

          name,
          description,
          price: Number(price),
          stock: Number(stock),

          ...(image && { image }),

          status: true

        }
      })

    return res.json(product)
  }
)

router.delete(
  '/products/:id',
  adminMiddleware,
  async (req, res) => {
    const { id } = req.params

    await prisma.product.update({

      where: {
        id
      },

      data: {
        status: false
      }

    })

    return res.json({
      message: 'Produto ocultado'
    })
  }
)
export default router