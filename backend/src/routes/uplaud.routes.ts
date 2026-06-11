import { Router } from 'express'

import multer from 'multer'

import { cloudinary } from '../config/cloudinary'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage()
})

router.post(
  '/upload',
  upload.single('file'),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error: 'Arquivo não enviado'
        })

      }

      const fileBase64 =

        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`

      const uploadedFile =
        await cloudinary.uploader.upload(
          fileBase64,
          {

            folder: 'AKsemijoias'

          }
        )

      return res.json({

        url: uploadedFile.secure_url

      })

    } catch (error) {

      console.log(error)

      return res.status(500).json({
        error: 'Erro no upload'
      })
    }

  }
)

export default router