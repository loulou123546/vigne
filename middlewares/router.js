import express from 'express'

const router = express.Router()

// GET request.
router.get('/', (request, response) => {
  response.render('layout', {
    view: 'home',
    title: 'Home',
  })
})

export default router
