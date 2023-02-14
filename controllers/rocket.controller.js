//models
const Rocket = require('../models/rocket.model')
//validatoins
const validateRocket = require('../validations/rocket.validate')
//helpers
const joiHelper = require('../helpers/joi.helper')
const cloudinary = require('../helpers/cloudinary')
const bufferConversion = require('../helpers/bufferConversion')

module.exports = {
  create: async (req, res) => {
    try {
      const { originalname, buffer } = req.file
      joiHelper(validateRocket, req.body)
      if (!originalname)
        throw Error('please upload rocket image')

      req.body.addedBy = req.user.id
      const { secure_url } = await cloudinary(
        bufferConversion(originalname, buffer)
      )
      req.body.photo = secure_url
      const rocket = await Rocket.create(req.body)
      res.status(201).json({
        message: 'Rocket Added Successfully',
        rocket,
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  getAll: async (req, res) => {
    try {
      const { limit = 2, page = 1 } = req.query
      const skip = (page - 1) * limit
      const rockets = await Rocket.find()
        .skip(skip)
        .limit(limit)
        .populate('addedBy', '-password -role -_id')

      if (!rockets.length) throw Error('no rocket ')
      res.status(200).json(rockets)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  _delete: async (req, res) => {
    const { id } = req.params
    await Rocket.findByIdAndDelete(id)
      .then(res.json({ message: 'rocket deleted' }))
      .catch((e) =>
        res.status(400).json({
          message: error.message || 'Something went Wrong',
        })
      )
  },
  getById: async (req, res) => {
    try {
      const rocket = await Rocket.findById(req.params.id)
      if (!rocket) throw Error('no rocket ')
      res.status(200).json(rocket)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
  edit: (req, res) => {
    console.log(req.body)
    Rocket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .then((rocket) => {
        res
          .status(200)
          .json({ message: 'Update Successful', rocket })
      })
      .catch((e) => {
        res.status(400).json({ message: e.message })
      })
  },
}
