import express from 'express'
import moment from 'moment'
import * as db from '../config/db'
import * as models from './models'

const router = express.Router()
function checkSignIn(request, response, next) {
  if (request.session.user) {
    next()
  }
  else {
    response.redirect('/login')
  }
}

// Dashboard.
router.get('/', checkSignIn, (request, response) => {
  models.getParcels().then(parcels => {
    for (let i = 0 ; i < parcels.length ; i++) {
      const parcel = parcels[i];
      const parcelMoments = [parcel.step_1_date, parcel.step_2_date, parcel.step_3_date].map(d => moment(d));
      parcel.last_date = moment.max(parcelMoments.filter(m => m.isValid())).format('DD MMM YYYY');
    }
    response.render('layout', {
      view: 'dashboard',
      title: 'Tableau de bord',
      mail: request.session.user.mail,
      maxAge: request.session.cookie.maxAge,
      parcels: parcels,
    })
  })
})

// Get parcel.
router.get('/parcel/:pid(\\d+)', checkSignIn, (request, response) => {
  models.getParcel(request.params.pid).then(parcel =>
    models.getParcelObservations(request.params.pid).then(observations => {
      response.render('layout', {
        view: 'parcel',
        title: 'Parcelle',
        moment: moment,
        parcel: parcel,
        observations: observations
      })
    })
  )
})

// Parcel form.
router.get('/parcel/add', checkSignIn, (request, response) => {
  response.render('layout', {
    view: 'form-parcel',
    title: 'Ajouter une parcelle',
    parcel_types: db.PARCEL_TYPES
  })
})

// Add parcel.
router.post('/parcel/add', checkSignIn, (request, response) => {
  let parcelData = request.body
  // Get from session ?
  parcelData['farm_id'] = 1;
  models.postParcel(parcelData).then(() => {
    response.redirect('/');
  })
})

// Parcel form.
router.get('/parcel/:pid(\\d+)/edit', checkSignIn, (request, response) => {
  models.getParcel(request.params.pid).then(parcel => {
    parcel.date_planting = moment(parcel.date_planting).format('YYYY-MM-DD');
    response.render('layout', {
      view: 'form-parcel',
      title: 'Éditer une parcelle',
      parcel_types: db.PARCEL_TYPES,
      parcel: parcel
    })
  })
})

// Edit parcel.
router.post('/parcel/:pid(\\d+)/edit', checkSignIn, (request, response) => {
  let parcelData = request.body
  // Get from session ?
  parcelData['farm_id'] = 1
  models.putParcel(parcelData, request.params.pid).then(() => {
    response.redirect('/');
  });
})

// Delete parcel.
router.get('/parcel/:pid(\\d+)/delete', checkSignIn, (request, response) => {
  models.deleteParcel(request.params.pid).then(() => {
    response.redirect('/');
  });
})

// Observation form.
router.get('/parcel/:pid(\\d+)/observation/add', checkSignIn, (request, response) => {
  models.getParcel(request.params.pid).then(parcel => {
    console.log(parcel)
    response.render('layout', {
      view: 'form-observation',
      title: 'Créer une observation',
      date_now: moment().format('YYYY-MM-DD'), 
      parcel: parcel
    })
  })
})

// Add observation.
router.post('/parcel/:pid(\\d+)/observation/add', checkSignIn, (request, response) => {
  let newObservation = request.body;
  // TODO: get from session ?
  newObservation['parcel_id'] = request.params.pid;
  newObservation['user_id'] = 1;
  newObservation['bunch_area'] = null;
  // Get connection
  models.postObservation(newObservation).then(() => {
    response.redirect(`/parcel/${request.params.pid}`);
  })
})

// Observation form.
router.get('/parcel/:pid(\\d+)/observation/:oid(\\d+)/edit', checkSignIn, (request, response) => {
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
router.post('/parcel/:pid(\\d+)/observation/:oid(\\d+)/edit', checkSignIn, (request, response) => {
  models.putObservation(request.body, request.params.oid).then(() => {
    response.redirect(`/parcel/${request.params.pid}`);
  });
})

// Delete observation.
router.get('/parcel/:pid(\\d+)/observation/:oid(\\d+)/delete', checkSignIn, (request, response) => { //never delete
  //TODO : delete observation
  response.redirect('/')
})

router.get('/login', (request, response) => {
  response.render('layout', {
    view: 'login',
    title: 'Connexion',
  })
})

router.post('/login', (request, response) => {
  if (!request.body.mail || !request.body.password) {
    response.render('layout', {
      view: 'login',
      title: 'Connexion',
      message: "Veuillez remplir l'identifiant et le mot de passe",
    })
  }
  else {
    const connection = db.createConnection()
    connection.query('SELECT * FROM user WHERE mail = ? AND password = ?', [request.body.mail, request.body.password], (error, results) => {
      if (error) throw error

      if (results[0].mail === request.body.mail && results[0].password === request.body.password) {
        request.session.user = results[0]
        response.redirect('/')
      }
      else {
        response.render('layout', {
          view: 'login',
          title: 'Connexion',
          message: "L'identifiant ou le mot de passe n'est pas correct",
        })
      }
    })
    connection.end()
  }
})

router.get('/logout', (request, response) => {
  request.session.destroy(() => {
    console.log('User logged out.')
  })
  response.redirect('/')
})

export default router
