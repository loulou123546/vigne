import express from 'express'
import * as db from './db';

const router = express.Router()

// Dashboard.
router.get('/', (request, response) => {
  response.render('layout', {
    view: 'dashboard',
    title: 'Tableau de bord',
  })
})

// Get parcel.
router.get('/parcel/:pid(\\d+)', (request, response) => {
  response.render('layout', {
    view: 'parcel',
    title: 'Parcelle',
  })
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
  let parcelData = request.body;
  // Get from session ?
  parcelData['farm_id'] = 1;
  // Get connection
  const connection = db.createConnection();
  // Insert query
  connection.query('INSERT INTO parcel SET ?', parcelData, (error, results, fields) => {
    if (error) throw error
    console.log(results);
  });
  connection.end();
  // Redirect to home
  response.redirect('/');
})

// Parcel form.
router.get('/parcel/:pid(\\d+)/edit', (request, response) => {
  const connection = db.createConnection();
  connection.query('SELECT * from parcel WHERE id = ?', [request.params.pid], (error, results, fields) => {
    if (error) throw error;
    console.log(results);
    response.render('layout', {
      view: 'form-parcel',
      title: 'Éditer une parcelle',
      parcel_types: db.PARCEL_TYPES,
      parcel: results[0]
    })
  });
  connection.end();
})

// Edit parcel.
router.post('/parcel/:pid(\\d+)/edit', (request, response) => {
  let parcelData = request.body;
  // Get from session ?
  parcelData['farm_id'] = 1;
  // Get connection
  const connection = db.createConnection();
  // TODO: Insert query
  connection.query('...', parcelData, (error, results, fields) => {
    if (error) throw error
    console.log(results);
  });
  connection.end();
  // Redirect to home
  response.redirect('/');
})

// Delete parcelle.
router.get('/parcel/:pid(\\d+)/delete', (request, response) => {
  //TODO : delete parcelle
  response.redirect('/')
})

// Observation form.
router.get('/observation/add', (request, response) => {
  response.render('layout', {
    view: 'form-observation',
    title: 'Ajouter une observation',
  })
})

// Add observation.
router.post('/observation/add', (request, response) => {
  response.render('layout', {
    view: 'form-observation',
    title: 'Ajouter une observation',
  })
})

// Observation form.
router.get('/observation/:oid(\\d+)/edit', (request, response) => {
  response.render('layout', {
    view: 'form-observation',
    title: 'Éditer une observation',
  })
})

// Edit observation.
router.post('/observation/:oid(\\d+)/edit', (request, response) => {
  response.render('layout', {
    view: 'form-observation',
    title: 'Éditer une observation',
  })
})

// Delete observation.
router.get('/observation/:oid(\\d+)/delete', (request, response) => {
  //TODO : delete observation
  response.redirect('/')
})

export default router
