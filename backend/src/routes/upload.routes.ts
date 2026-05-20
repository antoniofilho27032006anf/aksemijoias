import { Router } from 'express'
import { upload } from '../middlewares/upload'
import { authMiddleware } from '../middlewares/auth'

const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const router = Router()

router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const file = req.file as Express.Multer.File
    if (!file) return res.status(400).json({ error: 'Nenhum arquivo enviado' })

    const url = await new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'aksemijoias' }, (error: any, result: any) => {
          if (error) reject(error)
          else resolve(result.secure_url)
        })
        .end(file.buffer)
    })

    return res.json({ url })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro ao fazer upload' })
  }
})

export default router
