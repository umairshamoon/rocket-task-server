const express = require('express')
const router = express.Router()
const {
  create,
  getAll,
  _delete,
  getById,
  edit,
} = require('../controllers/rocket.controller')
const upload = require('../middleware/multer.middleware')
const { isLogin, isAdmin } = require('../middleware')

router.post(
  '/create',
  isLogin,
  isAdmin,
  upload.single('photo'),
  create
)
router.get('/', isLogin, getAll)
router.get('/get/:id', isLogin, isAdmin, getById)
router.delete('/delete/:id', isLogin, isAdmin, _delete)
router.put('/edit/:id', isLogin, isAdmin, edit)

module.exports = router
