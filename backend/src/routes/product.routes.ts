import { Router } from 'express'

import { prisma } from '../lib/prisma'
import { upload } from '../middlewares/upload'

const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: 'dkv1fo87n',
  api_key: '954673969238786',
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const router = Router()

router.post(
  '/products',
  upload.single('image'),
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
  upload.single('image'),
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
  async (req, res) => {

    const { id } = req.params

    await prisma.product.delete({
      where: {
        id
      }
    })

    return res.json({
      message: 'Produto deletado'
    })
  }
)

export default router