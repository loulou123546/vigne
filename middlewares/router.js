import express from 'express'
import moment from 'moment'
import * as db from '../config/db'
import * as models from './models'
import * as rendement from '../lib/rendement'

moment.locale('fr');

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
  models.getParcels(request.session.user.farm_id).then((parcels) => {
    // Check there is at least one observation
    parcels = parcels.map((parcel) => {
      if (parcel.id) {
        parcel.rend = rendement.grappeMetreCarre(
          parcel.bunch_number,
          parcel.plant_number,
          parcel.row_distance,
          parcel.plant_distance,
        ).rendement1(parcel.area).toFixed(2)
      }

      return parcel
    })

    const totalrend = parcels.reduce((accumulator, parcel) => (parcel.id ? Number(parcel.rend) + accumulator : accumulator), 0).toFixed(2)

    for (let i = 0; i < parcels.length; i++) {
      const parcel = parcels[i]
      const parcelMoments = [parcel.step_1_date, parcel.step_2_date, parcel.step_3_date].map(d => moment(d)).filter(m => m.isValid())
      if (parcelMoments.length > 0) {
        parcel.last_date = moment.max(parcelMoments).format('DD MMM YYYY')
      }
    }

    response.render('layout', {
      view: 'dashboard',
      title: 'Tableau de bord',
      totalrend,
      parcels,
    })
  })
})

// Get parcel.
router.get('/parcel/:pid(\\d+)', checkSignIn, (request, response) => {
  models.getParcel(request.params.pid).then(parcel =>
    models.getParcelObservations(request.params.pid).then(observations => {
      parcel.rend = rendement.grappeMetreCarre(
        parcel.bunch_number,
        parcel.plant_number,
        parcel.row_distance,
        parcel.plant_distance,
      ).rendement1(parcel.area) || 0

      if (parcel.rend) {
        parcel.rend = parcel.rend.toFixed(2)
      }

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
  if (parcelData['date_planting'] === '') {
    parcelData['date_planting'] = null;
  }
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
  if (parcelData['date_planting'] === '') {
    parcelData['date_planting'] = null;
  }
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
  models.getParcel(request.params.pid).then((parcel) => {
    response.render('layout', {
      view: 'form-observation',
      title: 'Créer une observation',
      date_now: moment().format('YYYY-MM-DD'),
      parcel,
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
  if (newObservation['step_2_date'] === '') {
    newObservation['step_2_date'] = null;
  }
  if (newObservation['step_3_date'] === '') {
    newObservation['step_3_date'] = null;
  }
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
  const newObservation = request.body;
  if (newObservation['step_2_date'] === '') {
    newObservation['step_2_date'] = null;
  }
  if (newObservation['step_3_date'] === '') {
    newObservation['step_3_date'] = null;
  }
  models.putObservation(newObservation, request.params.oid).then(() => {
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

router.get('/social', (request, response) => {
  response.render('layout', {
    view: 'social',
    title: 'Social',
  })
})

router.get('/socialData', (request, response) => {
  models.getParcels(1).then(parcels => {
    let results = [];
    parcels.map((parcel) => {
      if (parcel.id) {
        results.push({
          name: parcel.name,
          lat: parcel.lat,
          lng: parcel.lng,
          rend: rendement.grappeMetreCarre(
                  parcel.bunch_number,
                  parcel.plant_number,
                  parcel.row_distance,
                  parcel.plant_distance,
                ).rendement1(parcel.area)
        });
      }
      return parcel
    })
    response.send(results)
  });
})

router.get('/alerts', (request, response) => {
  response.render('layout', {
    view: 'alerts',
    title: 'Alertes',
  })
})

router.get('/alertData', (request, response) => {
  models.getAlerts().then(alerts => {
    let results = alerts.map(alertData => {
      alertData.date = moment(alertData.date).format('ll');
      alertData.type = (alertData.type === 1) ? 'Maladie' : 'Autre';
      return alertData;
    })
    response.send(results)
  });
})


export default router
