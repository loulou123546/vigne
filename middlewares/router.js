import express from 'express'
import moment from 'moment'
import * as db from './db';

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
router.get('/parcel/add', (request, response) => {
  response.render('layout', {
    view: 'form-parcel',
    title: 'Ajouter une parcelle',
    parcel_types: db.PARCEL_TYPES
  })
})

// Add parcelle.
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

// Edit parcelle.
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
