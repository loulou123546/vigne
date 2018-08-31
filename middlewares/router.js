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
router.get('/parcel/:pid(\\d+)', (request, response) => {
  response.render('layout', {
    view: 'parcel',
    title: 'Parcelle',
  })
})

// Add parcelle.
router.post('/parcel/add', (request, response) => {
  response.render('layout', {
    view: 'form-parcel',
    title: 'Ajouter une parcelle',
  })
})

// Edit parcelle.
router.post('/parcel/:pid(\\d+)/edit', (request, response) => {
  response.render('layout', {
    view: 'form-parcel',
    title: 'Éditer une parcelle',
  })
})

// Delete parcelle.
router.get('/parcel/:pid(\\d+)/delete', (request, response) => {
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
