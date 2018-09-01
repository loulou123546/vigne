import express from 'express'
import moment from 'moment'
import * as db from './db'

const router = express.Router()

// Dashboard.
router.get('/', (request, response) => {
  const connection = db.createConnection()
  connection.query('SELECT * FROM parcel', (error, results, fields) => {
    if (error) throw error
    response.render('layout', {
      view: 'dashboard',
      title: 'Tableau de bord',
      parcels: results
    })
  })
  connection.end()
})

// Get parcel.
router.get('/parcel/:pid(\\d+)', (request, response) => {
  const connection = db.createConnection()
  connection.query('SELECT * FROM parcel WHERE id = ?', [request.params.pid], (error, results, fields) => {
    if (error) throw error
    response.render('layout', {
      view: 'parcel',
      title: 'Parcelle',
      parcel: results[0]
    })
  })
  connection.end()
})

// Parcel form.
router.get('/parcel/add', (request, response) => {
  response.render('layout', {
    view: 'form-parcel',
    title: 'Ajouter une parcelle',
    parcel_types: db.PARCEL_TYPES
  })
})

// Add parcel.
router.post('/parcel/add', (request, response) => {
  let parcelData = request.body
  // Get from session ?
  parcelData['farm_id'] = 1
  // Get connection
  const connection = db.createConnection()
  // Insert query
  connection.query('INSERT INTO parcel SET ?', parcelData, (error, results, fields) => {
    if (error) throw error
    response.redirect('/')
  })
  connection.end()
})

// Parcel form.
router.get('/parcel/:pid(\\d+)/edit', (request, response) => {
  const connection = db.createConnection()
  connection.query('SELECT * from parcel WHERE id = ?', [request.params.pid], (error, results, fields) => {
    if (error) throw error
    response.render('layout', {
      view: 'form-parcel',
      title: 'Éditer une parcelle',
      parcel_types: db.PARCEL_TYPES,
      parcel: {
        // ...results[0],
        // Formatting date for html field
        date_planting: moment(results[0].date_planting).format('YYYY-MM-DD')
      }
    })
  })
  connection.end()
})

// Edit parcel.
router.post('/parcel/:pid(\\d+)/edit', (request, response) => {
  let parcelData = request.body
  // Get from session ?
  parcelData['farm_id'] = 1
  // Get connection
  const connection = db.createConnection()
  // Update query
  connection.query('UPDATE parcel SET ? WHERE id = ?', [parcelData, request.params.pid], (error, results, fields) => {
    if (error) throw error
    response.redirect('/')
  })
  connection.end()
})

// Delete parcel.
router.get('/parcel/:pid(\\d+)/delete', (request, response) => {
  const connection = db.createConnection()
  connection.query('DELETE FROM parcel WHERE id = ?', [request.params.pid], (error, results, fields) => {
    if (error) throw error
    response.redirect('/')
  })
  connection.end()
})

// Observation form.
router.get('/parcel/:pid(\\d+)/observation/add', (request, response) => {
  response.render('layout', {
    view: 'form-observation',
    title: 'Ajouter une observation',
  })
})

// Add observation.
router.post('/parcel/:pid(\\d+)/observation/add', (request, response) => { //duplicate
  response.render('layout', {
    view: 'form-observation',
    title: 'Ajouter une observation',
  })
})

// Observation form.
router.get('/parcel/:pid(\\d+)/observation/:oid(\\d+)/edit', (request, response) => { //never edit
  response.render('layout', {
    view: 'form-observation',
    title: 'Éditer une observation',
  })
})

// Edit observation.
router.post('/parcel/:pid(\\d+)/observation/:oid(\\d+)/edit', (request, response) => { //never edit
  response.render('layout', {
    view: 'form-observation',
    title: 'Éditer une observation',
  })
})

// Delete observation.
router.get('/parcel/:pid(\\d+)/observation/:oid(\\d+)/delete', (request, response) => { //never delete
  //TODO : delete observation
  response.redirect('/')
})

export default router
