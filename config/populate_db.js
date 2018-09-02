import mysql from 'mysql';
import csv from 'fast-csv';
import moment from 'moment';
import * as db from './db';
import 'babel-polyfill';

const insertEntry = (connection, table_name, dataset) => {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO ${table_name} SET ? ;`; 
		connection.query(sql, dataset, (error) => {
			resolve();
		});
		return;
	})
}

const insertEntries = async (table_name, datasets) => {
	const connection = db.createConnection();
	for (var i = 0 ; i < datasets.length ; i++) {
		await insertEntry(connection, table_name, datasets[i])
	}
    connection.end();
}


const populateFarms = async () => {
	let farms = [];
	for (var i = 1 ; i < 15 ; i++) {
		farms.push({
			id: i,
			name: `ADH${i}`
		})
	}
	await insertEntries('farm', farms);
}

const populateUsers = async () => {
	const users = [{
		id: 1,
		farm_id: 1,
		mail: 'durand@pins.fr',
		password: 'test',
		first_name: 'Bernard',
		last_name: 'Durand'
	}, {
		id: 2,
		farm_id: 1,
		mail: 'martin@pins.fr',
		password: 'test',
		first_name: 'François',
		last_name: 'Martin'	
	}]
	await insertEntries('user', users);
}

const populateParcels = async () => {
	let parcels = [];
	csv.fromPath("./config/TAB_parcel.csv", {headers: true}).on("data", async function(data){
	 	let entry = {
	 		farm_id: data.farm,
	 		name: data.name,
	 		area: data.area,
	 		type: data.type,
	 		date_planting: data.date_planting,
	 		row_distance: data.dist_inter_rang,
	 		plant_distance: data.dist_inter_plant,
	 		lat: data.lat,
	 		lng: data.lon
	 	};
	 	parcels.push(entry);

	}).on("end", async function(){
		await insertEntries('parcel', parcels);
	})
};


const fetchParcelsByName = () => {
	return new Promise((resolve, reject) => {
		let parcelsByName = {};
		const connection = db.createConnection();	
		const sql = `SELECT * FROM parcel`;
		connection.query(sql, (error, results, fields) => {
			if (error) throw error;
			results.map(parcel => {
				parcelsByName[parcel.name] = parcel
			})
			connection.end();
			resolve(parcelsByName);
		});
		return;
	});
}

const populateObservations = async () => {
	let observations = [];
	fetchParcelsByName().then(parcelsByName => {
		csv.fromPath("./config/TAB_obs.csv", {headers: true}).on("data", function(data){
		 	let entry = {
		 		parcel_id: parcelsByName[data.name].id,
		 		user_id: null,
		 		step_1_date: moment(data.annee, 'YYYY').format('YYYY-MM-DD'),
		 		plant_number: data.nb_ceps_compte,
		 		bunch_number: data.nb_grappes_total,
		 		bunch_area: data.nb_grappes_m2,
		 		weight: data.poids_grappe_moyen_1,
		 		sugar_rate: data.taux_sucre_moyen_1,
		 		weight_real: data.poids_grappe_moyen_2,
		 		sugar_rate_real: data.taux_sucre_moyen_2
		 	};
		 	observations.push(entry);

		}).on("end", async function(){
			await insertEntries('observation', observations);
		});
	})
};

const populateAlerts = async () => {
	const alerts = [{
		id: 1,
		user_id: 1,
		date: moment().format('YYY-MM-DD'),
		type: 1,
		description: 'Alerte rouge, alerte rouge !',
		lat: 43.5896523,
		lng: 1.548562
	}];
	await insertEntries('alert', alerts);
}

if (process.argv[2] === 'farm') {
	populateFarms();
} else if (process.argv[2] === 'user') {
	populateUsers();
} else if (process.argv[2] === 'parcel') {
	populateParcels();
} else if (process.argv[2] === 'observation') {
	populateObservations();
} else if (process.argv[2] === 'alert') {
	populateAlerts();
}