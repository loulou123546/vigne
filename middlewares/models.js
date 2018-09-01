import * as db from '../config/db';


export const getParcels = (farm_id) => {
  return new Promise((resolve, reject) => {
    const connection = db.createConnection();
    connection.query('SELECT * FROM parcel', (error, parcels) => {
      if (error) throw error
      connection.end();
      resolve(parcels);
    })
    return;
  });
}

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

export const postParcel = (data) => {
  return new Promise((resolve, reject) => {
    const connection = db.createConnection();
    // Insert query
    connection.query('INSERT INTO parcel SET ?', data, (error) => {
      if (error) throw error
      revolve();
    })
    connection.end()
  });
}

export const putParcel = (data, parcel_id) => {
  return new Promise((resolve, reject) => {
    const connection = db.createConnection()
    // Update query
    connection.query('UPDATE parcel SET ? WHERE id = ?', [data, parcel_id], (error, results, fields) => {
      if (error) throw error
      resolve();
    })
    connection.end()
  });
}

export const deleteParcel = (parcel_id) => {
  return new Promise((resolve, reject) => {
    const connection = db.createConnection()
    connection.query('DELETE FROM parcel WHERE id = ?', [request.params.pid], (error, results, fields) => {
      if (error) throw error
      resolve();
    })
    connection.end()
  });
}

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

export const postObservation = (data) => {
  return new Promise((resolve, reject) => {
    const connection = db.createConnection()
    connection.query('INSERT INTO observation SET ?', data, (error) => {
      if (error) throw error
      connection.end()
      resolve();
    })
    return;
  });
}

export const putObservation = (data, obs_id) => {
  return new Promise((resolve, reject) => {
    const connection = db.createConnection()
    connection.query('UPDATE observation SET ? WHERE id = ?', [data, obs_id], (error, results, fields) => {
      if (error) throw error
      connection.end()
      resolve();
    })
    return;
  });
}