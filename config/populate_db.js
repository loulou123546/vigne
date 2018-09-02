import mysql from 'mysql';
import csv from 'fast-csv';
import moment from 'moment';
import * as db from './db';
import 'babel-polyfill';

const insertEntry = (connection, table_name, dataset) => {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO ${table_name} SET ? ;`; 
		connection.query(sql, dataset, (error) => {
			if (error) throw error;
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
	 		date_planting: (data.date_planting === 'NA') ? data.date_planting : null,
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
		 		step_1_date: (data.annee !== 'NA') ? moment(data.annee, 'YYYY').format('YYYY-MM-DD') : null,
		 		plant_number: data.nb_ceps_compte,
		 		bunch_number: (data.nb_grappes_total !== 'NA') ? data.nb_grappes_total : null,
		 		bunch_area: data.nb_grappes_m2,
		 		weight: data.poids_grappe_moyen_1,
		 		sugar_rate: (data.taux_sucre_moyen_1 !== 'NA') ? data.taux_sucre_moyen_1 : null,
		 		weight_real: data.poids_grappe_moyen_2,
		 		sugar_rate_real: (data.taux_sucre_moyen_2 !== 'NA') ? data.taux_sucre_moyen_2 : null
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
		date: '2018-05-02',
		type: 1,
		description: 'Oïdiun détecté sur une dizaine de pieds.',
		lat: 43.5896523,
		lng: 1.548562
	}, {
		id: 2,
		user_id: 1,
		date: '2018-07-26',
		type: 2,
		description: 'La tempête du 24 juillet a ravagé quelques pieds.',
		lat: 48.952147,
		lng: 4.4678
	}, {
		id: 3,
		user_id: 1,
		date: '2018-05-11',
		type: 1,
		description: 'Attention, mildiou !',
		lat: 49.014453,
		lng: 4.36601
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