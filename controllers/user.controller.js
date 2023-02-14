//npm
const bcrypt = require('bcryptjs')
//models
const User = require('../models/user.model')
//validatoins
const validateLogin = require('../validations/login.validation')
const validateUser = require('../validations/userRegister.validate')
//helpers
const joiHelper = require('../helpers/joi.helper')
const jwtSign = require('../helpers/jwtSign.helper')
const cloudinary = require('../helpers/cloudinary')
const bufferConversion = require('../helpers/bufferConversion')

module.exports = {
  login: async (req, res) => {
    try {
      const { password, email } = req.body
      joiHelper(validateLogin, req.body)
      const user = await User.findOne({ email })
      if (!user) throw Error('incorrect email')
      if (!(await bcrypt.compare(password, user.password)))
        throw Error('Incorrect Password')

      res.status(200).json({
        message: 'Login successfully',
        role: user.role,
        avatar: user.avatar,
        token: jwtSign({ id: user.id, role: user.role }),
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  register: async (req, res) => {
    try {
      const { password, username, email } = req.body
      const { originalname, buffer } = req.file
      if (!originalname)
        throw Error('please upload rocket image')
      //VALIDATE REQUEST BODY
      joiHelper(validateUser, req.body)

      const user = await User.findOne({ email })
      if (user) throw Error('Email already exist')
      const { secure_url } = await cloudinary(
        bufferConversion(originalname, buffer)
      )

      await User.create({
        username,
        email,
        avatar: secure_url,
        password: await bcrypt.hash(password, 10),
      })
      res.status(200).json({
        message: 'Your Account has created',
      })
    } catch (error) {
      return res.status(400).json({
        message: error.message || 'Something went Wrong',
      })
    }
  },
}
