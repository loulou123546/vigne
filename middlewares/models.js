import * as db from '../config/db';


export const getParcel = (parcel_id) => {
  return new Promise((resolve, reject) => {
    const connection = db.createConnection();
    connection.query('SELECT * FROM parcel WHERE id = ?', [parcel_id], (error, parcels) => {
      if (error) throw error
      connection.end();
      resolve(parcels[0]);
    });
    return;
  });
};

export const getParcelObservations = (parcel_id) => {
  return new Promise((resolve, reject) => {
    const connection = db.createConnection();
    connection.query('SELECT * from observation WHERE parcel_id = ?', [parcel_id], (error, observations) => {
      if (error) throw error 
      connection.end();
      resolve(observations);
    })
    return;
  })
}

export const getObservation = (obs_id) => {
  return new Promise((resolve, reject) => {
    const connection = db.createConnection();
    connection.query('SELECT * from observation WHERE id = ?', [obs_id], (error, observations) => {
      if (error) throw error 
      connection.end();
      resolve(observations[0]);
    })
    return;
  })
}