import express from 'express'

const router = express.Router()

// Dashboard.
router.get('/', (request, response) => {
  response.render('layout', {
    view: 'dashboard',
    title: 'Tableau de bord',
  })
})

// Get parcelle.
router.get('/parcelle/:pid(\\d+)', (request, response) => {
  response.render('layout', {
    view: 'parcelle',
    title: 'Parcelle',
  })
})

// Add parcelle.
router.post('/parcelle/add', (request, response) => {
  response.render('layout', {
    view: 'form-parcelle',
    title: 'Ajouter une parcelle',
  })
})

// Edit parcelle.
router.post('/parcelle/:pid(\\d+)/edit', (request, response) => {
  response.render('layout', {
    view: 'form-parcelle',
    title: 'Éditer une parcelle',
  })
})

// Delete parcelle.
router.get('/parcelle/:pid(\\d+)/delete', (request, response) => {
  //TODO : delete parcelle
  response.redirect('/')
})

// Add observation.
router.post('/observation/add', (request, response) => {
  response.render('layout', {
    view: 'form-observation',
    title: 'Ajouter une observation',
  })
})

// Edit observation.
router.post('/observation/:pid(\\d+)/edit', (request, response) => {
  response.render('layout', {
    view: 'form-observation',
    title: 'Éditer une observation',
  })
})

// Delete observation.
router.get('/observation/:pid(\\d+)/delete', (request, response) => {
  //TODO : delete observation
  response.redirect('/')
})

export default router
