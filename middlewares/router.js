import express from 'express'
import moment from 'moment'
import * as db from '../config/db'
import * as models from './models'

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
  models.getParcel(request.params.pid).then(parcel =>
    models.getParcelObservations(request.params.pid).then(observations => {
      response.render('layout', {
        view: 'parcel',
        title: 'Parcelle',
        moment: moment,
        parcel_types: db.PARCEL_TYPES,
        parcel: parcel,
        observations: observations
      })
    })
  )
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
  parcelData['farm_id'] = 1;
  // Get connection
  const connection = db.createConnection();
  // Insert query
  connection.query('INSERT INTO parcel SET ?', parcelData, (error) => {
    if (error) throw error
    response.redirect('/')
  })
  connection.end()
})

// Parcel form.
router.get('/parcel/:pid(\\d+)/edit', (request, response) => {
  models.getParcel(request.params.pid).then(parcel => {
    parcel.date_planting = moment(parcel.date_planting).format('YYYY-MM-DD');
    response.render('layout', {
      view: 'form-parcel',
      title: 'Éditer une parcelle',
      parcel_types: db.PARCEL_TYPES,
      parcel: parcel,
    })
  })
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
  models.getParcel(request.params.pid).then(parcel => {
    response.render('layout', {
      view: 'form-observation',
      title: 'Créer une observation',
      date_now: moment().format('YYYY-MM-DD'), 
      parcel: {
        id: parcel.id,
        name: parcel.name
      }
    })
  })
  connection.end();
})

// Add observation.
router.post('/parcel/:pid(\\d+)/observation/add', (request, response) => {
  let newObservation = request.body;
  // TODO: get from session ?
  newObservation['parcel_id'] = request.params.pid;
  newObservation['user_id'] = 1;
  newObservation['bunch_area'] = null;
  // Get connection
  const connection = db.createConnection()
  // Insert query
  connection.query('INSERT INTO observation SET ?', newObservation, (error) => {
    if (error) throw error

    response.redirect(`/parcel/${request.params.pid}`)
  })
  connection.end()
})

// Observation form.
router.get('/parcel/:pid(\\d+)/observation/:oid(\\d+)/edit', (request, response) => {
  models.getParcel(request.params.pid).then(parcel => {
    models.getObservation(request.params.oid).then(observation => {
      observation.step_1_date = moment(observation.step_1_date).format('YYYY-MM-DD');
      if (observation.step_2_date)
        observation.step_2_date = moment(observation.step_2_date).format('YYYY-MM-DD');
      if (observation.step_3_date)
        observation.step_3_date = moment(observation.step_3_date).format('YYYY-MM-DD');
      response.render('layout', {
        view: 'form-observation',
        title: 'Éditer une observation',
        parcel: parcel,
        observation: observation,
      })
    })
  })
})

// Edit observation.
router.post('/parcel/:pid(\\d+)/observation/:oid(\\d+)/edit', (request, response) => {
  const observationData = request.body;
  const connection = db.createConnection()
  // Update query
  connection.query('UPDATE observation SET ? WHERE id = ?', [observationData, request.params.oid], (error, results, fields) => {
    if (error) throw error
    response.redirect(`/parcel/${request.params.pid}`);
  })
  connection.end()
})

// Delete observation.
router.get('/parcel/:pid(\\d+)/observation/:oid(\\d+)/delete', (request, response) => { //never delete
  //TODO : delete observation
  response.redirect('/')
})

export default router
