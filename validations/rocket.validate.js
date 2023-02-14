const Joi = require('joi')
module.exports = function (data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    height: Joi.number().min(5).required(),
    diameter: Joi.number().min(5).required(),
    mass: Joi.number().min(5).required(),
  })
  return schema.validate(data)
}
